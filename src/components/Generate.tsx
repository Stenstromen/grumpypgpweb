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
  const [curve, setCurve] = useState<Curves>("curve25519Legacy");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>("");
  const [bits, setBits] = useState<2048 | 4096>(4096);
  const [loading, setLoading] = useState<"ecc" | "rsa" | "save" | "">("");
  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState<string>("");
  const eccCurves: { label: string; value: Curves }[] = [
    { label: "Curve25519", value: "curve25519Legacy" },
    { label: "Ed25519", value: "ed25519Legacy" },
    { label: "P256", value: "nistP256" },
    { label: "P384", value: "nistP384" },
    { label: "P521", value: "nistP521" },
    { label: "BrainpoolP256r1", value: "brainpoolP256r1" },
    { label: "BrainpoolP384r1", value: "brainpoolP384r1" },
    { label: "BrainpoolP512r1", value: "brainpoolP512r1" },
    { label: "Secp256k1", value: "secp256k1" },
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
      <Button
        loading={loading === keyType}
        onClick={genKey.bind(null, keyType)}
      >
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
                    {eccCurves.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
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
