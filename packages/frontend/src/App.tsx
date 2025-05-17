import { I18nProvider } from "@cloudscape-design/components/i18n";

import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SplitPanel,
} from "@cloudscape-design/components";

import messages from "@cloudscape-design/components/i18n/messages/all.en";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { useEffect } from "react";

const LOCALE = "en";

export const App = () => {
  useEffect(() => {
    applyMode(Mode.Dark);
  }, []);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "#" },
              { text: "Service", href: "#" },
            ]}
          />
        }
        navigationOpen={true}
        navigation={
          <SideNavigation
            header={{
              href: "#",
              text: "Service name",
            }}
            items={[{ type: "link", text: `Page #1`, href: `#` }]}
          />
        }
        toolsOpen={true}
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <ContentLayout
            header={
              <Header variant="h1" info={<Link variant="info">Info</Link>}>
                Page header
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2" description="Container description">
                  Container header
                </Header>
              }
            >
              <div className="contentPlaceholder" />
            </Container>
          </ContentLayout>
        }
        splitPanel={
          <SplitPanel header="Split panel header">
            Split panel content
          </SplitPanel>
        }
      />
    </I18nProvider>
  );
};
