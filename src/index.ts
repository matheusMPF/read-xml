import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import moment from "moment";

const results: IData[] = [];
let i = 0;

const prisma = new PrismaClient();

type IData = {
  Address: string;
  AddressNumber: string;
  BirthDate: string;
  CEP: string;
  City: string;
  CivilStatus: "NULL" | "S" | "C" | "D" | "V" | "U";
  CreatedAt: string;
  DocumentId: string;
  MobilePhone: string;
  Name: string;
  Neighborhood: string;
  OtherDocumentId: string;
  OtherPhones: string;
  Profession: string;
  Sex: "NULL" | "F" | "M";
  id: string;
  state: string;
  emissor: string;
};

// Leitura do arquivo Excel
const workbook = XLSX.readFile("./clients.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Converte o conteúdo da planilha para um formato de JSON
const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, {
  header: 1,
  defval: "",
});
console.log(rawData);

rawData.forEach((row, index) => {
  // Ignora o cabeçalho (primeira linha) e verifica os dados
  if (index === 0) return;

  const dataRow: IData = {
    Address: row[0] || "",
    AddressNumber: row[1] || "",
    BirthDate: row[2] || "",
    CEP: row[3] || "",
    City: row[4] || "",
    CivilStatus: (row[5] as "NULL" | "S" | "C" | "D" | "V" | "U") || "NULL",
    CreatedAt: row[6] || "",
    DocumentId: row[7] || "",
    MobilePhone: row[8] || "",
    Name: row[9] || "",
    Neighborhood: row[10] || "",
    OtherDocumentId: row[11] || "",
    OtherPhones: row[12] || "",
    Profession: row[13] || "",
    Sex: (row[14] as "NULL" | "F" | "M") || "NULL",
    id: row[15] || "",
    state: row[16] || "",
    emissor: row[17] || "",
  };

  // Processa os dados
  const [rg, emissor] = dataRow.DocumentId.split(" ");
  dataRow.DocumentId = rg || "";
  dataRow.emissor = emissor || "";

  const date = moment(dataRow.BirthDate, "DD/MM/YYYY");
  dataRow.BirthDate = date.isValid() ? date.toISOString() : "";

  results.push(dataRow);
  i++;
});

// Salvando os dados no banco de dados
(async () => {
  await prisma.pacientes.createMany({
    data: results.map((result) => ({
      nome: result.Name,
      nascimento: result.BirthDate ?? null,
      unidade_id: 84,
      bairro: result.Neighborhood,
      cep: result.CEP,
      cidade: result.City ?? null,
      cpf: result.OtherDocumentId,
      complemento: result.Address,
      estado: result.state,
      genero: result.Sex,
      logradouro: result.Address,
      rg: result.DocumentId,
      orgao_emissor: result.emissor,
      telefone: result.MobilePhone,
      numero: result.AddressNumber,
    })),
  });
})();
