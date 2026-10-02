requireMember();

const currentMember = getLoggedInMember();

if (!currentMember) {
    window.location.href = "index.html";
}


// ===============================
// MEMBER INFORMATION
// ===============================

const memberNameElement = document.getElementById("memberName");
const memberIdElement = document.getElementById("memberId");
const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const phoneElement = document.getElementById("phone");
const addressElement = document.getElementById("address");

if (memberNameElement) {
    memberNameElement.textContent = currentMember.name || "Member";
}

if (memberIdElement) {
    memberIdElement.textContent = currentMember.id ?? "";
}

if (nameElement) {
    nameElement.textContent = currentMember.name || "";
}

if (emailElement) {
    emailElement.textContent = currentMember.email || "";
}

if (phoneElement) {
    phoneElement.textContent = currentMember.phone || "";
}

if (addressElement) {
    addressElement.textContent = currentMember.address || "";
}


// ===============================
// MY BORROWED BOOKS
// ===============================

async function loadMyIssues() {

    try {

        const issues = await apiRequest(
            "/issues/member/" + currentMember.id
        );

        const table = document.getElementById("myIssuesTable");

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (!issues || issues.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No borrowed books found.
                    </td>
                </tr>
            `;

            return;
        }

        issues.forEach(issue => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHtml(issue.book?.bookName || "-")}</td>

                <td>${escapeHtml(issue.book?.author || "-")}</td>

                <td>${issue.issueDate || "-"}</td>

                <td>${issue.dueDate || "-"}</td>

                <td>${issue.returnDate || "Not Returned"}</td>

                <td>₹${Number(issue.fine || 0)}</td>

                <td>
                    ${issue.returnDate ? "Returned" : "Issued"}
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.error("Load My Issues Error:", error);

        showMessage(
            error.message || "Unable to load your borrowed books.",
            "error"
        );
    }
}


// ===============================
// AVAILABLE BOOKS
// ===============================

async function loadAvailableBooks() {

    try {

        // GET ALL BOOKS
        const books = await apiRequest("/books");

        // SHOW ONLY AVAILABLE BOOKS
        const availableBooks = (books || []).filter(book =>
            Number(book.availableQuantity || 0) > 0
        );

        renderAvailableBooks(availableBooks);

    } catch (error) {

        console.error("Load Available Books Error:", error);

        showMessage(
            error.message || "Unable to load available books.",
            "error"
        );
    }
}


// ===============================
// DISPLAY AVAILABLE BOOKS
// ===============================

function renderAvailableBooks(books) {

    const table = document.getElementById("availableBooksTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!books || books.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No available books found.
                </td>
            </tr>
        `;

        return;
    }

    books.forEach(book => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(book.bookName || "-")}
            </td>

            <td>
                ${escapeHtml(book.author || "-")}
            </td>

            <td>
                ${escapeHtml(book.category || "-")}
            </td>

            <td>
                ${escapeHtml(book.isbn || "-")}
            </td>

            <td>
                ${book.availableQuantity ?? 0}
            </td>
        `;

        table.appendChild(row);
    });
}


// ===============================
// SEARCH AVAILABLE BOOKS
// ===============================

async function searchAvailableBooks() {

    const searchElement =
        document.getElementById("searchInput");

    if (!searchElement) {
        return;
    }

    const keyword =
        searchElement.value.trim();

    if (!keyword) {

        await loadAvailableBooks();

        return;
    }

    try {

        const books = await apiRequest(
            "/books/search?keyword=" +
            encodeURIComponent(keyword)
        );

        const availableBooks =
            (books || []).filter(book =>
                Number(book.availableQuantity || 0) > 0
            );

        renderAvailableBooks(availableBooks);

    } catch (error) {

        console.error("Search Books Error:", error);

        showMessage(
            error.message || "Book search failed.",
            "error"
        );
    }
}


// ===============================
// MY RESERVATIONS
// ===============================

async function loadMyReservations() {

    try {

        const reservations = await apiRequest(
            "/reservations/member/" + currentMember.id
        );

        const table =
            document.getElementById("myReservationsTable");

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (!reservations || reservations.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center;">
                        No reservations found.
                    </td>
                </tr>
            `;

            return;
        }

        reservations.forEach(reservation => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${escapeHtml(
                        reservation.book?.bookName || "-"
                    )}
                </td>

                <td>
                    ${reservation.reservationDate || "-"}
                </td>

                <td>
                    ${escapeHtml(
                        reservation.status || "-"
                    )}
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Load My Reservations Error:",
            error
        );

        showMessage(
            "Reservations are not available yet.",
            "error"
        );
    }
}


// ===============================
// LOAD DATA
// ===============================

loadMyIssues();

loadAvailableBooks();

loadMyReservations();