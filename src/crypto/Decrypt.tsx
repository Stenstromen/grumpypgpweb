import * as openpgp from "openpgp";

export const DecryptMessagePrivateKey = async (
  encryptedMessage: string,
  privateKeyArmored: string,
  passphrase: string
) => {
  const message = await openpgp.readMessage({
    armoredMessage: encryptedMessage,
  });

  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  });

  const decrypted = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decrypted.data.toString();
};
