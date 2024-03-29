import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/home/Home";
import Timetables from "./pages/timetables/Timetables";
import Wizard from "./pages/wizard/Wizard";
import Classes from "./pages/wizard/classes/Classes";
import Generate from "./pages/wizard/generate/Generate";
import Lessons from "./pages/wizard/lessons/Lessons";
import Rooms from "./pages/wizard/rooms/Rooms";
import Subjects from "./pages/wizard/subjects/Subjects";
import Teachers from "./pages/wizard/teachers/Teachers";
import { store } from "./store/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/timetables",
        element: <Auth />,
        children: [
          {
            path: "/timetables",
            element: <Timetables />,
          },
          {
            path: "/timetables/:timetableUid",
            element: <Wizard />,
            children: [
              {
                path: "/timetables/:timetableUid/rooms",
                element: <Rooms />,
              },
              {
                path: "/timetables/:timetableUid/teachers",
                element: <Teachers />,
              },
              {
                path: "/timetables/:timetableUid/subjects",
                element: <Subjects />,
              },
              {
                path: "/timetables/:timetableUid/classes",
                element: <Classes />,
              },
              {
                path: "/timetables/:timetableUid/classes/:classId/lessons",
                element: <Lessons />,
              },
              {
                path: "/timetables/:timetableUid/generate",
                element: <Generate />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
