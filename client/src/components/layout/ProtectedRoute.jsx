import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { subscribeToPushNotifications } from "../../utils/pushSubscription";

function ProtectedRoute({
    children,
    loginPath,
    allowedRole
}) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        if (user) {
            subscribeToPushNotifications();
        }
    }, [user]);

    // User not logged in
    if (!user) {
        return <Navigate to={loginPath} />;
    }

    // Not logged in
    const roleHierarchy = {
        employee: 1,
        admin: 2,
        superadmin: 3
    };

    if (
        allowedRole &&
        roleHierarchy[user.role] < roleHierarchy[allowedRole]
    ) {
        return <Navigate to={loginPath} />;
    }

    return children;
}

export default ProtectedRoute;