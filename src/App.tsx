import "@mantine/core/styles.css";
import { lazy, Suspense, useEffect } from "react";
import {
  Container,
  MantineProvider,
  Skeleton,
  Space,
  Stack,
  Tabs,
} from "@mantine/core";
import {
  IconBrowserCheck,
  IconLock,
  IconLockOpen,
  IconShieldLock,
  IconSignature,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import BrowserStore from "./components/BrowserStore";
import { DefaultProvider, useDefaultProvider } from "./contexts/Default";
import { LoadAllKeys } from "./crypto/Store";

const Sus = () => {
  return (
    <>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </>
  );
};

const MainComponent = () => {
  const Generate = lazy(() => import("./components/Generate"));
  const Encrypt = lazy(() => import("./components/Encrypt"));
  const Sign = lazy(() => import("./components/Sign"));
  const Decrypt = lazy(() => import("./components/Decrypt"));
  const navigate = useNavigate();
  const { tabValue } = useParams();
  return (
    <DefaultProvider>
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

              <Tabs.Tab value="browserstore" leftSection={<IconBrowserCheck />}>
                BrowserStore&#8482;
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="generate">
              <Suspense fallback={<Sus />}>
                <Generate />
              </Suspense>
            </Tabs.Panel>

            <Tabs.Panel value="encrypt">
              <Suspense fallback={<Sus />}>
                <Encrypt />
              </Suspense>
            </Tabs.Panel>

            <Tabs.Panel value="sign">
              <Suspense fallback={<Sus />}>
                <Sign />
              </Suspense>
            </Tabs.Panel>

            <Tabs.Panel value="decrypt">
              <Suspense fallback={<Sus />}>
                <Decrypt />
              </Suspense>
            </Tabs.Panel>

            <Tabs.Panel value="browserstore">
              <Suspense fallback={<Sus />}>
                <BrowserStore />
              </Suspense>
            </Tabs.Panel>
          </Stack>
        </Tabs>
      </Container>
    </DefaultProvider>
  );
};

function App() {
  const { keysArray, setKeysArray } = useDefaultProvider();

  useEffect(() => {
    const keys = LoadAllKeys();
    setKeysArray(keys);
  }, [keysArray]);

  return (
    <MantineProvider defaultColorScheme="auto">
      <Router>
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/:tabValue" element={<MainComponent />} />
          <Route path="/:tabValue/:id" element={<MainComponent />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
