import "@mantine/core/styles.css";
import { Container, MantineProvider, Space, Stack, Tabs } from "@mantine/core";
import Generate from "./components/Generate";
import Encrypt from "./components/Encrypt";
import {
  IconBrowserCheck,
  IconLock,
  IconLockOpen,
  IconShieldLock,
  IconSignature,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";
import Decrypt from "./components/Decrypt";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Sign from "./components/Sign";
import BrowserStore from "./components/BrowserStore";

const MainComponent = () => {
  const navigate = useNavigate();
  const { tabValue } = useParams();
  return (
    <Container size="xl">
      <h1>
        {" "}
        <IconShieldLock /> GrumpyPGP Web{" "}
      </h1>
      <Space h="lg" />
      <Tabs
        variant="pills"
        defaultValue="generate"
        value={tabValue}
        onChange={(value) => navigate(`/${value}`)}
      >
        <Stack align="stretch" justify="center" gap="xl">
          <Tabs.List>
            <Tabs.Tab value="generate" leftSection={<IconSquareRoundedPlus />}>
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

            <Tabs.Tab value="browserstore" leftSection={<IconBrowserCheck />}>
              BrowserStore&#8482;
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="generate">
            <Generate />
          </Tabs.Panel>

          <Tabs.Panel value="encrypt">
            <Encrypt />
          </Tabs.Panel>

          <Tabs.Panel value="sign">
            <Sign />
          </Tabs.Panel>

          <Tabs.Panel value="decrypt">
            <Decrypt />
          </Tabs.Panel>
          <Tabs.Panel value="browserstore">
            <BrowserStore />
          </Tabs.Panel>
        </Stack>
      </Tabs>
    </Container>
  );
};

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Router>
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/:tabValue" element={<MainComponent />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
