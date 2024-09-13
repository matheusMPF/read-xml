import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";
import moment from "moment";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

type IData = {
  address: string;
  addressNumber: string;
  birthDate: string;
  CEP: string;
  City: string;
  civilStatus: string;
  createdAt: string;
  documentId: string;
  mobilePhone: string;
  Name: string;
  neighborhood: string;
  otherDocumentId: string;
  otherPhones: string;
  profession: string;
  Sex: string;
  state: string;
  emissor: string;
  AddressComplement: string;
  unidade_id: number;
};

// Função para renomear colunas
function renameColumns(data: any[], renameMap: Record<string, string>): any[] {
  return data.map((row) => {
    const newRow: any = {};
    for (const col in row) {
      const newColName = renameMap[col] || col;
      newRow[newColName] = row[col];
    }
    return newRow;
  });
}

// Função para separar RG e órgão emissor
function separarRgEOrgao(rgCompleto: string) {
  rgCompleto = rgCompleto.trim();
  const partes = rgCompleto.split(" ");
  const rg = partes.slice(0, -1).join(" ");
  const orgao_emissor = partes[partes.length - 1];
  return { rg, orgao_emissor };
}

// Ler o arquivo Excel
const filePath = path.join(__dirname, "Patient.xlsx");
const workbook = XLSX.readFile(filePath);

// Selecionar a primeira planilha
const sheetName: string = workbook.SheetNames[0];
const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

// Converter os dados da planilha para JSON
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

// Definir o mapa de renomeação de colunas
const renameMap: Record<string, string> = {
  Address: "logradouro",
  AddressNumber: "numero",
  BirthDate: "nascimento",
  CEP: "cep",
  City: "cidade",
  CivilStatus: "estado_civil",
  CreatedAt: "createdAt",
  DocumentId: "rg",
  MobilePhone: "telefone",
  Name: "nome",
  Neighborhood: "bairro",
  otherDocumentId: "cpf",
  otherPhones: "numero2",
  profession: "profissao",
  Sex: "genero",
  state: "estado",
  emissor: "orgao_emissor",
  AddressComplement: "complemento",
  unidade_id: "unidade_id",
};

// Renomear as colunas
const renamedData = renameColumns(data, renameMap);

// Processamento de dados
const results = renamedData.map((row: any) => {
  // Separar RG e órgão emissor
  const { rg, orgao_emissor } = separarRgEOrgao(row.rg || "");
  console.log({ rg: rg });

  return {
    nome: row.nome || "",
    nascimento: row.nascimento
      ? moment(row.nascimento, "YYYY-MM-DD").toDate()
      : null,
    unidade_id: row.unidade_id || 91,
    bairro: row.bairro || "",
    cep: row.cep || "",
    cidade: row.cidade || "",
    cpf: row.cpf || "",
    numero: row.numero || "",
    logradouro: row.logradouro || "",
    estado: row.estado || "",
    complemento: row.complemento || "",
    rg,
    orgao_emissor,
    genero: row.genero || "",
    telefone: row.telefone || "",
    telefone2: row.numero2 || "",
    profissao: row.profissao || "",
  };
});

// Salvar os dados no banco de dados
(async () => {
  try {
    await prisma.pacientes.createMany({
      data: results,
    });
    console.log("Dados salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
})();
