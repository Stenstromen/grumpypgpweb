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
  //Select,
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
import { SaveToBrowserStore } from "../crypto/Store";
function Generate() {
  /*   type Key = {
    id: string;
    creationTime: Date;
    primaryUser: string;
    publicKey: string;
    privateKey: string;
  }; */
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  //const [keysArray, setKeysArray] = useState<Key[]>([]);
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

  const SaveKeys = async () => {
    let publicKeyID: string;
    let creationTime: Date;
    let primaryUser: string | undefined;

    try {
      const keypair = await openpgp.readKey({ armoredKey: publicKey });
      publicKeyID = keypair.getKeyIDs()[0].toHex();
      creationTime = keypair.getCreationTime();
      primaryUser = (await keypair.getPrimaryUser()).user.userID?.name;
    } catch (e) {
      console.error("Error reading public key", e);
      return;
    }

    const keys = {
      id: publicKeyID,
      creationTime: creationTime,
      primaryUser: primaryUser,
      publicKey: publicKey,
      privateKey: privateKey,
    };
    const keysString = JSON.stringify(keys);
    SaveToBrowserStore(publicKeyID, keysString);
  };

  /*   const LoadAllKeys = () => {
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
  }; */

  /*   useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, []); */
  return (
    <div>
      <Tabs variant="outline" defaultValue="ecc">
        <Tabs.List>
          <Tabs.Tab value="ecc">ECC</Tabs.Tab>
          <Tabs.Tab value="rsa">RSA</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="rsa">
          {/*           <Select
            label="Select a key"
            placeholder="Pick one"
            data={keysArray.map((key) => ({
              value: key.id,
              label: key.id,
            }))}
            onChange={(e) => {
              const selectedKey = keysArray.find((key) => key.id === e);
              if (selectedKey) {
                setPublicKey(selectedKey.publicKey);
                setPrivateKey(selectedKey.privateKey);
              }
            }}
            clearable
          /> */}
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
              <Divider my="xs" size="sm" labelPosition="center" />
              <Button fullWidth onClick={SaveKeys}>
                Save to BrowserStore
              </Button>
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
              <Divider my="xs" size="sm" labelPosition="center" />
              <Button fullWidth onClick={SaveKeys}>
                Save to BrowserStore
              </Button>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Generate;
