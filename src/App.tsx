import "@mantine/core/styles.css";
import { MantineProvider, Tabs } from "@mantine/core";
import Generate from "./components/Generate";
import Encrypt from "./components/Encrypt";

function App() {
  return (
    <>
      <MantineProvider defaultColorScheme="auto">
        <Tabs variant="pills" defaultValue="generate">
          <Tabs.List>
            <Tabs.Tab value="generate">Generate</Tabs.Tab>
            <Tabs.Tab value="encrypt">Encrypt</Tabs.Tab>
            <Tabs.Tab value="decrypt">Decrypt</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="generate">
            <Generate />
          </Tabs.Panel>

          <Tabs.Panel value="encrypt">
            <Encrypt />
          </Tabs.Panel>

          <Tabs.Panel value="decrypt">Settings tab content</Tabs.Panel>
        </Tabs>
      </MantineProvider>
    </>
  );
}

export default App;
