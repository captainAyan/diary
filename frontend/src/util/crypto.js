import CryptoJS from "crypto-js";

export function encrypt(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(cipher, key) {
  return CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8);
}
