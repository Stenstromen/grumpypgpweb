import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  CopyButton,
  Divider,
  Grid,
  Group,
  Input,
  rem,
  Select,
  Tabs,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { EmailInput } from "./Atoms";
import { EncryptMessagePublicKey, FetchPublicKey } from "../crypto/Encrypt";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Key } from "../Types";
import { LoadAllKeys } from "../crypto/Store";

function Encrypt() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [encryptedMessage, setEncryptedMessage] = useState<string>("");
  const [keysArray, setKeysArray] = useState<Key[]>([]);

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [keysArray]);

  const EncryptMessageFromPublicKey = async () => {
    const encrypted = await EncryptMessagePublicKey(message, publicKey);
    setEncryptedMessage(encrypted.toString());
  };

  useEffect(() => {
    if (!email.includes("@") || !email.includes(".")) {
      return;
    }

    const timeout = setTimeout(() => {
      FetchPublicKey(email)
        .then((data) => {
          setPublicKey(data);
        })
        .catch((error) => {
          console.error(error);
          console.error("Error fetching public key");
        });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [email]);
  return (
    <div>
      <Tabs variant="outline" defaultValue="keysopenpgporg">
        <Tabs.List>
          <Tabs.Tab value="keysopenpgporg">Keys.OpenPGP.Org</Tabs.Tab>
          <Tabs.Tab value="publickey">Public Key</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="keysopenpgporg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <EmailInput email={email} setEmail={setEmail} />
              <Textarea
                label="Message"
                placeholder="Enter Message"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
              />
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={() => EncryptMessageFromPublicKey()}>
                  Encrypt
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                leftSection={
                  <CopyButton value={encryptedMessage} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? "Copied" : "Copy"}
                        withArrow
                        position="right"
                      >
                        <ActionIcon
                          color={copied ? "teal" : "gray"}
                          variant="subtle"
                          onClick={copy}
                          size={"100%"}
                        >
                          {copied ? (
                            <IconCheck style={{ width: rem(16) }} />
                          ) : (
                            <IconCopy style={{ width: rem(16) }} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                }
                label="Encrypted Message"
                placeholder="Encrypted message will appear here"
                rows={10}
                value={encryptedMessage}
                readOnly
                style={{ display: encryptedMessage ? undefined : "none" }}
              />
              <Textarea
                label="Public Key"
                placeholder="Fetch public key from keys.openpgp.org"
                rows={10}
                value={publicKey}
                readOnly
              />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="publickey">
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
                      setPublicKey(selectedKey.publicKey);
                    }
                  }}
                  onClear={() => setPublicKey("")}
                  clearable
                />
              </Input.Wrapper>

              <Textarea
                label="Message"
                placeholder="Enter Message"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
              />
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={() => EncryptMessageFromPublicKey()}>
                  Encrypt
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                leftSection={
                  <CopyButton value={encryptedMessage} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? "Copied" : "Copy"}
                        withArrow
                        position="right"
                      >
                        <ActionIcon
                          color={copied ? "teal" : "gray"}
                          variant="subtle"
                          onClick={copy}
                          size={"100%"}
                        >
                          {copied ? (
                            <IconCheck style={{ width: rem(16) }} />
                          ) : (
                            <IconCopy style={{ width: rem(16) }} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                }
                label="Encrypted Message"
                placeholder="Encrypted message will appear here"
                rows={10}
                value={encryptedMessage}
                readOnly
                style={{ display: encryptedMessage ? undefined : "none" }}
              />
              <Textarea
                label="Public Key"
                placeholder="Please Enter Public Key"
                rows={10}
                value={publicKey}
                onChange={(e) => setPublicKey(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="decrypt">Settings tab content</Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Encrypt;
