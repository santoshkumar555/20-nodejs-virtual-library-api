export const sanitizeInput = (input) =>
    typeof input !== "string" ? input : input.trim().replace(/[<>]/g, "");
