import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";
import moment from "moment";

const prisma = new PrismaClient();

type IData = {
    AddInfo: string,
    AtomicDate: Date,
    Clinic_BusinessId: number,
    CreateDate: Date,
    CreateUserId: number,
    CreatedBy: string,
    Dentist_PersonId: number,
    ListTagsId: string,
    MobilePhone: string,
    PatientName: string,
    Patient_PersonId: number,
    ScheduleToId: number,
    SelectedProceduresList: string,
    ToTestDate: string,
    _AccessPath: string,
    date: Date,
    fromTime: string,
    tags: string,
    toTime: string,
    wasEdited: string,
    unidade_id: 91
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

// Ler o arquivo Excel
const filePath = path.join(__dirname, 'Appointment.xlsx');
const workbook = XLSX.readFile(filePath);

// Selecionar a primeira planilha
const sheetName: string = workbook.SheetNames[0];
const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

// Converter os dados da planilha para JSON
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

console.log({data})

// Definir o mapa de renomeação de colunas
const renameMap: Record<string, string> = {
    AddInfo: "",
    AlertInfo: "{'ConfirmCliniMe': '', 'ConfirmSchedule': '0H', 'ConfirmWhats': '', 'AlertSchedule': '1D', 'AlertWhats': '', 'ConfirmSms': '', 'AlertCliniMe': '', 'AlertSms': ''}",
    AtomicDate: 20240822,
    Clinic_BusinessId: 5525635898802176,
    CreateDate: '2024-07-25T14:43:26.179Z',
    CreateUserId: 5920876774555648,
    CreatedBy: 'WEB',
    Dentist_PersonId: 5029258827399168,
    ListTagRetry: 'X',
    ListTagsId: '[6042472679342080]',
    MobilePhone: '81988436504',
    PatientName: 'Patrícia Maria da Silva Costa Valença',
    Patient_PersonId: 5924663599431680,
    ProceduresDuration: 0,
    SK_DateFirstTime: 920240822,
    ScheduleToId: 5029258827399168,
    SelectedProceduresList: '[]',
    ToTestDate: '2024-08-22T03:00:00.000Z',
    _AccessPath: '*.Calendar.Appointment.Create',
    date: '2024-08-22T03:00:00.000Z',
    fromTime: '15:20',
    id: '4636556126978048',
    tags: '[]',
    toTime: 'data_final',
    wasEdited: false,

};

// Renomear as colunas
const renamedData = renameColumns(data, renameMap);

// console.log({renamed: renamedData[0]})

// // Processar os dados para garantir que estejam no formato esperado
// const results = renamedData.map((row: any) => ({
//   nome: row.nome || '',
//   nascimento: row.nascimento ? moment(row.nascimento, "DD/MM/YYYY").toDate() : null,
//   unidade_id: row.unidade_id || 0,
//   bairro: row.bairro || '',
//   cep: row.cep || '',
//   cidade: row.cidade || '',
//   cpf: row.cpf || '',
//   numero: row.numero || '',
//   logradouro: row.logradouro || '',
//   estado: row.estado || '',
//   complemento: row.complemento || '',
//   rg: row.rg || '',
//   orgao_emissor: row.orgao_emissor || '',
//   genero: row.genero || '',
//   telefone: row.telefone || '',
//   telefone2: row.numero2 || '',
//   profissao: row.profissao || '',
// }));

// // Salvar os dados no banco de dados
// (async () => {
//   try {
//     await prisma.pacientes.createMany({
//       data: results
//     });
//     console.log('Dados salvos com sucesso!');
//   } catch (error) {
//     console.error('Erro ao salvar dados:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// })();

