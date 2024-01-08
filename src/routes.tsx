import { createBrowserRouter } from "react-router-dom";
import Home from "@pages/Home";
import Uploader from "@pages/Uploader";
import Slideshow from "./pages/Slideshow";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/slideshow",
    element: <Slideshow />,
  },
  {
    path: "/uploader",
    element: <Uploader />,
  },
]);

export default router;
