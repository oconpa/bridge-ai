import { AppLayout, SideNavigation } from "@cloudscape-design/components";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
import { Outlet } from "react-router";
import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    applyMode(Mode.Dark);
  }, []);

  return (
    <AppLayout
      // breadcrumbs={
      //   <BreadcrumbGroup
      //     items={[
      //       { text: "Home", href: "#" },
      //       { text: "Service", href: "#" },
      //     ]}
      //   />
      // }
      navigationOpen={true}
      navigation={
        <SideNavigation
          header={{
            href: "/",
            text: "Bridge AI",
          }}
          items={[
            { type: "link", text: "Home", href: "/" },
            { type: "link", text: "Delegate", href: "/delegate" },
          ]}
        />
      }
      content={<Outlet />}
    />
  );
};
