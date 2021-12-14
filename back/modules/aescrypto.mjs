
import crypto from 'crypto';


const ENC_KEY = process.env.AESENCKEY; // set random encryption key
const IV = process.env.AESIV; // set random initialisation vector
const phrase = process.env.AESPASSPHRASE;

var decrypt = ((encrypted) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});

const encrypt = (text) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export { encrypt, decrypt }