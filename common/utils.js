var sha1 = require("sha1");
const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = crypto.randomBytes(16);

function getHash(input) {
  if (!input || typeof input !== "string") return "";
  return sha1(input);
}

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function decrypt(hash) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

function parseId(passportUsr) {
  if (!passportUsr.emails || !passportUsr.emails.length) return passportUsr.id;
  return passportUsr.emails[0].value;
}
module.exports = { getHash, encrypt, decrypt, parseId };
