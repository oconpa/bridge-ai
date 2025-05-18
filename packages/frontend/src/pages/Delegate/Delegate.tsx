import { FileUploader } from "@aws-amplify/ui-react-storage";
import { useListS3 } from "../../api/query";
import { useState } from "react";

import {
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components";
import { OllamaDelegate } from "./OllamaDelegate";
import { useGetDataS3 } from "../../api/mutation";

export const Delegate = () => {
  const list = useListS3("");

  const getData = useGetDataS3();

  const [selectedOption, setSelectedOption] = useState({});

  return (
    <ContentLayout header={<Header variant="h1">Delegate</Header>}>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Upload Spec</Header>}>
          <FileUploader path="" maxFileCount={1} />
        </Container>

        <Container header={<Header variant="h2">Delegate</Header>}>
          <Form>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="First field">
                <Select
                  selectedOption={selectedOption}
                  onChange={({ detail }) => {
                    setSelectedOption(detail.selectedOption);
                    getData.mutateAsync(detail.selectedOption.value ?? "");
                  }}
                  options={list.data?.items.map((item) => ({
                    label: item.path,
                    value: item.path,
                  }))}
                />
              </FormField>
            </SpaceBetween>
          </Form>
        </Container>
        {"value" in selectedOption && !getData.isPending && (
          <OllamaDelegate spec={getData} />
        )}
      </SpaceBetween>
    </ContentLayout>
  );
};
