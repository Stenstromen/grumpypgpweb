export type Curves =
  | "curve25519"
  | "ed25519"
  | "p256"
  | "p384"
  | "p521"
  | "brainpoolP256r1"
  | "brainpoolP384r1"
  | "brainpoolP512r1"
  | "secp256k1";

export type Key = {
  id: string;
  creationTime: Date;
  primaryUser: string;
  publicKey: string;
  privateKey: string;
};
