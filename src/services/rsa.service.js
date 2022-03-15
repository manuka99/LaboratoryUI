import { pki, util } from "node-forge";

const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
const PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";
const PRIVATE_KEY_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
const PRIVATE_KEY_FOOTER = "-----END RSA PRIVATE KEY-----";

export const CreateRSAKeyPair = async () => {
  return new Promise(resolve => {
    var rsa = pki.rsa;
    rsa.generateKeyPair({ bits: 1024, workers: 2 }, function(err, keypair) {
      if (err) resolve(null);
      else {
        var pubKeyPEM = pki.publicKeyToPem(keypair.publicKey);
        var privKeyPEM = pki.privateKeyToPem(keypair.privateKey);
        const publicKey = pubKeyPEM
          .replace(PUBLIC_KEY_HEADER, "")
          .replace(PUBLIC_KEY_FOOTER, "")
          .trim();
        const privateKey = privKeyPEM
          .replace(PRIVATE_KEY_HEADER, "")
          .replace(PRIVATE_KEY_FOOTER, "")
          .trim();
        resolve({
          publicKey,
          privateKey
        });
      }
    });
  });
};

export const PublicKeyFromRawPublic = (rawPublicKey) => {
  try {
    var publicKey = pki.publicKeyFromPem(
      PUBLIC_KEY_HEADER + rawPublicKey + PUBLIC_KEY_FOOTER
    );
    return publicKey;
  } catch (error) {
    return null;
  }
};

export const EncryptWithRawPublicKey = (rawPublicKey, rawData) => {
  try {
    const publicKey = PublicKeyFromRawPublic(rawPublicKey);
    var encrypted = publicKey.encrypt(
      util.encodeUtf8(rawData),
      "RSAES-PKCS1-V1_5"
    );
    var encryptedBase64 = util.encode64(encrypted);
    return encryptedBase64;
  } catch (error) {
    return null;
  }
};