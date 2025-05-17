import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
  SplitPanel,
  Tabs,
} from "@cloudscape-design/components";
import { useState } from "react";

const LabelForm = ({ labelId, labelName, onSubmit }) => {
  const [links, setLinks] = useState(["", "", "", "", ""]);

  const handleChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredLinks = links.filter((link) => link.trim() !== "");
    onSubmit(labelId, filteredLinks);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </SpaceBetween>
        }
        header={<Header variant="h1">{labelName} – Submit Links</Header>}
      >
        <Container
          header={<Header variant="h2">Up to 5 links for {labelName}</Header>}
        >
          <SpaceBetween direction="vertical" size="l">
            {links.map((link, index) => (
              <FormField label={`Link ${index + 1}`} key={index}>
                <Input
                  value={link}
                  placeholder="https://example.com"
                  onChange={({ detail }) => handleChange(index, detail.value)}
                />
              </FormField>
            ))}
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
};

export const App = () => {
  const handleFormSubmit = async (labelId, links) => {
    console.log(`Submitting links for ${labelId}:`, links);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: labelId,
          links,
        }),
      });
      const data = await res.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Error submitting links:", err);
    }
  };

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Home", href: "#" },
            { text: "Spec Generator", href: "#" },
          ]}
        />
      }
      content={}
      splitPanel={
        <SplitPanel header="Instructions">
          Enter up to 5 links related to the selected task category. Once
          submitted, the app will scrape the content, send it to Llama, and
          generate a spec sheet saved to the corresponding folder.
        </SplitPanel>
      }
    />
  );
};
