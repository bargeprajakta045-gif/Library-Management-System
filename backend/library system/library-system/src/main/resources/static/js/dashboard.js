requireAdmin();

async function loadDashboard() {
    try {
        const [books, members, issues] = await Promise.all([
            apiRequest("/books"),
            apiRequest("/members"),
            apiRequest("/issues")
        ]);

        const activeIssues = issues.filter(issue => !issue.returnDate);
        const returnedIssues = issues.filter(issue => issue.returnDate);

        let fineTotal = 0;

        for (const issue of returnedIssues) {
            fineTotal += Number(issue.fine || 0);
        }

        document.getElementById("totalBooks").textContent =
            books.reduce((sum, book) => sum + Number(book.quantity || 0), 0);

        document.getElementById("totalMembers").textContent = members.length;
        document.getElementById("totalIssued").textContent = activeIssues.length;
        document.getElementById("totalReturned").textContent = returnedIssues.length;
        document.getElementById("totalFine").textContent = "₹" + fineTotal;

    } catch (error) {
        showMessage("Unable to load dashboard. Check backend.", "error");
    }
}

loadDashboard();