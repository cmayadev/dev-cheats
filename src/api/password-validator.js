export function determineSecurity(password) {

    let security = 0;

    security += password.length;

    if (password.match(/[A-Z]/)) {
        security += 5;
    }

    if (password.match(/\d+/)) {
        security += 5;
    }

    if (password.match(/[!@#\$%^&*]/)) {
        security += 5;
    }

    if (security < 10) {
        return "veryWeak";
    } else if (security < 10) {
        return "weak";
    } else if (security < 20) {
        return "medium";
    } else if (security < 30) {
        return "strong";
    } else {
        return "veryStrong";
    }
}