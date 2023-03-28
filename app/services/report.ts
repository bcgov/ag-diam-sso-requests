import { instance } from './axios';
import { AxiosError } from 'axios';
import { handleAxiosError } from 'services/axios';
import * as XLSX from 'xlsx';

export const downloadAllStandardIntegrationsReport = async (): Promise<void | [null, AxiosError]> => {
  try {
    const result = await instance.get('reports/all-standard-integrations').then((res) => res.data);

    const workSheet = XLSX.utils.json_to_sheet(result);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'All standard integrations');
    XLSX.writeFile(workBook, 'All Standard Integrations.xlsx');
  } catch (err: any) {
    console.log(err);
    return handleAxiosError(err);
  }
};
