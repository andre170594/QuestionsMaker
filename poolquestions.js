console.log("Feeds script loaded successfully.");

// DB CONFIGS
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBm_jbKnyNiXewzaHwp8wXYc-MuqKxKFVw",
    authDomain: "certificationproject-3dbf5.firebaseapp.com",
    databaseURL: "https://certificationproject-3dbf5-default-rtdb.firebaseio.com",
    projectId: "certificationproject-3dbf5",
    storageBucket: "certificationproject-3dbf5.firebasestorage.app",
    messagingSenderId: "126368435801",
    appId: "1:126368435801:web:33845b9d0b33b89baaab48"
};

const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get}
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const db = getDatabase();


// Function to fetch and display exam data
async function fetchExamData() {
    const examRef = ref(db, 'examNumQ');  // Assuming 'examNumQ' node holds exam data
    const examTableBody = document.querySelector('#examTable tbody'); // The table body for displaying exam data

    try {
        const snapshot = await get(examRef);
        if (snapshot.exists()) {
            examTableBody.innerHTML = ''; // Clear the previous table rows

            snapshot.forEach(childSnapshot => {
                const examName = childSnapshot.key; // The key will be the exam name (e.g., "CAD")
                const numQuestions = childSnapshot.val(); // The value will be the number of questions for the exam

                // Log to check the data being fetched
                console.log('Exam Name:', examName);
                console.log('Number of Questions:', numQuestions);

                // Create a new row for the exam data
                const row = document.createElement('tr');

                // Create the first table cell (td) for the exam name
                const examNameCell = document.createElement('td');
                examNameCell.textContent = examName; // Set the text content to the exam name
                row.appendChild(examNameCell); // Append the exam name cell to the row

                // Create the second table cell (td) for the number of questions
                const numQuestionsCell = document.createElement('td');
                numQuestionsCell.textContent = numQuestions; // Set the text content to the number of questions
                row.appendChild(numQuestionsCell); // Append the number of questions cell to the row

                // Log the row creation to ensure it's correct
                console.log('Row created:', row);

                // Append the row to the table body
                examTableBody.appendChild(row);
            });
        } else {
            alert("No exam data found.");
        }
    } catch (error) {
        console.error("Error fetching exam data: ", error);
        alert("Failed to fetch exam data.");
    }
}

// Call the function to fetch and display exam data when the page loads
window.onload = fetchExamData;



