import Swal from "sweetalert2";

export const showSuccess = (message) => {
    Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        timer: 1500,
        showConfirmButton: false
    });
};

export const showError = (message) => {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message
    });
};

export const showWarning = (message) => {
    Swal.fire({
        icon: "warning",
        title: "Warning",
        text: message
    });
};

export const showInfo = (message) => {
    Swal.fire({
        icon: "info",
        title: "Info",
        text: message
    });
};
