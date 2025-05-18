import { OllamaSpecGeneration } from "./OllamaSpecGeneration";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("http://localhost:8080/api/tabs")
      .then((res) => res.json())
      .then((data) => setLinks(data.urls))
      .catch((err) => console.error("❌ Error fetching tabs:", err));
  }, []);

  const set = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const remove = (index: number) => {
    setLinks((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
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
                        <SpaceBetween size="l">
                          <Input
                            value={link}
                            placeholder="https://example.com"
                            onChange={({ detail }) => set(index, detail.value)}
                          />
                          <Button
                            onClick={() => remove(index)}
                            iconName="remove"
                          />
                        </SpaceBetween>
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
