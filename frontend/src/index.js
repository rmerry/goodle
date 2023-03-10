import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root, { createEventAction } from "./routes/root";
import Event, {
  loader as eventLoader,
} from "./routes/event";
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './error-page';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    action: createEventAction,
  },
  {
    path: "event/:eventId",
    element: <Event />,
    loader: eventLoader,
    errorElement: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
