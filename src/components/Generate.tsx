import { useEffect, useState } from "react";
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
import { IconAlertCircle, IconChevronDown } from "@tabler/icons-react";
import {
  CommentInput,
  EmailInput,
  KeyPairOutput,
  NameInput,
  PasswordInputs,
} from "./Atoms";
import { Curves } from "../Types";
import { LoadAllKeys, SaveKeys } from "../crypto/Store";
import { useDefaultProvider } from "../contexts/Default";

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
  const [loading, setLoading] = useState<"ecc" | "rsa" | "save" | "">("");
  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState<string>("");
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
  const { setKeysArray } = useDefaultProvider();

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [loading, setKeysArray]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 2000);
    return () => clearTimeout(timeout);
  }, [error]);

  const GenerateKeyButton = ({ keyType }: { keyType: "ecc" | "rsa" }) => {
    return (
      <Button loading={loading === keyType} onClick={genKey.bind(null, keyType)}>
        {error ? (
          <>
            <IconAlertCircle color="red" size={32} /> {error}
          </>
        ) : (
          "Generate"
        )}
      </Button>
    );
  };

  const genKey = async (keyType: "ecc" | "rsa") => {
    if (!passphrase || !confirmPassphrase) {
      setError("Please enter a passphrase!");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError("Passwords do not match!");
      return;
    }


    setLoading(keyType);
    let privateKey: string;
    let publicKey: string;

    if (keyType === "ecc") {
      const keyPair = await GenerateECCKeypair(
        curve,
        name,
        email,
        comment,
        passphrase,
      );
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    } else if (keyType === "rsa") {
      const keyPair = await GenerateRSAKeypair(
        bits,
        name,
        email,
        comment,
        passphrase,
      );
      privateKey = keyPair.privateKey;
      publicKey = keyPair.publicKey;
    } else {
      setError("Invalid key type!");
      setLoading("");
      return;
    }

    setPublicKey(publicKey);
    setPrivateKey(privateKey);
    setError("");
    setLoading("");
  };

  const SaveKeysButton = () => {
    return (
      <Button fullWidth loading={loading === "save"} onClick={handleSaveKeys}>
        Save to BrowserStore
      </Button>
    );
  };

  const handleSaveKeys = () => {
    setLoading("save");
    setTimeout(() => {
      SaveKeys(publicKey, privateKey);
      setLoading("");
    }, 1000);
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
                <GenerateKeyButton keyType={"rsa"} />
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <KeyPairOutput publicKey={publicKey} privateKey={privateKey} />
              <Divider my="xs" size="sm" labelPosition="center" />
              <SaveKeysButton />
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
                      <option key={curve} value={curve.toLowerCase()}>
                        {curve}
                      </option>
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
                <GenerateKeyButton keyType={"ecc"} />
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <KeyPairOutput publicKey={publicKey} privateKey={privateKey} />
              <Divider my="xs" size="sm" labelPosition="center" />
              <SaveKeysButton />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Generate;
