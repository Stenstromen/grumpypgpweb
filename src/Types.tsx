export type Curves =
  | "curve25519Legacy"
  | "ed25519Legacy"
  | "nistP256"
  | "nistP384"
  | "nistP521"
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
  label?: string;
};
