    // Wait until HTML is fully loaded (because of defer, optional but safe)
document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("studentForm");
    const tableBody = document.querySelector("#StudentTable tbody");

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let editIndex = -1;

    // Render Table
    function renderTable() {
        tableBody.innerHTML = "";

        students.forEach((student, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;

            row.querySelector(".edit-btn").addEventListener("click", () => editStudent(index));
            row.querySelector(".delete-btn").addEventListener("click", () => deleteStudent(index));

            tableBody.appendChild(row);
        });
    }

    // Save to localStorage
    function saveData() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    // Validation
    function isValidName(name) {
        return /^[A-Za-z ]+$/.test(name);
    }

    function isValidNumber(num) {
        return /^[0-9]+$/.test(num);
    }

    // Add / Update student
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const id = document.getElementById("studentId").value.trim();
        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact").value.trim();

        // Validation
        if (!name || !id || !email || !contact) {
            alert("All fields are required!");
            return;
        }
        if (!isValidName(name)) {
            alert("Name must contain only letters!");
            return;
        }
        if (!isValidNumber(id)) {
            alert("Student ID must be numbers only!");
            return;
        }
        if (!isValidNumber(contact) || contact.length < 10) {
            alert("Contact must be at least 10 digits!");
            return;
        }

        const student = { name, id, email, contact };

        if (editIndex === -1) {
            students.push(student);
        } else {
            students[editIndex] = student;
            editIndex = -1;
        }

        saveData();
        renderTable();
        form.reset();
    });

    // Edit student
    function editStudent(index) {
        const student = students[index];
        document.getElementById("name").value = student.name;
        document.getElementById("studentId").value = student.id;
        document.getElementById("email").value = student.email;
        document.getElementById("contact").value = student.contact;

        editIndex = index;
    }

    // Delete student
    function deleteStudent(index) {
        if (confirm("Are you sure you want to delete?")) {
            students.splice(index, 1);
            saveData();
            renderTable();
        }
    }

    // Initial render
    renderTable();
});
window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    }, 2000); // 2 seconds delay
});