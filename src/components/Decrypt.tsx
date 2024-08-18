import { useState } from "react";
import { DecryptMessagePrivateKey } from "../crypto/Decrypt";
import {
  Button,
  Divider,
  Grid,
  Group,
  PasswordInput,
  Stack,
  Tabs,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPasswordUser } from "@tabler/icons-react";

function Decrypt() {
  const [message, setMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [visible, { toggle }] = useDisclosure(false);

  const decrypt = async () => {
    const decrypted = await DecryptMessagePrivateKey(
      message,
      privateKey,
      passphrase
    );
    setDecryptedMessage(decrypted);
  };

  return (
    <div>
      <Tabs variant="outline" defaultValue="privatekey">
        <Tabs.List>
          <Tabs.Tab value="privatekey">Private Key</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="privatekey">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
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