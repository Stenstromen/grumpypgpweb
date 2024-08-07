import "@mantine/core/styles.css";
import { Container, MantineProvider, Space, Stack, Tabs } from "@mantine/core";
import Generate from "./components/Generate";
import Encrypt from "./components/Encrypt";
import {
  IconLock,
  IconLockOpen,
  IconSignature,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Container size="xl">
        <h1> OpenPGP Stuff </h1>
        <Space h="lg" />
        <Tabs variant="pills" defaultValue="generate">
          <Stack align="stretch" justify="center" gap="xl">
            <Tabs.List>
              <Tabs.Tab
                value="generate"
                leftSection={<IconSquareRoundedPlus />}
              >
                Generate
              </Tabs.Tab>
              <Tabs.Tab value="encrypt" leftSection={<IconLock />}>
                Encrypt
              </Tabs.Tab>
              <Tabs.Tab value="sign" leftSection={<IconSignature />}>
                Sign
              </Tabs.Tab>
              <Tabs.Tab value="decrypt" leftSection={<IconLockOpen />}>
                Decrypt
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="generate">
              <Generate />
            </Tabs.Panel>

            <Tabs.Panel value="encrypt">
              <Encrypt />
            </Tabs.Panel>

            <Tabs.Panel value="sign">Settings tab content</Tabs.Panel>

            <Tabs.Panel value="decrypt">Settings tab content</Tabs.Panel>
          </Stack>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}

export default App;
