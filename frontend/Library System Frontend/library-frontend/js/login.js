/* =====================================================
   LOGIN
   ===================================================== */

async function login() {

    const loginType =
        document.getElementById("loginType").value;


    const username =
        document.getElementById("username").value.trim();


    const password =
        document.getElementById("password").value.trim();


    const message =
        document.getElementById("message");


    console.log(
        "Login Type:",
        loginType
    );


    console.log(
        "Username:",
        username
    );


    /* =================================================
       VALIDATION
       ================================================= */

    if (!loginType) {

        message.innerHTML =
            "Please select Admin or Member.";

        message.className =
            "message error";

        return;
    }


    if (!username || !password) {

        message.innerHTML =
            "Please enter username and password.";

        message.className =
            "message error";

        return;
    }


    try {


        /* =============================================
           ADMIN LOGIN
           ============================================= */

        if (loginType === "admin") {

            if (
                username === "admin" &&
                password === "admin123"
            ) {

                localStorage.clear();

                sessionStorage.clear();


                localStorage.setItem(
                    "userType",
                    "admin"
                );


                localStorage.setItem(
                    "userId",
                    "admin"
                );


                sessionStorage.setItem(
                    "userRole",
                    "admin"
                );


                window.location.href =
                    "dashboard.html";


                return;
            }


            throw new Error(
                "Invalid admin username or password."
            );
        }


        /* =============================================
           MEMBER LOGIN
           ============================================= */

        if (loginType === "member") {


            const data =
                await apiRequest(
                    "/members/login",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                username: username,
                                password: password
                            })
                    }
                );


            console.log(
                "MEMBER LOGIN SUCCESS:",
                data
            );


            /* Clear old login data */

            localStorage.clear();

            sessionStorage.clear();


            /* Save member login */

            localStorage.setItem(
                "userType",
                "member"
            );


            localStorage.setItem(
                "userId",
                data.id
            );


            /* Save complete member */

            sessionStorage.setItem(
                "loggedInMember",
                JSON.stringify(data)
            );


            sessionStorage.setItem(
                "userRole",
                "member"
            );


            /* Go to member dashboard */

            window.location.href =
                "memberbook.html";


            return;
        }

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        message.innerHTML =
            error.message ||
            "Login failed. Check username and password.";


        message.className =
            "message error";
    }
}