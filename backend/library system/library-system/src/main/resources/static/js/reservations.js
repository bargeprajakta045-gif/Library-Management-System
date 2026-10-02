requireAdmin();


/* =====================================================
   LOAD BOOKS AND MEMBERS
   ===================================================== */

async function loadReservationOptions() {

    try {

        const [books, members] =
            await Promise.all([

                apiRequest("/books"),

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
                book.bookName;


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
            "Load Reservation Options Error:",
            error
        );


        showMessage(
            "Unable to load reservation options.",
            "error"
        );
    }
}


/* =====================================================
   CREATE RESERVATION
   ===================================================== */

document
    .getElementById("reservationForm")
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
                "/reservations",
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
                "Reservation created successfully."
            );


            document
                .getElementById("reservationForm")
                .reset();


            await loadReservations();


        } catch (error) {

            console.error(
                "Reservation Error:",
                error
            );


            showMessage(
                "Could not create reservation.",
                "error"
            );
        }

    });


/* =====================================================
   LOAD RESERVATIONS
   ===================================================== */

async function loadReservations() {

    try {

        const reservations =
            await apiRequest(
                "/reservations"
            );


        const table =
            document.getElementById(
                "reservationsTable"
            );


        table.innerHTML = "";


        if (
            !reservations ||
            reservations.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="6"
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
                    ${reservation.id}
                </td>

                <td>
                    ${escapeHtml(
                        reservation.book?.bookName || ""
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        reservation.member?.name || ""
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

                <td>

                    <button
                        class="btn-danger"
                        onclick="deleteReservation(${reservation.id})">

                        Delete

                    </button>

                </td>
            `;


            table.appendChild(row);
        });


    } catch (error) {

        console.error(
            "Load Reservations Error:",
            error
        );


        showMessage(
            "Unable to load reservations.",
            "error"
        );
    }
}


/* =====================================================
   DELETE RESERVATION
   ===================================================== */

async function deleteReservation(id) {

    if (
        !confirm(
            "Delete this reservation?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            "/reservations/" + id,
            {
                method: "DELETE"
            }
        );


        showMessage(
            "Reservation deleted successfully."
        );


        await loadReservations();


    } catch (error) {

        console.error(
            "Delete Reservation Error:",
            error
        );


        showMessage(
            "Could not delete reservation.",
            "error"
        );
    }
}


/* =====================================================
   START
   ===================================================== */

loadReservationOptions();

loadReservations();