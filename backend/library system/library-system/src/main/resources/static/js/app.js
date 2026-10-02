const API_BASE_URL = "http://localhost:8080/api";

function showMessage(message, type = "success") {
    const element = document.getElementById("message");

    if (element) {
        element.textContent = message;
        element.className = "message " + type;
    }
}

async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE_URL + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || `Request failed: ${response.status}`);
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
   COMMON HTML SECURITY FUNCTION
   This is used by all JavaScript files
   ===================================================== */

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


/* =====================================================
   MEMBER SESSION
   ===================================================== */

function getLoggedInMember() {
    const member = sessionStorage.getItem("loggedInMember");

    return member ? JSON.parse(member) : null;
}


/* =====================================================
   ADMIN CHECK
   ===================================================== */

function requireAdmin() {
    if (sessionStorage.getItem("userRole") !== "admin") {
        window.location.href = "index.html";
    }
}


/* =====================================================
   MEMBER CHECK
   ===================================================== */

function requireMember() {
    if (!getLoggedInMember()) {
        window.location.href = "index.html";
    }
}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("loggedInMember");

    window.location.href = "index.html";
}


/* =====================================================
   LOGIN
   ===================================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const role = document.getElementById("role").value;
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            /* =========================
               ADMIN LOGIN
               ========================= */

            if (role === "admin") {

                if (
                    email === "admin@gmail.com" &&
                    password === "admin123"
                ) {

                    sessionStorage.setItem(
                        "userRole",
                        "admin"
                    );

                    window.location.href =
                        "dashboard.html";

                } else {

                    showMessage(
                        "Invalid admin email or password.",
                        "error"
                    );
                }

                return;
            }


            /* =========================
               MEMBER LOGIN
               ========================= */

            const member = await apiRequest(
                "/members/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            sessionStorage.setItem(
                "loggedInMember",
                JSON.stringify(member)
            );

            sessionStorage.setItem(
                "userRole",
                "member"
            );


            window.location.href =
                "memberbook.html";


        } catch (error) {

            console.error("Login Error:", error);

            showMessage(
                "Login failed. Check email, password and backend.",
                "error"
            );
        }

    });
}