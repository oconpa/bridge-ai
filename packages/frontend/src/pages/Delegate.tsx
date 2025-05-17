import { FileUploader } from "@aws-amplify/ui-react-storage";

import {
  Container,
  ContentLayout,
  Header,
} from "@cloudscape-design/components";

export const Delegate = () => {
  return (
    <ContentLayout header={<Header variant="h1">Delegate</Header>}>
      <Container header={<Header variant="h2">Upload Spec</Header>}>
        <FileUploader path="spec/" maxFileCount={1} />
      </Container>
    </ContentLayout>
  );
};
