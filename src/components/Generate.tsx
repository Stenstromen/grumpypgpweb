import { useState } from "react";
import * as openpgp from "openpgp";
import { GenerateECCKeypair, GenerateRSAKeypair } from "../crypto/Generate";
import {
  Button,
  Group,
  Input,
  Stack,
  Tabs,
  Grid,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import {
  CommentInput,
  EmailInput,
  KeyPairOutput,
  NameInput,
  PasswordInputs,
} from "./Atoms";
import { Curves } from "../Types";
function Generate() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [curve, setCurve] = useState<Curves>("curve25519");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>("");
  const [bits, setBits] = useState<2048 | 4096>(4096);
  const [visible, { toggle }] = useDisclosure(false);
  const eccCurves: string[] = [
    "Curve25519",
    "Ed25519",
    "P256",
    "P384",
    "P521",
    "BrainpoolP256r1",
    "BrainpoolP384r1",
    "BrainpoolP512r1",
    "Secp256k1",
  ];

  const genKey = async (keyType: "ecc" | "rsa") => {
    if (!passphrase || !confirmPassphrase) {
      alert("Please enter a passphrase!");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      alert("Passwords do not match!");
      return;
    }

    let privateKey: string;
    let publicKey: string;

    if (keyType === "ecc") {
      const keyPair: openpgp.SerializedKeyPair<string> =
        await GenerateECCKeypair(curve, name, email, comment, passphrase);
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    } else if (keyType === "rsa") {
      const keyPair: openpgp.SerializedKeyPair<string> =
        await GenerateRSAKeypair(bits, name, email, comment, passphrase);
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    } else {
      alert("Invalid key type!");
      return;
    }

    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  };

  return (
    <div>
      <Tabs variant="outline" defaultValue="ecc">
        <Tabs.List>
          <Tabs.Tab value="ecc">ECC</Tabs.Tab>
          <Tabs.Tab value="rsa">RSA</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="rsa">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Input.Wrapper
                label="RSA Bits"
                description="RSA key size, defaults to 4096"
              >
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
              </Input.Wrapper>
              <Group grow>
                <NameInput name={name} setName={setName} />
              </Group>
              <Group grow>
                <EmailInput email={email} setEmail={setEmail} />
              </Group>
              <Group grow>
                <CommentInput comment={comment} setComment={setComment} />
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Stack>
                  <PasswordInputs
                    {...{
                      passphrase,
                      setPassphrase,
                      confirmPassphrase,
                      setConfirmPassphrase,
                      visible,
                      toggle,
                    }}
                  />
                </Stack>
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={genKey.bind(null, "rsa")}>Generate</Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <KeyPairOutput publicKey={publicKey} privateKey={privateKey} />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
        <Tabs.Panel value="ecc">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
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
                    onChange={(e) => setCurve(e.currentTarget.value as Curves)}
                  >
                    {eccCurves.map((curve) => (
                      <option value={curve.toLowerCase()}>{curve}</option>
                    ))}
                  </Input>
                </Input.Wrapper>
              </Group>
              <Group grow>
                <NameInput name={name} setName={setName} />
              </Group>
              <Group grow>
                <EmailInput email={email} setEmail={setEmail} />
              </Group>
              <Group grow>
                <CommentInput comment={comment} setComment={setComment} />
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Stack>
                  <PasswordInputs
                    {...{
                      passphrase,
                      setPassphrase,
                      confirmPassphrase,
                      setConfirmPassphrase,
                      visible,
                      toggle,
                    }}
                  />
                </Stack>
              </Group>
              <Divider my="xs" size="sm" labelPosition="center" />
              <Group grow>
                <Button onClick={genKey.bind(null, "ecc")}>Generate</Button>
              </Group>
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

export default Generate;
