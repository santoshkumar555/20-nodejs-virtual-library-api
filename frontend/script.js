const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const BASE_URL = isLocal 
    ? "http://localhost:8000/api"   // your local backend
    : "/api";                        // same server on Render

let currentToken = localStorage.getItem("token") || "";

const API = {
    async request(endpoint, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };
        if (currentToken) {
            headers["Authorization"] = `Bearer ${currentToken}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();
        return { status: response.status, data };
    },

    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    },
    post(endpoint, body) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    },
    put(endpoint, body) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    },
    delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    },

    async postForm(endpoint, formData) {
        const headers = {};
        if (currentToken) {
            headers["Authorization"] = `Bearer ${currentToken}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });

        const data = await response.json();
        return { status: response.status, data };
    },

    async putForm(endpoint, formData) {
        const headers = {};
        if (currentToken) {
            headers["Authorization"] = `Bearer ${currentToken}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body: formData,
        });

        const data = await response.json();
        return { status: response.status, data };
    },
};

function displayResponse(elementId, status, data) {
    const el = document.getElementById(elementId);
    const statusClass = status >= 200 && status < 300 ? "success" : "error";
    el.innerHTML = `<span class="status-badge status-${status >= 500 ? "500" : status >= 400 ? (status === 401 ? "401" : "400") : "200"}">${status}</span>\n<pre class="${statusClass}">${JSON.stringify(data, null, 2)}</pre>`;
}

function saveToken() {
    currentToken = document.getElementById("tokenInput").value.trim();
    if (currentToken) {
        localStorage.setItem("token", currentToken);
        updateTokenStatus();
        alert("Token saved!");
    }
}

function loadToken() {
    currentToken = localStorage.getItem("token") || "";
    document.getElementById("tokenInput").value = currentToken;
    updateTokenStatus();
}

function clearToken() {
    currentToken = "";
    localStorage.removeItem("token");
    document.getElementById("tokenInput").value = "";
    updateTokenStatus();
}

function updateTokenStatus() {
    const status = document.getElementById("tokenStatus");
    if (currentToken) {
        status.innerHTML = `<span class="success">Token loaded (${currentToken.substring(0, 20)}...)</span>`;
    } else {
        status.innerHTML = `<span class="error">No token stored</span>`;
    }
}

function showSection(sectionId) {
    document
        .querySelectorAll(".tab-content")
        .forEach((el) => el.classList.remove("active"));
    document
        .querySelectorAll(".nav-btn")
        .forEach((el) => el.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    event.target.classList.add("active");
}

// Auth APIs
async function sendOtp() {
    const email = document.getElementById("sendOtpEmail").value;
    const res = await API.post("/user/send-otp", { email });
    displayResponse("sendOtpResponse", res.status, res.data);
}

async function verifyOtp() {
    const email = document.getElementById("verifyOtpEmail").value;
    const otp = document.getElementById("verifyOtpCode").value;
    const res = await API.post("/user/verify-otp", { email, otp });

    if (res.status === 200 && res.data.data && res.data.data.token) {
        currentToken = res.data.data.token;
        localStorage.setItem("token", currentToken);
        document.getElementById("tokenInput").value = currentToken;
        updateTokenStatus();
    }

    displayResponse("verifyOtpResponse", res.status, res.data);
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    // Toggle icon
    if (isPassword) {
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
        `;
    } else {
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        `;
    }
}

async function register() {
    const data = {
        phone: document.getElementById("regPhone").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value,
        name: document.getElementById("regName").value,
        role: document.getElementById("regRole").value,
    };
    const res = await API.post("/user/register", data);
    displayResponse("registerResponse", res.status, res.data);
}

async function checkEmail() {
    const email = document.getElementById("checkEmail").value;
    const res = await API.get(`/user/check-email/${encodeURIComponent(email)}`);
    displayResponse("checkEmailResponse", res.status, res.data);
}

async function forgotPassword() {
    const email = document.getElementById("forgotEmail").value;
    const res = await API.post("/user/forgotpassword", { email });
    displayResponse("forgotPasswordResponse", res.status, res.data);
}

// User APIs
async function getMe() {
    const res = await API.get("/user/me");
    displayResponse("getMeResponse", res.status, res.data);
}

async function updateProfile() {
    const data = {};
    const name = document.getElementById("updateName").value;
    const email = document.getElementById("updateEmail").value;
    if (name) data.name = name;
    if (email) data.email = email;
    const res = await API.put("/user/updateprofile", data);
    displayResponse("updateProfileResponse", res.status, res.data);
}

async function logout() {
    const res = await API.post("/user/logout", {});
    if (res.status === 200) {
        clearToken();
    }
    displayResponse("logoutResponse", res.status, res.data);
}

async function deleteMe() {
    if (!confirm("Are you sure you want to delete your account?")) return;
    const res = await API.delete("/user/me");
    if (res.status === 200) {
        clearToken();
    }
    displayResponse("deleteMeResponse", res.status, res.data);
}

// Author APIs
async function getAllAuthors() {
    try {
        const res = await API.get("/authors");
        displayResponse("getAllAuthorsResponse", res.status, res.data);

        const listEl = document.getElementById("authorsList");
        const authors = res.data.data || res.data.authors || [];

        if (authors.length === 0) {
            listEl.innerHTML =
                '<p style="color: #98989d; text-align: center;">No authors found</p>';
        } else {
            listEl.innerHTML = authors
                .map(
                    (author) => `
                    <div class="list-item">
                        <span>${author.name} (${author.country || "N/A"})</span>
                        <span class="list-item-actions">
                            <button class="btn btn-info" onclick="document.getElementById('getAuthorId').value='${author._id}'; getAuthorById();">View</button>
                            <button class="btn btn-warning" onclick="document.getElementById('updateAuthorId').value='${author._id}'">Edit</button>
                            <button class="btn btn-danger" onclick="document.getElementById('deleteAuthorId').value='${author._id}'">Delete</button>
                        </span>
                    </div>
                `,
                )
                .join("");
        }
    } catch (error) {
        displayResponse("getAllAuthorsResponse", 0, { error: error.message });
    }
}

async function getAuthorById() {
    const id = document.getElementById("getAuthorId").value;
    const res = await API.get(`/authors/${id}`);
    displayResponse("getAuthorByIdResponse", res.status, res.data);
}

async function createAuthor() {
    const data = {
        name: document.getElementById("createAuthorName").value,
        bio: document.getElementById("createAuthorBio").value,
        country: document.getElementById("createAuthorCountry").value,
        birthYear: document.getElementById("createAuthorBirthYear").value,
    };
    const res = await API.post("/authors", data);
    displayResponse("createAuthorResponse", res.status, res.data);
    if (res.status === 201) getAllAuthors();
}

async function updateAuthor() {
    const id = document.getElementById("updateAuthorId").value;
    const data = {};
    ["Name", "Bio", "Country", "BirthYear"].forEach((field) => {
        const el = document.getElementById(`updateAuthor${field}`);
        if (el && el.value) {
            data[field === "BirthYear" ? "birthYear" : field.toLowerCase()] =
                el.value;
        }
    });
    const res = await API.put(`/authors/${id}`, data);
    displayResponse("updateAuthorResponse", res.status, res.data);
    if (res.status === 200) getAllAuthors();
}

async function deleteAuthor() {
    const id = document.getElementById("deleteAuthorId").value;
    if (!confirm("Delete this author?")) return;
    const res = await API.delete(`/authors/${id}`);
    displayResponse("deleteAuthorResponse", res.status, res.data);
    if (res.status === 200) getAllAuthors();
}

// Book APIs
async function getAllBooks() {
    try {
        const res = await API.get("/books");
        displayResponse("getAllBooksResponse", res.status, res.data);

        const listEl = document.getElementById("booksList");
        const books = res.data.data || res.data.books || [];

        if (books.length === 0) {
            listEl.innerHTML =
                '<p style="color: #98989d; text-align: center;">No books found</p>';
        } else {
            listEl.innerHTML = books
                .map(
                    (book) => `
                    <div class="list-item">
                        <span>${book.title} - $${book.price || "N/A"}</span>
                        <span class="list-item-actions">
                            <button class="btn btn-info" onclick="document.getElementById('getBookId').value='${book._id}'; getBookById();">View</button>
                            <button class="btn btn-warning" onclick="document.getElementById('updateBookId').value='${book._id}'">Edit</button>
                            <button class="btn btn-danger" onclick="document.getElementById('deleteBookId').value='${book._id}'">Delete</button>
                        </span>
                    </div>
                `,
                )
                .join("");
        }
    } catch (error) {
        displayResponse("getAllBooksResponse", 0, { error: error.message });
    }
}

async function getBookById() {
    const id = document.getElementById("getBookId").value;
    const res = await API.get(`/books/${id}`);
    displayResponse("getBookByIdResponse", res.status, res.data);
}

async function createBook() {
    const formData = new FormData();
    formData.append("title", document.getElementById("createBookTitle").value);
    formData.append(
        "description",
        document.getElementById("createBookDescription").value,
    );
    formData.append("isbn", document.getElementById("createBookIsbn").value);
    formData.append("price", document.getElementById("createBookPrice").value);
    formData.append(
        "author",
        document.getElementById("createBookAuthorId").value,
    );

    const coverFile = document.getElementById("createBookCover").files[0];
    if (coverFile) formData.append("coverImage", coverFile);

    const res = await API.postForm("/books", formData);
    displayResponse("createBookResponse", res.status, res.data);
    if (res.status === 201) getAllBooks();
}

async function updateBook() {
    const id = document.getElementById("updateBookId").value;
    const formData = new FormData();

    const title = document.getElementById("updateBookTitle").value;
    const description = document.getElementById("updateBookDescription").value;
    const price = document.getElementById("updateBookPrice").value;
    const coverFile = document.getElementById("updateBookCover").files[0];

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (price) formData.append("price", price);
    if (coverFile) formData.append("coverImage", coverFile);

    const res = await API.putForm(`/books/${id}`, formData);
    displayResponse("updateBookResponse", res.status, res.data);
    if (res.status === 200) getAllBooks();
}

async function deleteBook() {
    const id = document.getElementById("deleteBookId").value;
    if (!confirm("Delete this book?")) return;
    const res = await API.delete(`/books/${id}`);
    displayResponse("deleteBookResponse", res.status, res.data);
    if (res.status === 200) getAllBooks();
}

// Initialize
updateTokenStatus();
loadToken();
