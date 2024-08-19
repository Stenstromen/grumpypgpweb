import * as openpgp from "openpgp";
import { Key } from "../Types";

const SaveToBrowserStore = async (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const LoadFromBrowserStore = (key: string) => {
  return localStorage.getItem(key);
};

export const LoadAllKeys = () => {
  const keysArray: Key[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.publicKey && parsedItem.privateKey) {
            keysArray.push(parsedItem);
          }
        } catch (e) {
          console.error("Error parsing item from localStorage", e);
        }
      }
    }
  }
  return keysArray;
};

export const SaveKeys = async (publicKey: string, privateKey: string) => {
  let publicKeyID: string;
  let creationTime: Date;
  let primaryUser: string | undefined;

  try {
    const keypair = await openpgp.readKey({ armoredKey: publicKey });
    publicKeyID = keypair.getKeyIDs()[0].toHex();
    creationTime = keypair.getCreationTime();
    primaryUser = (await keypair.getPrimaryUser()).user.userID?.name;
  } catch (e) {
    console.error("Error reading public key", e);
    return;
  }

  const keys = {
    id: publicKeyID,
    creationTime: creationTime,
    primaryUser: primaryUser,
    publicKey: publicKey,
    privateKey: privateKey,
  };
  const keysString = JSON.stringify(keys);
  SaveToBrowserStore(publicKeyID, keysString);
};
