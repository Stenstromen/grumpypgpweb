import { ActionIcon, Button, Grid, Group, Stack, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { KeyPairOutput } from "./Atoms";
import { IconTrash } from "@tabler/icons-react";
import { Key } from "../Types";
import { LoadAllKeys } from "../crypto/Store";

const useLoadKeys = () => {
  const [keysArray, setKeysArray] = useState<Key[]>([]);

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, []);

  return [keysArray, setKeysArray] as const;
};

function BrowserStore() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [keysArray, setKeysArray] = useLoadKeys();

  return (
    <div>
      <Tabs variant="outline" defaultValue="store">
        <Tabs.List>
          <Tabs.Tab value="store">BrowserStore</Tabs.Tab>
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
      </Tabs>
    </div>
  );
}

export default BrowserStore;
