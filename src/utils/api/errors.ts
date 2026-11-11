import axios from "axios";

// errorMessage turns an API error (JSON {message} or plain text) into a readable message.
export const errorMessage = (error: unknown, fallback = "Something went wrong, please try again"): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === "string" && data.trim()) return data.trim();
        if (data && typeof data === "object" && "message" in data && data.message) return String(data.message);
    }
    return fallback;
};

// rowErrors returns per-row validation errors from an upload response, if any.
export const rowErrors = (error: unknown): string[] => {
    if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        if (Array.isArray(errors)) return errors.filter(Boolean).map(String);
    }
    return [];
};
