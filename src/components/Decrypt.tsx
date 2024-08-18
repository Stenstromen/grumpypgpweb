import { useEffect, useState } from "react";
import { DecryptMessagePrivateKey } from "../crypto/Decrypt";
import {
  Button,
  Divider,
  Grid,
  Group,
  Input,
  PasswordInput,
  Select,
  Stack,
  Tabs,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPasswordUser } from "@tabler/icons-react";

function Decrypt() {
  type Key = {
    id: string;
    creationTime: Date;
    primaryUser: string;
    publicKey: string;
    privateKey: string;
  };
  const [message, setMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [keysArray, setKeysArray] = useState<Key[]>([]);
  const [visible, { toggle }] = useDisclosure(false);

  const decrypt = async () => {
    const decrypted = await DecryptMessagePrivateKey(
      message,
      privateKey,
      passphrase
    );
    setDecryptedMessage(decrypted);
  };

  const LoadAllKeys = () => {
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

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [keysArray]);

  return (
    <div>
      <Tabs variant="outline" defaultValue="privatekey">
        <Tabs.List>
          <Tabs.Tab value="privatekey">Private Key</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="privatekey">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Input.Wrapper label="PublicKey" description="Public PGP Key">
                <Select
                  placeholder="BrowserStore"
                  data={keysArray.map((key) => ({
                    value: key.id,
                    label: `${key.primaryUser} // ${key.id.slice(-8)}`,
                  }))}
                  onChange={(e) => {
                    const selectedKey = keysArray.find((key) => key.id === e);
                    if (selectedKey) {
                      setPrivateKey(selectedKey.privateKey);
                    }
                  }}
                  onClear={() => setPrivateKey("")}
                  clearable
                />
              </Input.Wrapper>
              <Textarea
                label="PGP Armored Message"
                placeholder="Enter PGP Armored Message"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
              />
              <Group grow>
                <Stack>
                  <PasswordInput
                    leftSection={<IconPasswordUser size={16} />}
                    label="Passphrase"
                    defaultValue={passphrase}
                    visible={visible}
                    onVisibilityChange={toggle}
                    onChange={(e) => setPassphrase(e.currentTarget.value)}
                  />
                </Stack>
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={() => decrypt()}>Decrypt</Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                label="Decrypted Message"
                rows={10}
                value={decryptedMessage}
                readOnly
                style={{ display: decryptedMessage ? undefined : "none" }}
              />
              <Textarea
                label="Private Key"
                placeholder="Please Enter Private Key"
                rows={10}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Decrypt;
