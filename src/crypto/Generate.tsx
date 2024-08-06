import * as openpgp from "openpgp";
import { Curves } from "../Types";

export const GenerateECCKeypair = async (
  curve: Curves,
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
