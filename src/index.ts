import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
const fs = require("fs");

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
// const workbook = XLSX.readFile("./clients.xlsx");
// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// Converte o conteúdo da planilha para um formato de JSON
// const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, {
//   header: 1,
//   defval: "",
// });

fs.createReadStream("./Patient.xlsx").on("data", (data: IData) => {
  // Processa os dados
  const [rg, emissor] = data.DocumentId.split(" ");
  data.DocumentId = rg || "";
  data.emissor = emissor || "";
  const date = moment(data.BirthDate, "DD/MM/YYYY");
  data.BirthDate = date.isValid() ? date.toISOString() : "";

  results.push(data);
  i++;
}).on("end", async () => {
  // Salvando os dados no banco de dados
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
});


