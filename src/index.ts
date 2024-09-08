import * as XLSX from "xlsx";

// Função para renomear colunas
function renameColumns(data: any[], renameMap: Record<string, string>): any[] {
  return data.map((row) => {
    const newRow: any = {};
    for (const col in row) {
      // Verificar se o nome da coluna existe no mapa de renomeação
      const newColName = renameMap[col] || col;
      newRow[newColName] = row[col];
    }
    return newRow;
  });
}

// Ler o arquivo Excel
const workbook: XLSX.WorkBook = XLSX.readFile(
  "backup/backup-caline-moura/Patient.xlsx"
);

// Selecionar a primeira planilha
const sheetName: string = workbook.SheetNames[0];
const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

// Converter os dados da planilha para JSON
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

// Definir o mapa de renomeação de colunas
const renameMap: Record<string, string> = {
  address: "logradouro",
  AddressComplement: "complemento",
  CEP: "cep",
  city: "cidade",
  name: "nome",
  BirthDate: "complemento",
};

// Renomear as colunas
const renamedData = renameColumns(data, renameMap);

// Criar uma nova planilha com os dados renomeados
const newWorksheet = XLSX.utils.json_to_sheet(renamedData);

// Substituir a planilha existente no workbook
workbook.Sheets[sheetName] = newWorksheet;

// Salvar o arquivo atualizado
XLSX.writeFile(
  workbook,
  "backup/backup-caline-moura/newBackup/newPatient.xlsx"
);

console.log("Colunas renomeadas com sucesso!");
