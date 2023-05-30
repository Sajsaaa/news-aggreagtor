import { createBrowserRouter } from "react-router-dom";
import Default from "./components/Default";
import UserAuth from "./components/UserAuth";
import Login from "./views/login";
import SignUp from "./views/signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Default />,
    },
    {
        path: "/",
        element: <UserAuth />,
        children: [
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },
]);

export default router;
