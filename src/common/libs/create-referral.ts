import { customAlphabet } from "nanoid";

const params = "ABCDEFGHOJKLMNOPQRSTUVWXYZ12345678920";
export const generateReferral = customAlphabet(params, 5);
