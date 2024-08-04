import * as openpgp from "openpgp";

export const GenerateECCKeypair = async (
  curve:
    | "curve25519"
    | "ed25519"
    | "p256"
    | "p384"
    | "p521"
    | "brainpoolP256r1"
    | "brainpoolP384r1"
    | "brainpoolP512r1"
    | "secp256k1",
    name: string,
    email: string,
    comment: string,
    passphrase: string
) => {
  const { privateKey, publicKey }: openpgp.SerializedKeyPair<string> =
    await openpgp.generateKey({
      type: "ecc",
      curve: curve,
      userIDs: [{ name: name, email: email, comment: comment }],
      passphrase: passphrase,
      format: "armored",
    });

  return {
    privateKey: privateKey,
    publicKey: publicKey,
  };
};

export const GenerateRSAKeypair = async (
  bits: 2048 | 4096,
  name: string,
  email: string,
  comment: string,
  passphrase: string
) => {
  const { privateKey, publicKey }: openpgp.SerializedKeyPair<string> =
    await openpgp.generateKey({
      type: "rsa",
      rsaBits: bits,
      userIDs: [{ name: name, email: email, comment: comment }],
      passphrase: passphrase,
      format: "armored",
    });

  return {
    privateKey: privateKey,
    publicKey: publicKey,
  };
};