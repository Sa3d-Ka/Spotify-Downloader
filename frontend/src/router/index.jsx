import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/layout";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  // Public student routes
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/playlist",
        element: <PlaylistPage />,
      },
      {
        path: "/tracks",
        element: <TracksPage />,
      },
      {
        path: "/download",
        element: <DownloadPage />,
      },
      {
        path: "/callback",
        element: <Callback />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  }
]);