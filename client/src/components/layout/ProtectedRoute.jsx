// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { subscribeToPushNotifications } from "../../utils/pushSubscription";

// function ProtectedRoute({
//     children,
//     loginPath,
//     allowedRole
// }) {

//     const user = JSON.parse(
//         localStorage.getItem("user")
//     );

//     useEffect(() => {
//         if (user) {
//             subscribeToPushNotifications();
//         }
//     }, [user]);

//     // User not logged in
//     if (!user) {
//         return <Navigate to={loginPath} />;
//     }

//     // Not logged in
//     const roleHierarchy = {
//         employee: 1,
//         admin: 2,
//         superadmin: 3
//     };

//     if (
//         allowedRole &&
//         roleHierarchy[user.role] < roleHierarchy[allowedRole]
//     ) {
//         return <Navigate to={loginPath} />;
//     }

//     return children;
// }

// export default ProtectedRoute;






import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { subscribeToPushNotifications } from "../../utils/pushSubscription";
import { initiateSocketConnection, disconnectSocket } from "../../services/socket"; // <--- Socket services import kiye

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
            // 1. Browser push notifications subscribe karein
            subscribeToPushNotifications();

            // 2. Real-time Socket.io connect karein
            const socket = initiateSocketConnection(user.id);

            // 3. Backend se real-time "newNotification" event ka wait karein
            socket.on("newNotification", (data) => {
                console.log("Real-time socket notification received:", data);

                // Pure app me notification lists ko update karne ke liye custom event fire karein
                window.dispatchEvent(new Event("notificationsUpdated"));
            });

            return () => {
                // User log out hone par socket clean up karein
                socket.off("newNotification");
                disconnectSocket();
            };
        }
    }, [user]);

    // User not logged in
    if (!user) {
        return <Navigate to={loginPath} />;
    }

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