import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  Stack,
  Tabs,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { KeyPairOutput } from "./Atoms";
import { IconTrash } from "@tabler/icons-react";
import { LoadAllKeys, SaveKeys } from "../crypto/Store";
import { useDefaultProvider } from "../contexts/Default";

function BrowserStore() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKeyImport, setPublicKeyImport] = useState<string>("");
  const [privateKeyImport, setPrivateKeyImport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {keysArray, setKeysArray} = useDefaultProvider();

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [setKeysArray, loading]);

  const SaveKeysButton = () => {
    return (
      <Button fullWidth loading={loading} onClick={handleSaveKeys}>
        Save to BrowserStore
      </Button>
    );
  };

  const handleSaveKeys = () => {
    setLoading(true);
    setTimeout(() => {
      SaveKeys(publicKeyImport, privateKeyImport);
      setLoading(false);
    }, 1000);
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
                  <Group>
                    <Button
                      onClick={() => {
                        setPublicKey(key.publicKey);
                        setPrivateKey(key.privateKey);
                      }}
                    >
                      {key.primaryUser} // {key.id.slice(-8)} //{" "}
                      {key.creationTime.toString()}
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
                <p>Import a key by pasting it here</p>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                label="Public Key"
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
