import "@mantine/core/styles.css";
import { MantineProvider, Tabs } from "@mantine/core";
import Generate from "./components/Generate";

function App() {
  return (
    <>
      <MantineProvider>
        <Tabs variant="pills" defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery">Generate</Tabs.Tab>
            <Tabs.Tab value="messages">Encrypt</Tabs.Tab>
            <Tabs.Tab value="settings">Decrypt</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery">
            <Generate />
          </Tabs.Panel>

          <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

          <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
        </Tabs>
      </MantineProvider>
    </>
  );
}

export default App;
