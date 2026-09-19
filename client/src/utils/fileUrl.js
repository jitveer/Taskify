/**
 * Securely fetches and opens an attachment in a new tab without exposing the JWT in the URL.
 * It sends the token in the HTTP Authorization Header and creates an in-memory blob URL.
 * 
 * @param {string} fileUrl - e.g. "/uploads/1789464042965-714112223.png"
 * @param {string} [fileName] - Optional original file name
 */
export const openSecureFile = async (fileUrl, fileName = "file") => {
    if (!fileUrl) return;

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load file (${response.status})`);
        }

        // Response ko binary Blob me convert karte hain
        const blob = await response.blob();

        // In-memory safe blob URL create karte hain
        const blobUrl = window.URL.createObjectURL(blob);

        // New tab me safe blob URL open karte hain (address bar me sirf blob:http://... dikhega)
        window.open(blobUrl, "_blank", "noopener,noreferrer");

        // 1 minute baad memory clean up karte hain
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 60000);

    } catch (error) {
        console.error("Error opening secure file:", error);
        alert("Failed to open file. Please make sure you are logged in.");
    }
};
