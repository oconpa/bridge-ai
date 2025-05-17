import { FileUploader } from "@aws-amplify/ui-react-storage";
import { useListS3 } from "../api/query";
import { useState } from "react";

import {
  Button,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components";

export const Delegate = () => {
  const list = useListS3("");

  const [selectedOption, setSelectedOption] = useState({});

  return (
    <ContentLayout header={<Header variant="h1">Delegate</Header>}>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Upload Spec</Header>}>
          <FileUploader path="" maxFileCount={1} />
        </Container>

        <Container header={<Header variant="h2">Delegate</Header>}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Form actions={<Button variant="primary">Submit</Button>}>
              <SpaceBetween direction="vertical" size="l">
                <FormField label="First field">
                  <Select
                    selectedOption={selectedOption}
                    onChange={({ detail }) =>
                      setSelectedOption(detail.selectedOption)
                    }
                    options={list.data?.items.map((item) => ({
                      label: item.path,
                      value: item.path,
                    }))}
                  />
                </FormField>
              </SpaceBetween>
            </Form>
          </form>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};
