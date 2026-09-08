import crypto from "crypto";
import { getKey } from "./keyManager.js";

const algorithm = "aes-256-gcm";

export function encrypt(text: string, version: string) {
  const key = getKey(version);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string, version: string) {
  const key = getKey(version);

  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// const decryptedData = decrypt("2303c1b905057a260488c86237e28f13:0f35299fe2e51d76153febcf8c9fa53f1cf5eb7c54c1d28801b7e396f5505302680544f38f4ce83e9671ec74742a7163c2ff138d309aaf4fd873f4b9ac131b0381", "v1");
// console.log(decryptedData);
