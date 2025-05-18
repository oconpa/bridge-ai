import { createBrowserRouter } from "react-router";
import { Delegate } from "./pages/Delegate/Delegate";
import { App } from "./App";
import { Home } from "./pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/delegate",
        element: <Delegate />,
      },
    ],
  },
]);
