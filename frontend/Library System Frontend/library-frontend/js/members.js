requireAdmin();

let membersCache = [];


/* =====================================================
   LOAD ALL MEMBERS
   ===================================================== */

async function loadMembers() {

    try {

        membersCache = await apiRequest("/members");

        renderMembers(membersCache);

    } catch (error) {

        console.error("Load Members Error:", error);

        showMessage(
            "Unable to load members.",
            "error"
        );
    }
}


/* =====================================================
   DISPLAY MEMBERS
   ===================================================== */

function renderMembers(members) {

    const table =
        document.getElementById("membersTable");

    table.innerHTML = "";


    if (!members || members.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No members found.
                </td>
            </tr>
        `;

        return;
    }


    members.forEach(member => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${member.id}</td>

            <td>
                ${escapeHtml(member.name)}
            </td>

            <td>
                ${escapeHtml(member.email)}
            </td>

            <td>
                ${escapeHtml(member.phone || "")}
            </td>

            <td>
                ${escapeHtml(member.address || "")}
            </td>

            <td>

                <button
                    onclick="editMember(${member.id})">
                    Edit
                </button>

                <button
                    class="btn-danger"
                    onclick="deleteMember(${member.id})">
                    Delete
                </button>

            </td>
        `;


        table.appendChild(row);
    });
}


/* =====================================================
   ADD / UPDATE MEMBER
   ===================================================== */

document
    .getElementById("memberForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const id =
            document.getElementById("memberId").value;


        const member = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            address:
                document
                    .getElementById("address")
                    .value
                    .trim()
        };


        const password =
            document
                .getElementById("password")
                .value;


        /* Password required for new member */

        if (!id && !password) {

            showMessage(
                "Password is required for a new member.",
                "error"
            );

            return;
        }


        /* Add password if entered */

        if (password) {

            member.password = password;
        }


        try {

            /* =========================
               UPDATE MEMBER
               ========================= */

            if (id) {

                await apiRequest(
                    "/members/" + id,
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(member)
                    }
                );


                showMessage(
                    "Member updated successfully."
                );

            }


            /* =========================
               ADD MEMBER
               ========================= */

            else {

                await apiRequest(
                    "/members",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(member)
                    }
                );


                showMessage(
                    "Member added successfully."
                );
            }


            resetMemberForm();

            await loadMembers();


        } catch (error) {

            console.error(
                "Save Member Error:",
                error
            );


            showMessage(
                "Could not save member. Check if email already exists.",
                "error"
            );
        }

    });


/* =====================================================
   EDIT MEMBER
   ===================================================== */

function editMember(id) {

    const member =
        membersCache.find(
            item => item.id === id
        );


    if (!member) {
        return;
    }


    document.getElementById("memberId").value =
        member.id;


    document.getElementById("name").value =
        member.name;


    document.getElementById("email").value =
        member.email;


    document.getElementById("phone").value =
        member.phone || "";


    document.getElementById("address").value =
        member.address || "";


    /* Do not display existing password */

    document.getElementById("password").value =
        "";


    document.getElementById(
        "memberFormTitle"
    ).textContent =
        "Update Member";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   DELETE MEMBER
   ===================================================== */

async function deleteMember(id) {

    if (
        !confirm(
            "Are you sure you want to delete this member?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            "/members/" + id,
            {
                method: "DELETE"
            }
        );


        showMessage(
            "Member deleted successfully."
        );


        await loadMembers();


    } catch (error) {

        console.error(
            "Delete Member Error:",
            error
        );


        showMessage(
            "Could not delete member. Check related issue records.",
            "error"
        );
    }
}


/* =====================================================
   CLEAR FORM
   ===================================================== */

function resetMemberForm() {

    document
        .getElementById("memberForm")
        .reset();


    document.getElementById("memberId").value =
        "";


    document.getElementById(
        "memberFormTitle"
    ).textContent =
        "Add Member";
}


/* =====================================================
   START
   ===================================================== */

loadMembers();