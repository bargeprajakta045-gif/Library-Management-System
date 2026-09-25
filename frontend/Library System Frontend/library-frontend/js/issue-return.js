requireAdmin();


/* =====================================================
   LOAD BOOKS AND MEMBERS
   ===================================================== */

async function loadOptions() {

    try {

        const [books, members] =
            await Promise.all([

                apiRequest("/books/available"),

                apiRequest("/members")
            ]);


        const bookSelect =
            document.getElementById("bookId");


        const memberSelect =
            document.getElementById("memberId");


        bookSelect.innerHTML =
            '<option value="">Select Book</option>';


        memberSelect.innerHTML =
            '<option value="">Select Member</option>';


        books.forEach(book => {

            const option =
                document.createElement("option");


            option.value =
                book.id;


            option.textContent =
                `${book.bookName} (Available: ${book.availableQuantity})`;


            bookSelect.appendChild(option);
        });


        members.forEach(member => {

            const option =
                document.createElement("option");


            option.value =
                member.id;


            option.textContent =
                `${member.name} - ${member.email}`;


            memberSelect.appendChild(option);
        });


    } catch (error) {

        console.error(
            "Load Options Error:",
            error
        );


        showMessage(
            "Unable to load books or members.",
            "error"
        );
    }
}


/* =====================================================
   ISSUE BOOK
   ===================================================== */

document
    .getElementById("issueForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const bookId =
            Number(
                document.getElementById("bookId").value
            );


        const memberId =
            Number(
                document.getElementById("memberId").value
            );


        if (!bookId || !memberId) {

            showMessage(
                "Select both book and member.",
                "error"
            );

            return;
        }


        try {

            await apiRequest(
                "/issues/issue",
                {
                    method: "POST",

                    body:
                        JSON.stringify({
                            bookId: bookId,
                            memberId: memberId
                        })
                }
            );


            showMessage(
                "Book issued successfully."
            );


            document
                .getElementById("issueForm")
                .reset();


            await loadOptions();

            await loadIssues();


        } catch (error) {

            console.error(
                "Issue Book Error:",
                error
            );


            showMessage(
                "Could not issue book. Check available quantity.",
                "error"
            );
        }

    });


/* =====================================================
   LOAD ALL ISSUES
   ===================================================== */

async function loadIssues() {

    try {

        const issues =
            await apiRequest("/issues");


        const table =
            document.getElementById("issuesTable");


        table.innerHTML = "";


        if (!issues || issues.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;">
                        No issue records found.
                    </td>
                </tr>
            `;

            return;
        }


        issues.forEach(issue => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${issue.id}</td>

                <td>
                    ${escapeHtml(
                        issue.book?.bookName || ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        issue.member?.name || ""
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

                        : `
                            <button
                                class="btn-success"
                                onclick="returnBook(${issue.id})">
                                Return
                            </button>
                        `
                    }

                </td>
            `;


            table.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Load Issues Error:",
            error
        );


        showMessage(
            "Unable to load issue records.",
            "error"
        );
    }
}


/* =====================================================
   RETURN BOOK
   ===================================================== */

async function returnBook(id) {

    if (
        !confirm(
            "Confirm book return?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            "/issues/return/" + id,
            {
                method: "PUT"
            }
        );


        showMessage(
            "Book returned successfully."
        );


        await loadIssues();

        await loadOptions();


    } catch (error) {

        console.error(
            "Return Book Error:",
            error
        );


        showMessage(
            "Could not return book.",
            "error"
        );
    }
}


/* =====================================================
   START
   ===================================================== */

loadOptions();

loadIssues();