import { UserIcon } from "@heroicons/react/24/outline";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function UserAuth() {
    const { userToken } = useStateContext();

    if (userToken) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <UserIcon className="mx-auto h-12 w-auto rounded-full text-white" />
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}
