import crypto from 'crypto';

const mnemonic = "where kingdom affair speak skin blanket bright case chunk citizen ecology way";

const salt =  crypto.randomBytes(32);
const initializationVector = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(
    "aes-256-gcm", 
    crypto.pbkdf2Sync(
        Buffer.from("123456", 'utf-8'), 
        salt,
        10000, 32, 'sha256'), 
    initializationVector);
const firstChunk = cipher.update(mnemonic);
const secondChunk = cipher.final();
const tag = cipher.getAuthTag();
const encryptedVault = Buffer.concat([firstChunk, secondChunk]);

let decryptedVault;

const start = Date.now();
const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    crypto.pbkdf2Sync(
        Buffer.from("123456", 'utf-8'), 
        salt,
        10000, 32, 'sha256'),
    initializationVector);
decipher.setAuthTag(tag);
const firstChunk2 = decipher.update(encryptedVault);
const secondChunk2 = decipher.final();
decryptedVault = Buffer.concat([firstChunk2, secondChunk2]).toString();
const end = Date.now();
console.log(decryptedVault);
console.log("Time for single triage when iteration of 10,000: "+(end-start)/1000+"s");