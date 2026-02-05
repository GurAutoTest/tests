import xlsx from 'node-xlsx';
import * as fs from 'fs';

export class ExcelUtils {
    /**
     * Reads an Excel file and returns the data as an array of objects.
     * @param filePath - Path to the Excel file.
     * @param sheetIndex - Index of the sheet (defaults to 0).
     */
    static readExcelAsJson(filePath: string, sheetIndex: number = 0): any[] {
        if (!fs.existsSync(filePath)) {
            console.warn(`Excel file not found at ${filePath}`);
            return [];
        }

        const workSheetsFromFile = xlsx.parse(filePath);
        const sheet = workSheetsFromFile[sheetIndex];
        
        if (!sheet || !sheet.data || sheet.data.length === 0) {
            return [];
        }

        const rows = sheet.data;
        const headers = rows[0] as string[];
        const jsonData: any[] = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i] as any[];
            if (row.length === 0) continue;
            
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] !== undefined ? row[index] : '';
            });
            jsonData.push(obj);
        }

        return jsonData;
    }

    /**
     * Writes JSON data back to an Excel file.
     * @param filePath - Path to the Excel file.
     * @param data - Array of objects to write.
     * @param sheetName - Name of the sheet (defaults to 'TestData').
     */
    static writeJsonToExcel(filePath: string, data: any[], sheetName: string = 'TestData'): void {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const rows = [headers];

        data.forEach(item => {
            const row = headers.map(header => item[header] !== undefined ? item[header] : '');
            rows.push(row);
        });

        const buffer = xlsx.build([{ name: sheetName, data: rows, options: {} }]);
        fs.writeFileSync(filePath, buffer);
    }
}
