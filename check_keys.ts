import { ExcelUtils } from './utils/excelUtils';
import path from 'path';

const excelFilePath = path.join(process.cwd(), 'test-data/loginpage1data.xlsx');
const loginData = ExcelUtils.readExcelAsJson(excelFilePath);
console.log('Keys:', Object.keys(loginData[0]));
console.log('Sample Row:', loginData[0]);
