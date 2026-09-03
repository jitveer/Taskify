import Swal from "sweetalert2";

// Custom shared configuration for modern, rounded, glassmorphic look
const customSwal = Swal.mixin({
    customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
        actions: 'custom-swal-actions',
        icon: 'custom-swal-icon'
    },
    buttonsStyling: false,
    showClass: {
        popup: 'animate-swal-in'
    },
    hideClass: {
        popup: 'animate-swal-out'
    }
});

export const showSuccess = (message, title = "Success") => {
    return customSwal.fire({
        icon: "success",
        title: title,
        text: message,
        timer: 1500,
        showConfirmButton: false,
        showCancelButton: false,
        timerProgressBar: true,
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-html',
            actions: '!hidden',
            confirmButton: '!hidden',
            cancelButton: '!hidden',
            icon: 'custom-swal-icon'
        }
    });
};

export const showError = (message, title = "Error") => {
    return customSwal.fire({
        icon: "error",
        title: title,
        text: message,
        confirmButtonText: "Okay"
    });
};

export const showWarning = (message, title = "Warning") => {
    return customSwal.fire({
        icon: "warning",
        title: title,
        text: message,
        confirmButtonText: "Got it"
    });
};

export const showInfo = (message, title = "Information") => {
    return customSwal.fire({
        icon: "info",
        title: title,
        text: message,
        confirmButtonText: "Okay"
    });
};

export const showConfirm = async ({
    title = "Are you sure?",
    text = "This action cannot be undone.",
    confirmButtonText = "Yes, Continue",
    cancelButtonText = "Cancel",
    icon = "warning",
    isDestructive = false
} = {}) => {
    return await customSwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-html',
            confirmButton: isDestructive ? 'custom-swal-confirm-danger' : 'custom-swal-confirm',
            cancelButton: 'custom-swal-cancel',
            actions: 'custom-swal-actions',
            icon: 'custom-swal-icon'
        }
    });
};

export default customSwal;
