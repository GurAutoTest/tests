import * as XLSX from 'xlsx';

export class ExcelUtils {
    /**
     * Reads an Excel file and returns the data as an array of objects.
     * @param filePath - Path to the Excel file.
     * @param sheetName - Name of the sheet to read (defaults to the first sheet).
     */
    static readExcelAsJson(filePath: string, sheetName?: string): any[] {
        const workbook = XLSX.readFile(filePath);
        const sheet = sheetName ? workbook.Sheets[sheetName] : workbook.Sheets[workbook.SheetNames[0]];
        if (!sheet) {
            throw new Error(`Sheet ${sheetName} not found in Excel file.`);
        }
        return XLSX.utils.sheet_to_json(sheet);
    }

    /**
     * Writes JSON data to an Excel file.
     * @param filePath - Path to the Excel file.
     * @param data - Array of objects to write.
     * @param sheetName - Name of the sheet (defaults to the first sheet).
     */
    static writeJsonToExcel(filePath: string, data: any[], sheetName?: string): void {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'TestData');
        XLSX.writeFile(workbook, filePath);
    }
}
