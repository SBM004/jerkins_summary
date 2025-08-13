// src/utils/getBuildStatus.js

// Helper to get CI status from item
function getCiStatus(items) {
    // You can adjust this logic based on your actual data structure
    // Example: if items.ciStatus exists, use it; otherwise, fallback to unknown
    if (typeof items.ciStatus === "string" && items.ciStatus.length > 0) {
        return items.ciStatus.toLowerCase();
    }
    // You can add more logic here if you have other CI status fields
    return "empty";
}

export function getBuildStatus(type, items) {
    // console.log("getBuildStatus called with type:", type, "and items:", items);
    switch (type) {
        case "bi":
            return items.distrofail === "" ? "passed" : "failed";

        case "ci":
            return getCiStatus(items);

        case "image":
            return items.distrosucc?.toLowerCase().includes("image")
                ? "passed"
                : "failed";

        case "binary":
            return items.distrofail === "" ? "passed" : "failed";

        default:
            return "unknown";
    }
}
