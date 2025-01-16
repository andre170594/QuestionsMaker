import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm_jbKnyNiXewzaHwp8wXYc-MuqKxKFVw",
    authDomain: "certificationproject-3dbf5.firebaseapp.com",
    databaseURL: "https://certificationproject-3dbf5-default-rtdb.firebaseio.com",
    projectId: "certificationproject-3dbf5",
    storageBucket: "certificationproject-3dbf5.appspot.com",
    messagingSenderId: "126368435801",
    appId: "1:126368435801:web:33845b9d0b33b89baaab48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Function to fetch and display certification data
async function fetchExamData() {
    const examRef = ref(db, 'examNumQ');
    const examTableBody = document.querySelector('#examTable tbody');
    const notificationDropdown = document.getElementById('notificationDropdown'); // Dropdown element

    try {
        const snapshot = await get(examRef);
        if (snapshot.exists()) {
            // Clear previous data in the table and dropdown
            examTableBody.innerHTML = '';
            notificationDropdown.innerHTML = '<option value="" disabled selected>Select a Certification</option>';

            snapshot.forEach(childSnapshot => {
                const examName = childSnapshot.key;
                const numQuestions = childSnapshot.val();

                // Add row to the table
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${examName}</td>
          <td>${numQuestions}</td>
        `;
                examTableBody.appendChild(row);

                // Add option to the dropdown
                const option = document.createElement('option');
                option.value = examName;
                option.textContent = examName;
                notificationDropdown.appendChild(option);
            });
        } else {
            alert("No certification data found.");
        }
    } catch (error) {
        console.error("Error fetching certification data:", error);
        alert("Failed to fetch certification data.");
    }
}

// Function to create a certification
async function createCertification(notificationName) {
    const notificationsRef = ref(db, `examNumQ/${notificationName}`);
    try {
        const snapshot = await get(notificationsRef);
        if (snapshot.exists()) {
            alert(`Certification "${notificationName}" already exists!`);
        } else {
            await set(notificationsRef, 0);
            alert(`Certification "${notificationName}" created with 0 questions.`);
            fetchExamData();
        }
    } catch (error) {
        console.error("Error creating certification:", error);
        alert("Failed to create certification.");
    }
}

// Function to delete a certification
async function deleteCertification(notificationName) {
    const notificationsRef = ref(db, `examNumQ/${notificationName}`);
    try {
        const snapshot = await get(notificationsRef);
        if (snapshot.exists()) {
            const confirmDelete = confirm(`Are you sure you want to delete the certification "${notificationName}"?`);
            if (confirmDelete) {
                await set(notificationsRef, null);
                alert(`Certification "${notificationName}" has been deleted.`);
                fetchExamData();
            }
        } else {
            alert(`Certification "${notificationName}" does not exist.`);
        }
    } catch (error) {
        console.error("Error deleting certification:", error);
        alert("Failed to delete certification.");
    }
}

// Handle dropdown selection and populate input field
const notificationDropdown = document.getElementById('notificationDropdown');
const notificationNameInput = document.getElementById('notificationName');

notificationDropdown.addEventListener('change', () => {
    notificationNameInput.value = notificationDropdown.value; // Set the selected dropdown value to the input field
});

// Event listeners for the buttons
document.getElementById('createCertification').addEventListener('click', () => {
    const notificationName = notificationNameInput.value.trim().toUpperCase();
    if (notificationName) {
        createCertification(notificationName);
        notificationNameInput.value = ''; // Clear the input
    } else {
        alert("Certification name cannot be empty!");
    }
});

document.getElementById('deleteCertification').addEventListener('click', () => {
    const notificationName = notificationNameInput.value.trim().toUpperCase();
    if (notificationName) {
        deleteCertification(notificationName);
        notificationNameInput.value = ''; // Clear the input
    } else {
        alert("Certification name cannot be empty!");
    }
});

// Fetch data when the page loads
window.onload = fetchExamData;
