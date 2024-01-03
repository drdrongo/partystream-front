import { createBrowserRouter } from "react-router-dom";
import Home from "@pages/Home";
import Uploader from "@pages/Uploader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/uploader",
    element: <Uploader />,
  },
]);

export default router;
