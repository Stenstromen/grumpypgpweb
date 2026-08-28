import * as openpgp from "openpgp";
import { Key } from "../Types";

const SaveToBrowserStore = async (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const LoadFromBrowserStore = (key: string) => {
  return localStorage.getItem(key);
};

export const formatStoredKeyLabel = (
  key: Key,
  includeCreationTime = false,
) => {
  const name = key.label || key.primaryUser || "Unnamed";
  const shortId = key.id.slice(-8);
  if (includeCreationTime) {
    return `${name} // ${shortId} // ${key.creationTime.toString()}`;
  }
  return `${name} // ${shortId}`;
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

const derivePublicKey = async (privateKey: string) => {
  const priv = await openpgp.readPrivateKey({ armoredKey: privateKey });
  return priv.toPublic().armor();
};

export const SaveKeys = async (
  publicKey: string,
  privateKey: string,
  label?: string,
): Promise<Key | undefined> => {
  const trimmedPublic = publicKey.trim();
  const trimmedPrivate = privateKey.trim();
  const trimmedLabel = label?.trim();

  let armoredPublic = trimmedPublic;
  const armoredPrivate = trimmedPrivate;

  if (!armoredPublic && armoredPrivate) {
    try {
      armoredPublic = await derivePublicKey(armoredPrivate);
    } catch (e) {
      console.error("Error deriving public key from private key", e);
      return;
    }
  }

  if (!armoredPublic) {
    console.error("A public or private key is required");
    return;
  }

  let publicKeyID: string;
  let creationTime: Date;
  let primaryUser: string | undefined;

  try {
    const keypair = await openpgp.readKey({ armoredKey: armoredPublic });
    publicKeyID = keypair.getKeyIDs()[0].toHex();
    creationTime = keypair.getCreationTime();
    primaryUser = (await keypair.getPrimaryUser()).user.userID?.name;
  } catch (e) {
    console.error("Error reading public key", e);
    return;
  }

  const keys: Key = {
    id: publicKeyID,
    creationTime,
    primaryUser: primaryUser ?? "",
    publicKey: armoredPublic,
    privateKey: armoredPrivate,
    ...(trimmedLabel ? { label: trimmedLabel } : {}),
  };
  SaveToBrowserStore(publicKeyID, JSON.stringify(keys));
  return keys;
};
