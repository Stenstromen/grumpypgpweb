import * as openpgp from "openpgp";

export const EncryptMessagePublicKey = async (
  message: string,
  publicKeyArmored: string
) => {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: publicKey,
  });
  return encrypted
};

export const FetchPublicKey = async (email: string) => {
  const res = await fetch(`https://keys.openpgp.org/vks/v1/by-email/${email}`);
  if (res.status === 200) {
    const data = await res.text();
    return data;
  } else {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
};
