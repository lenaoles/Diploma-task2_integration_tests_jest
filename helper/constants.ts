import dotenv from 'dotenv';
dotenv.config();

export const baseUrl = "https://api.jsonbin.io/v3";

const envMasterKey = process.env.JSONBIN_MASTER_KEY;
const envAccessKey = process.env.JSONBIN_ACCESS_KEY;

if (!envMasterKey) {
  throw new Error('JSONBIN_MASTER_KEY is not set');
}

if (!envAccessKey) {
  throw new Error('JSONBIN_ACCESS_KEY is not set');
}

export const masterKey: string = envMasterKey;
export const accessKey: string = envAccessKey;