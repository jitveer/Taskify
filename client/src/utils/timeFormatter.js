/**
 * Formats 24-hour time strings (e.g., "22:00", "14:30", "09:15") into 12-hour AM/PM format (e.g., "10:00 PM", "02:30 PM", "09:15 AM").
 * @param {string} timeStr - Time in "HH:mm" or "HH:mm:ss" format
 * @returns {string} - Formatted time string in 12-hour AM/PM format
 */
export const formatTime12Hour = (timeStr) => {
    if (!timeStr) return "10:00 AM";

    const str = timeStr.toString().trim();
    if (str.toUpperCase().includes("AM") || str.toUpperCase().includes("PM")) {
        return str;
    }

    const parts = str.split(":");
    if (parts.length < 2) return str;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].slice(0, 2).padStart(2, "0");

    if (isNaN(hours)) return str;

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}:${minutes} ${ampm}`;
};
