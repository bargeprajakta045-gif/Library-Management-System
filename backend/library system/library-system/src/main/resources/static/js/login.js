async function login() {

    alert("LOGIN FUNCTION WORKING");

    const loginType = document.getElementById("loginType").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    alert("Selected Login Type = " + loginType);

    // Check empty fields
    if (!username || !password) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Please enter username and password.
            </div>
        `;
        return;
    }

    try {

        // ================= ADMIN LOGIN =================

        if (loginType === "admin") {

            const data = await apiRequest("/admin/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Clear previous login
            localStorage.clear();

            localStorage.setItem("userType", "admin");
            localStorage.setItem("userId", data.id);

            // Go to Admin Dashboard
            window.location.href = "dashboard.html";

            return;
        }


        // ================= MEMBER LOGIN =================

        if (loginType === "member") {

            const data = await apiRequest("/members/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Clear previous login
            localStorage.clear();

            localStorage.setItem("userType", "member");
            localStorage.setItem("userId", data.id);

            // Go to Member Dashboard
            window.location.href = "member-dashboard.html";

            return;
        }

    } catch (error) {

        console.error("Login Error:", error);

        message.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;
    }
}