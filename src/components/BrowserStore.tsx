import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  Stack,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { KeyPairOutput } from "./Atoms";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import {
  formatStoredKeyLabel,
  LoadAllKeys,
  SaveKeys,
} from "../crypto/Store";
import { useDefaultProvider } from "../contexts/Default";

function BrowserStore() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKeyImport, setPublicKeyImport] = useState<string>("");
  const [privateKeyImport, setPrivateKeyImport] = useState<string>("");
  const [keyName, setKeyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const {keysArray, setKeysArray} = useDefaultProvider();

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [setKeysArray, loading]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  const SaveKeysButton = () => {
    return (
      <Button fullWidth loading={loading} onClick={handleSaveKeys}>
        {error ? (
          <>
            <IconAlertCircle color="red" size={32} /> {error}
          </>
        ) : (
          "Save to BrowserStore"
        )}
      </Button>
    );
  };

  const handleSaveKeys = async () => {
    if (!privateKeyImport.trim()) {
      setError("Private key is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const saved = await SaveKeys(
        publicKeyImport,
        privateKeyImport,
        keyName,
      );
      if (!saved) {
        setError("Could not import key. Check that it is valid.");
        return;
      }
      setPublicKeyImport(saved.publicKey);
      setPrivateKeyImport(saved.privateKey);
      setKeysArray(LoadAllKeys());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tabs variant="outline" defaultValue="store">
        <Tabs.List>
          <Tabs.Tab value="store">BrowserStore</Tabs.Tab>
          <Tabs.Tab value="import">Import</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="store">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              Click on a key to load it into the output area
              <Stack>
                {keysArray.map((key) => (
                  <Group key={key.id}>
                    <Button
                      onClick={() => {
                        setPublicKey(key.publicKey);
                        setPrivateKey(key.privateKey);
                      }}
                    >
                      {formatStoredKeyLabel(key, true)}
                    </Button>
                    <ActionIcon
                      size="input-sm"
                      color="red"
                      variant="filled"
                      onClick={() => {
                        localStorage.removeItem(key.id);
                        setKeysArray(LoadAllKeys());
                        setPublicKey("");
                        setPrivateKey("");
                      }}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <KeyPairOutput publicKey={publicKey} privateKey={privateKey} />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
        <Tabs.Panel value="import">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack>
                <p>
                  Paste a private key to import it. The public key is optional
                  and will be generated from the private key if left empty. Give
                  the key a custom name to identify it in the store.
                </p>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Name"
                description="Custom name for this key in the browser store"
                placeholder="My laptop key"
                value={keyName}
                onChange={(event) => setKeyName(event.currentTarget.value)}
              />
              <Textarea
                label="Public Key"
                description="Optional. Generated from the private key if omitted."
                value={publicKeyImport}
                rows={10}
                onChange={(event) =>
                  setPublicKeyImport(event.currentTarget.value)
                }
              />
              <Textarea
                label="Private Key"
                value={privateKeyImport}
                rows={10}
                onChange={(event) =>
                  setPrivateKeyImport(event.currentTarget.value)
                }
              />
              <Divider my="xs" size="sm" labelPosition="center" />
              <SaveKeysButton />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default BrowserStore;
