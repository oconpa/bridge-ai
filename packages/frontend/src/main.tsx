import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { StrictMode } from "react";

import "@cloudscape-design/global-styles/index.css";
import "@aws-amplify/ui-react/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
