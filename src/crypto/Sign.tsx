import * as openpgp from "openpgp";

export const SignMessagePrivateKey = async (
  message: string,
  privateKeyArmored: string,
  passphrase: string
) => {
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  });

  const unsignedMessage = await openpgp.createCleartextMessage({
    text: message,
  });

  const cleartextMessage = await openpgp.sign({
    config: {
      preferredHashAlgorithm: openpgp.enums.hash.sha1,
      commentString: "Signed with OpenPGP.js",
    },
    message: unsignedMessage,
    signingKeys: privateKey,
  });

  return cleartextMessage.toString();
};

export const VerifyMessagePublicKey = async (
  message: string,
  publicKeyArmored: string
) => {
  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const verificationResult = await openpgp.verify({
      message: await openpgp.readCleartextMessage({
        cleartextMessage: message,
      }),
      verificationKeys: publicKey,
    });

    const { verified, keyID } = verificationResult.signatures[0];
    await verified;
    return "Verified " + keyID.toHex().toString();
  } catch {
    return "COULDNOTVERIFY";
  }
};
