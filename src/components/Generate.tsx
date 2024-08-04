import { useState } from "react";
import * as openpgp from "openpgp";
import { GenerateECCKeypair, GenerateRSAKeypair } from "../crypto/Generate";
import {
  Button,
  Group,
  Input,
  CloseButton,
  PasswordInput,
  Stack,
  Tabs,
  Textarea,
  Grid,
  Divider,
  CopyButton,
  Tooltip,
  ActionIcon,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconTextColor,
  IconAt,
  IconChevronDown,
  IconHash,
  IconPasswordUser,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";

function Generate() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [curve, setCurve] = useState<
    | "curve25519"
    | "ed25519"
    | "p256"
    | "p384"
    | "p521"
    | "brainpoolP256r1"
    | "brainpoolP384r1"
    | "brainpoolP512r1"
    | "secp256k1"
  >("curve25519");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>("");
  const [bits, setBits] = useState<2048 | 4096>(4096);
  const [visible, { toggle }] = useDisclosure(false);

  const genEcc = async () => {
    if (!passphrase || !confirmPassphrase) {
      alert("Please enter a passphrase!");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      alert("Passwords do not match!");
      return;
    }
    const { privateKey, publicKey }: openpgp.SerializedKeyPair<string> =
      await GenerateECCKeypair(curve, name, email, comment, passphrase);
    console.log(privateKey);
    console.log(publicKey);
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  };

  const genRsa = async () => {
    if (!passphrase || !confirmPassphrase) {
      alert("Please enter a passphrase!");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      alert("Passwords do not match!");
      return;
    }
    const { privateKey, publicKey }: openpgp.SerializedKeyPair<string> =
      await GenerateRSAKeypair(bits, name, email, comment, passphrase);
    console.log(privateKey);
    console.log(publicKey);
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Tabs variant="outline" defaultValue="ecc">
            <Tabs.List>
              <Tabs.Tab value="ecc">ECC</Tabs.Tab>
              <Tabs.Tab value="rsa">RSA</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="rsa">
              <Group>
                <p>Bits</p>
                <Input
                  component="select"
                  rightSection={<IconChevronDown size={14} stroke={1.5} />}
                  pointer
                  mt="md"
                  value={bits}
                  onChange={(e) =>
                    setBits(parseInt(e.currentTarget.value) as 2048 | 4096)
                  }
                >
                  <option value="2048">2048</option>
                  <option value="4096">4096</option>
                </Input>
              </Group>
              <Group>
                <p>Name</p>
                <Input
                  value={name}
                  placeholder="Anonymous"
                  onChange={(e) => setName(e.currentTarget.value)}
                  rightSectionPointerEvents="all"
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setName("")}
                      style={{ display: name ? undefined : "none" }}
                    />
                  }
                />
              </Group>
              <Group>
                <p>Email</p>
                <Input
                  leftSection={<IconAt size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  rightSectionPointerEvents="all"
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setEmail("")}
                      style={{ display: email ? undefined : "none" }}
                    />
                  }
                />
              </Group>
              <Group>
                <p>Comment</p>
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.currentTarget.value)}
                  rightSectionPointerEvents="all"
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setComment("")}
                      style={{ display: comment ? undefined : "none" }}
                    />
                  }
                />
              </Group>
              <Group>
                <Stack>
                  <PasswordInput
                    label="Password"
                    defaultValue={passphrase}
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(e) => setPassphrase(e.currentTarget.value)}
                  />
                  <PasswordInput
                    label="Confirm password"
                    defaultValue={confirmPassphrase}
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(e) =>
                      setConfirmPassphrase(e.currentTarget.value)
                    }
                  />
                </Stack>
              </Group>
              <Button onClick={genRsa}>Generate</Button>
            </Tabs.Panel>
            <Tabs.Panel value="ecc">
              <Group grow>
                <Input.Wrapper
                  label="ECC Curve"
                  description="ECC curve name, defaults to curve25519"
                >
                  <Input
                    component="select"
                    rightSection={<IconChevronDown size={14} stroke={1.5} />}
                    pointer
                    mt="md"
                    value={curve}
                    onChange={(e) =>
                      setCurve(
                        e.currentTarget.value as
                          | "curve25519"
                          | "ed25519"
                          | "p256"
                          | "p384"
                          | "p521"
                          | "brainpoolP256r1"
                          | "brainpoolP384r1"
                          | "brainpoolP512r1"
                          | "secp256k1"
                      )
                    }
                  >
                    <option value="curve25519">Curve25519</option>
                    <option value="ed25519">Ed25519</option>
                    <option value="p256">P256</option>
                    <option value="p384">P384</option>
                    <option value="p521">P521</option>
                    <option value="brainpoolP256r1">BrainpoolP256r1</option>
                    <option value="brainpoolP384r1">BrainpoolP384r1</option>
                    <option value="brainpoolP512r1">BrainpoolP512r1</option>
                    <option value="secp256k1">Secp256k1</option>
                  </Input>
                </Input.Wrapper>
              </Group>
              <Group grow>
                <Input.Wrapper label="Name" description="Name of the key owner">
                  <Input
                    placeholder="Anonymous"
                    leftSection={<IconTextColor size={16} />}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    rightSectionPointerEvents="all"
                    rightSection={
                      <CloseButton
                        aria-label="Clear input"
                        onClick={() => setName("")}
                        style={{ display: name ? undefined : "none" }}
                      />
                    }
                  />
                </Input.Wrapper>
              </Group>
              <Group grow>
                <Input.Wrapper
                  label="Email"
                  description="Email of the key owner"
                >
                  <Input
                    placeholder="john.doe@example.com"
                    leftSection={<IconAt size={16} />}
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    rightSectionPointerEvents="all"
                    rightSection={
                      <CloseButton
                        aria-label="Clear input"
                        onClick={() => setEmail("")}
                        style={{ display: email ? undefined : "none" }}
                      />
                    }
                  />
                </Input.Wrapper>
              </Group>
              <Group grow>
                <Input.Wrapper
                  label="Comment"
                  description="Comment about the key"
                >
                  <Input
                    placeholder="Generated by OpenPGP.js"
                    leftSection={<IconHash size={16} />}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                    rightSectionPointerEvents="all"
                    rightSection={
                      <CloseButton
                        aria-label="Clear input"
                        onClick={() => setComment("")}
                        style={{ display: comment ? undefined : "none" }}
                      />
                    }
                  />
                </Input.Wrapper>
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Stack>
                  <PasswordInput
                    leftSection={<IconPasswordUser size={16} />}
                    label="Password"
                    defaultValue={passphrase}
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(e) => setPassphrase(e.currentTarget.value)}
                  />
                  <PasswordInput
                    leftSection={<IconPasswordUser size={16} />}
                    label="Confirm password"
                    defaultValue={confirmPassphrase}
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(e) =>
                      setConfirmPassphrase(e.currentTarget.value)
                    }
                  />
                </Stack>
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={genEcc}>Generate</Button>
              </Group>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Stack
            h={"auto"}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="xl"
            style={{ overflowY: "auto" }}
          >
            <Textarea
              leftSection={
                publicKey && (
                  <CopyButton value={publicKey} timeout={2000}>
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
                )
              }
              label="Public Key"
              value={publicKey}
              onChange={(e) => setPublicKey(e.currentTarget.value)}
              rows={10}
            />
            <Textarea
              leftSection={
                privateKey && (
                  <CopyButton value={privateKey} timeout={2000}>
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
                )
              }
              label="Private Key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.currentTarget.value)}
              rows={10}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Generate;
