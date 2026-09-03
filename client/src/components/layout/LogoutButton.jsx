import { useNavigate } from "react-router-dom";
import { showSuccess, showConfirm } from "./alerts";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await showConfirm({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            icon: "warning",
            isDestructive: true
        });

        if (result.isConfirmed) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            await showSuccess("Logged Out Successfully");
            navigate("/");
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;