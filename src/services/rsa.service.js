import { pki } from "node-forge";

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
