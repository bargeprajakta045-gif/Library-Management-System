const API_BASE_URL = "https://library-management-system-production-a628.up.railway.app/api";

/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showMessage(message, type = "success") {

    const element = document.getElementById("message");

    if (element) {

        element.textContent = message;

        element.className =
            "message " + type;
    }
}


/* =====================================================
   API REQUEST
   ===================================================== */

async function apiRequest(url, options = {}) {

    const response = await fetch(
        API_BASE_URL + url,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    const text = await response.text();


    if (!response.ok) {

        throw new Error(
            text || `Request failed: ${response.status}`
        );
    }


    if (!text) {

        return null;
    }


    try {

        return JSON.parse(text);

    } catch {

        return text;
    }
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]
    );
}


/* =====================================================
   GET LOGGED-IN MEMBER
   ===================================================== */

function getLoggedInMember() {

    const member =
        sessionStorage.getItem("loggedInMember");


    return member
        ? JSON.parse(member)
        : null;
}


/* =====================================================
   ADMIN PROTECTION
   ===================================================== */

function requireAdmin() {

    if (
        localStorage.getItem("userType") !== "admin"
    ) {

        window.location.href =
            "index.html";
    }
}


/* =====================================================
   MEMBER PROTECTION
   ===================================================== */

function requireMember() {

    if (
        localStorage.getItem("userType") !== "member"
    ) {

        window.location.href =
            "index.html";
    }
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem("userType");

    localStorage.removeItem("userId");

    sessionStorage.removeItem("loggedInMember");

    sessionStorage.removeItem("userRole");

    window.location.href =
        "index.html";
}