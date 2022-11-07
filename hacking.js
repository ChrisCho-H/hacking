import crypto from 'crypto';

const vault = {
    "data":"OuRsMbdDiwCs5J5QVbwF1McT5YgnG3en3X7tz162hYvyoL5xU73+eS48O6gLhFIeb0tBHI7Emy0cvKY=",
    "iv":"pPu0min8CYoL9fKT2op9uQ==",
    "salt":"K1Oo1sKjih5CdP9nyt/EQdWl8LWeNZmH5n7QYQDt8iY="} 


const encryptedDataMeta = Buffer.from(vault.data, 'base64').slice(0, 59-16);
const tagMeta = Buffer.from(vault.data, 'base64').slice(59-16, 59);
const saltMeta = Buffer.from(vault.salt, 'base64');
const ivMeta = Buffer.from(vault.iv, 'base64');


let decryptedVault;

// 600 password can be decrypted per second
const start = Date.now();
for (let pw = 10000000; pw <= 99999999; pw++){
    try {
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            crypto.pbkdf2Sync(
                Buffer.from(pw.toString(), 'utf-8'), 
                saltMeta,
                10000, 32, 'sha256'),
                ivMeta);
        decipher.setAuthTag(tagMeta);
        const firstChunk2 = decipher.update(encryptedDataMeta);
        const secondChunk2 = decipher.final();
        decryptedVault = Buffer.concat([firstChunk2, secondChunk2]).toString();
        console.log(decryptedVault);
        break;
    } catch (error) {
//        console.log(pw);
    }
    }
const end = Date.now();

console.log("Time to hack: "+(end-start)/1000+"s");

/*
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
const buf = Buffer.concat([firstChunk, secondChunk]);
console.log(tag.length);
console.log(buf.length);
*/
