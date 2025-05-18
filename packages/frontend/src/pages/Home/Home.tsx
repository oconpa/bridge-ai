import { OllamaSpecGeneration } from "./OllamaSpecGeneration";
import { useState } from "react";

import {
  Button,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
  Tabs,
} from "@cloudscape-design/components";

export const Home = () => {
  const [links, setLinks] = useState([""]);

  const set = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const tabs = [
    { id: "tax", label: "Tax" },
    { id: "job-search", label: "Job Search" },
    { id: "schedule-meetings", label: "Schedule Meetings" },
  ];

  return (
    <ContentLayout header={<Header variant="h1">Tab Synthesizer</Header>}>
      <Tabs
        tabs={tabs.map(({ id, label }) => ({
          label,
          id,
          content: (
            <Form>
              <SpaceBetween size={"l"}>
                <Container
                  header={<Header variant="h2">Provide tab links</Header>}
                >
                  <SpaceBetween direction="vertical" size="l">
                    {links.map((link, index) => (
                      <FormField label={`Link ${index + 1}`} key={index}>
                        <Input
                          value={link}
                          placeholder="https://example.com"
                          onChange={({ detail }) => set(index, detail.value)}
                        />
                      </FormField>
                    ))}

                    <Button
                      variant="link"
                      iconName="add-plus"
                      onClick={() => {
                        setLinks((prevItems) => [...prevItems, ""]);
                      }}
                    >
                      Add link
                    </Button>
                  </SpaceBetween>
                </Container>

                <OllamaSpecGeneration links={links} />
              </SpaceBetween>
            </Form>
          ),
        }))}
      />
    </ContentLayout>
  );
};
