import path from 'path';
import { getTimestamp } from './getTimestamp.js';

const { date, time } = getTimestamp();
export const reportFolder = path.join(__dirname,`../playwright-report/Test-Result-${date}_${time}`
);
