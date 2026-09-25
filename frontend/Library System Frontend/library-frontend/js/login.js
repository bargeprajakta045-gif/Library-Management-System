async function login()  {
    alert("LOGIN FUNCTION WORKING");
    const logintype = document.getElementById("loginType").value;

alert("Selected Login Type = " + loginType);

    const loginType = document.getElementById("loginType").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!username || !password) {
        message.innerHTML = `
            <div class="alert alert-danger">
                Please enter username/email and password.
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

            // Clear previous member login
            localStorage.clear();

            localStorage.setItem("userType", "admin");
            localStorage.setItem("userId", data.id);

            // ADMIN DASHBOARD
            window.location.href = "dashboard.html";

            return;
        }


        // ================= MEMBER LOGIN =================

        if (loginType === "member") {

            const data = await apiRequest("/members/login", {
                method: "POST",
                body: JSON.stringify({
                    email: username,
                    password: password
                })
            });

            // Clear previous admin login
            localStorage.clear();

            localStorage.setItem("userType", "member");
            localStorage.setItem("userId", data.id);

            // MEMBER DASHBOARD
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