document.addEventListener("DOMContentLoaded", function () {
    loadMemberDashboard();
});

async function loadMemberDashboard() {

    const memberId = localStorage.getItem("userId");

    console.log("Member ID:", memberId);

    if (!memberId) {
        window.location.href = "index.html";
        return;
    }

    try {

        // Get member details
        const member = await apiRequest("/members/" + memberId);

        console.log("Member:", member);

        const memberName = document.getElementById("memberName");
        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");
        const profilePhone = document.getElementById("profilePhone");
        const profileAddress = document.getElementById("profileAddress");
        const issuedBooksBody = document.getElementById("issuedBooksBody");

        console.log("memberName:", memberName);
        console.log("profileName:", profileName);
        console.log("profileEmail:", profileEmail);
        console.log("profilePhone:", profilePhone);
        console.log("profileAddress:", profileAddress);
        console.log("issuedBooksBody:", issuedBooksBody);

        // Profile
        if (memberName) {
            memberName.textContent = member.name || "Member";
        }

        if (profileName) {
            profileName.textContent = member.name || "-";
        }

        if (profileEmail) {
            profileEmail.textContent = member.email || "-";
        }

        if (profilePhone) {
            profilePhone.textContent = member.phone || "-";
        }

        if (profileAddress) {
            profileAddress.textContent = member.address || "-";
        }

        // IMPORTANT
        if (!issuedBooksBody) {
            alert("issuedBooksBody element is missing. Please check member-dashboard.html");
            return;
        }

        // Get member's issued books
        const issues = await apiRequest(
            "/issues/member/" + memberId
        );

        console.log("Issues:", issues);

        issuedBooksBody.innerHTML = "";

        if (!issues || issues.length === 0) {

            issuedBooksBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        You have no issued books.
                    </td>
                </tr>
            `;

            return;
        }

        issues.forEach(function (issue) {

            const row = document.createElement("tr");

            const bookName =
                issue.book
                    ? issue.book.bookName
                    : "-";

            const status =
                issue.returnDate
                    ? "Returned"
                    : "Issued";

            row.innerHTML = `
                <td>${bookName}</td>
                <td>${issue.issueDate || "-"}</td>
                <td>${issue.dueDate || "-"}</td>
                <td>₹${issue.fine || 0}</td>
                <td>${status}</td>
            `;

            issuedBooksBody.appendChild(row);
        });

    } catch (error) {

        console.error("MEMBER DASHBOARD ERROR:", error);

        alert(
            "Unable to load member dashboard: " +
            error.message
        );
    }
}