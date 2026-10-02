requireAdmin();

let booksCache = [];


/* =====================================================
   LOAD BOOKS
   ===================================================== */

async function loadBooks() {

    try {

        booksCache =
            await apiRequest("/books");

        renderBooks(booksCache);

    } catch (error) {

        console.error(
            "Load Books Error:",
            error
        );

        showMessage(
            "Unable to load books.",
            "error"
        );
    }
}


/* =====================================================
   DISPLAY BOOKS
   ===================================================== */

function renderBooks(books) {

    const table =
        document.getElementById("booksTable");

    table.innerHTML = "";


    if (!books || books.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    books.forEach(book => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${book.id}</td>

            <td>
                ${escapeHtml(book.bookName)}
            </td>

            <td>
                ${escapeHtml(book.author)}
            </td>

            <td>
                ${escapeHtml(book.category || "")}
            </td>

            <td>
                ${escapeHtml(book.isbn)}
            </td>

            <td>
                ${book.quantity}
            </td>

            <td>
                ${book.availableQuantity}
            </td>

            <td>

                <button
                    onclick="editBook(${book.id})">
                    Edit
                </button>

                <button
                    class="btn-danger"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>

            </td>
        `;


        table.appendChild(row);
    });
}


/* =====================================================
   ADD / UPDATE BOOK
   ===================================================== */

document
    .getElementById("bookForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const id =
            document.getElementById("bookId").value;


        const quantity =
            Number(
                document.getElementById("quantity").value
            );


        const availableQuantity =
            Number(
                document
                    .getElementById("availableQuantity")
                    .value
            );


        if (availableQuantity > quantity) {

            showMessage(
                "Available quantity cannot exceed total quantity.",
                "error"
            );

            return;
        }


        const book = {

            bookName:
                document
                    .getElementById("bookName")
                    .value
                    .trim(),

            author:
                document
                    .getElementById("author")
                    .value
                    .trim(),

            category:
                document
                    .getElementById("category")
                    .value
                    .trim(),

            isbn:
                document
                    .getElementById("isbn")
                    .value
                    .trim(),

            quantity:
                quantity,

            availableQuantity:
                availableQuantity
        };


        try {

            if (id) {

                await apiRequest(
                    "/books/" + id,
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(book)
                    }
                );


                showMessage(
                    "Book updated successfully."
                );

            } else {

                await apiRequest(
                    "/books",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(book)
                    }
                );


                showMessage(
                    "Book added successfully."
                );
            }


            resetBookForm();

            await loadBooks();


        } catch (error) {

            console.error(
                "Save Book Error:",
                error
            );


            showMessage(
                "Could not save book. Check ISBN and backend.",
                "error"
            );
        }

    });


/* =====================================================
   EDIT BOOK
   ===================================================== */

function editBook(id) {

    const book =
        booksCache.find(
            item => item.id === id
        );


    if (!book) {
        return;
    }


    document.getElementById("bookId").value =
        book.id;


    document.getElementById("bookName").value =
        book.bookName;


    document.getElementById("author").value =
        book.author;


    document.getElementById("category").value =
        book.category || "";


    document.getElementById("isbn").value =
        book.isbn;


    document.getElementById("quantity").value =
        book.quantity;


    document.getElementById(
        "availableQuantity"
    ).value =
        book.availableQuantity;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Update Book";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   DELETE BOOK
   ===================================================== */

async function deleteBook(id) {

    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {
        return;
    }


    try {

        await apiRequest(
            "/books/" + id,
            {
                method: "DELETE"
            }
        );


        showMessage(
            "Book deleted successfully."
        );


        await loadBooks();


    } catch (error) {

        console.error(
            "Delete Book Error:",
            error
        );


        showMessage(
            "Could not delete book.",
            "error"
        );
    }
}


/* =====================================================
   CLEAR BOOK FORM
   ===================================================== */

function resetBookForm() {

    document
        .getElementById("bookForm")
        .reset();


    document.getElementById("bookId").value =
        "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Book";
}


/* =====================================================
   SEARCH BOOKS
   ===================================================== */

async function searchBooks() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .trim();


    if (!keyword) {

        await loadBooks();

        return;
    }


    try {

        const result =
            await apiRequest(
                "/books/search?keyword=" +
                encodeURIComponent(keyword)
            );


        renderBooks(result);


    } catch (error) {

        console.error(
            "Search Error:",
            error
        );


        showMessage(
            "Search failed.",
            "error"
        );
    }
}


/* =====================================================
   START
   ===================================================== */

loadBooks();