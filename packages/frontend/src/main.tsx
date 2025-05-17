import { Authenticator } from "@aws-amplify/ui-react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { awsconfig } from "./aws-config.ts";
import { router } from "./routes.tsx";
import { Amplify } from "aws-amplify";
import { StrictMode } from "react";

import "@cloudscape-design/global-styles/index.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsconfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator hideSignUp variation="modal">
      {() => <RouterProvider router={router} />}
    </Authenticator>
  </StrictMode>
);
