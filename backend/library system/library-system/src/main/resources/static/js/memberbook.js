requireMember();


/* =====================================================
   CURRENT MEMBER
   ===================================================== */

const currentMember =
    getLoggedInMember();


if (!currentMember) {

    window.location.href =
        "index.html";
}


/* =====================================================
   DISPLAY MEMBER INFORMATION
   ===================================================== */

document.getElementById(
    "memberName"
).textContent =
    currentMember.name || "Member";


document.getElementById(
    "memberId"
).textContent =
    currentMember.id ?? "";


document.getElementById(
    "name"
).textContent =
    currentMember.name || "";


document.getElementById(
    "email"
).textContent =
    currentMember.email || "";


document.getElementById(
    "phone"
).textContent =
    currentMember.phone || "";


document.getElementById(
    "address"
).textContent =
    currentMember.address || "";


/* =====================================================
   MY ISSUES
   ===================================================== */

async function loadMyIssues() {

    try {

        const issues =
            await apiRequest(
                "/issues/member/" +
                currentMember.id
            );


        const table =
            document.getElementById(
                "myIssuesTable"
            );


        table.innerHTML = "";


        if (!issues || issues.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="text-align:center;">
                        No borrowed books found.
                    </td>
                </tr>
            `;

            return;
        }


        issues.forEach(issue => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        issue.book?.bookName || ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        issue.book?.author || ""
                    )}
                </td>

                <td>
                    ${issue.issueDate || ""}
                </td>

                <td>
                    ${issue.dueDate || ""}
                </td>

                <td>
                    ${issue.returnDate || "Not Returned"}
                </td>

                <td>
                    ₹${Number(issue.fine || 0)}
                </td>

                <td>
                    ${
                        issue.returnDate
                        ? "Returned"
                        : "Issued"
                    }
                </td>
            `;


            table.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Load My Issues Error:",
            error
        );


        showMessage(
            "Unable to load your borrowed books.",
            "error"
        );
    }
}


/* =====================================================
   AVAILABLE BOOKS
   ===================================================== */

async function loadAvailableBooks() {

    try {

        const books =
            await apiRequest(
                "/books/available"
            );


        renderAvailableBooks(
            books
        );


    } catch (error) {

        console.error(
            "Load Available Books Error:",
            error
        );


        showMessage(
            "Unable to load available books.",
            "error"
        );
    }
}


/* =====================================================
   DISPLAY AVAILABLE BOOKS
   ===================================================== */

function renderAvailableBooks(books) {

    const table =
        document.getElementById(
            "availableBooksTable"
        );


    table.innerHTML = "";


    if (!books || books.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;">
                    No available books found.
                </td>
            </tr>
        `;

        return;
    }


    books.forEach(book => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    book.bookName
                )}
            </td>

            <td>
                ${escapeHtml(
                    book.author
                )}
            </td>

            <td>
                ${escapeHtml(
                    book.category || ""
                )}
            </td>

            <td>
                ${escapeHtml(
                    book.isbn
                )}
            </td>

            <td>
                ${book.availableQuantity}
            </td>
        `;


        table.appendChild(row);
    });
}


/* =====================================================
   SEARCH AVAILABLE BOOKS
   ===================================================== */

async function searchAvailableBooks() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .trim();


    if (!keyword) {

        await loadAvailableBooks();

        return;
    }


    try {

        const books =
            await apiRequest(
                "/books/search?keyword=" +
                encodeURIComponent(keyword)
            );


        const availableBooks =
            books.filter(
                book =>
                    Number(
                        book.availableQuantity
                    ) > 0
            );


        renderAvailableBooks(
            availableBooks
        );


    } catch (error) {

        console.error(
            "Search Books Error:",
            error
        );


        showMessage(
            "Book search failed.",
            "error"
        );
    }
}


/* =====================================================
   MY RESERVATIONS
   ===================================================== */

async function loadMyReservations() {

    try {

        const reservations =
            await apiRequest(
                "/reservations/member/" +
                currentMember.id
            );


        const table =
            document.getElementById(
                "myReservationsTable"
            );


        table.innerHTML = "";


        if (
            !reservations ||
            reservations.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="3"
                        style="text-align:center;">
                        No reservations found.
                    </td>
                </tr>
            `;

            return;
        }


        reservations.forEach(reservation => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        reservation.book?.bookName || ""
                    )}
                </td>

                <td>
                    ${reservation.reservationDate || ""}
                </td>

                <td>
                    ${escapeHtml(
                        reservation.status || ""
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
            "Unable to load your reservations.",
            "error"
        );
    }
}


/* =====================================================
   START
   ===================================================== */

loadMyIssues();

loadAvailableBooks();

loadMyReservations();