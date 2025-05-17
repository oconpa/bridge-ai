import { createBrowserRouter } from "react-router";
import { Delegate } from "./pages/Delegate";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <></> },
      {
        path: "/delegate",
        element: <Delegate />,
      },
    ],
  },
]);
