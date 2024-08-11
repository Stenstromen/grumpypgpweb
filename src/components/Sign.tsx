import {
  Button,
  Textarea,
  Stack,
  PasswordInput,
  Tabs,
  Grid,
  Group,
  Divider,
  Tooltip,
  ActionIcon,
  rem,
  CopyButton,
  Chip,
  Center,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconCopy,
  IconPasswordUser,
  IconX,
} from "@tabler/icons-react";
import { /* useEffect, */ useState } from "react";
import { SignMessagePrivateKey, VerifyMessagePublicKey } from "../crypto/Sign";

function Sign() {
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [visible, { toggle }] = useDisclosure(false);

  const sign = async () => {
    const signed = await SignMessagePrivateKey(message, privateKey, passphrase);
    setSignedMessage(signed);
  };

  const verify = async () => {
    const verified = await VerifyMessagePublicKey(signedMessage, publicKey);
    setVerificationMessage(verified);
    console.log(verified);
  };

  return (
    <div>
      <Tabs variant="outline" defaultValue="privatekey">
        <Tabs.List>
          <Tabs.Tab value="privatekey">Sign</Tabs.Tab>
          <Tabs.Tab value="publickey">Verify</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="privatekey">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                label="Message"
                placeholder="Enter Message"
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
                <Button onClick={() => sign()}>Sign</Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                leftSection={
                  <CopyButton value={signedMessage} timeout={2000}>
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
                label="Decrypted Message"
                rows={10}
                value={signedMessage}
                readOnly
                style={{ display: signedMessage ? undefined : "none" }}
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
        <Tabs.Panel value="publickey">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Textarea
                label="Signed Message"
                placeholder="Enter Signed Message"
                rows={10}
                value={signedMessage}
                onChange={(e) => setSignedMessage(e.currentTarget.value)}
              />
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={() => verify()}>Verify</Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              {verificationMessage && (
                <Center h={80}>
                  <Box>
                    {verificationMessage.includes("COULDNOTVERIFY") ? (
                      <Chip
                        checked
                        color="red"
                        variant="light"
                        size="xl"
                        icon={
                          <IconX style={{ width: rem(16), height: rem(16) }} />
                        }
                      >
                        {verificationMessage}
                      </Chip>
                    ) : (
                      <Chip checked color="green" variant="light" size="xl">
                        {verificationMessage}
                      </Chip>
                    )}
                  </Box>
                </Center>
              )}
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
      </Tabs>
    </div>
  );
}

export default Sign;
