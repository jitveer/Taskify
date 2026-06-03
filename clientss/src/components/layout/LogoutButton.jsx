import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function LogoutButton() {

    const navigate = useNavigate();

    const handleLogout = () => {

        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (result.isConfirmed) {

                localStorage.removeItem("user");
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "success",
                    title: "Logged Out Successfully",
                    timer: 1500,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        });
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;