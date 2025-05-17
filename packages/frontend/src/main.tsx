import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticator } from "@aws-amplify/ui-react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { awsconfig } from "./aws-config.ts";
import { Amplify } from "aws-amplify";
import { router } from "./routes.tsx";
import { StrictMode } from "react";

import "@cloudscape-design/global-styles/index.css";
import "@aws-amplify/ui-react/styles.css";

const queryClient = new QueryClient();

Amplify.configure(awsconfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator hideSignUp variation="modal">
      {() => (
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      )}
    </Authenticator>
  </StrictMode>
);
