import path from 'path';

type LogFileType = "warn" | "error" | "info";
const logFolder: string = path.resolve(__dirname, "../..", "logs");


export const logFileName = (logFileType: LogFileType) => { return path.resolve(logFolder, `${logFileType}-log.txt`);};





    


