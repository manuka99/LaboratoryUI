var EncryptedTxPwd = null;

export const SetTxSecurityPwd = encryptedTxPwd => {
  EncryptedTxPwd = encryptedTxPwd;
};

export const GetTxSecurityPwd = () => {
  return EncryptedTxPwd;
};
