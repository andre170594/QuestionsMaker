
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



// Function to fetch and display users
// Function to fetch and display users
async function fetchUsers() {
    const usersRef = ref(db, 'users'); // Assuming 'users' node holds user data
    const userListElement = document.getElementById('userList'); // Left pane element for users

    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            userListElement.innerHTML = ''; // Clear the previous list
            const usersArray = [];

            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                usersArray.push(user); // Collect users in an array
            });

            // Sort the users array alphabetically by username
            usersArray.sort((a, b) => a.username.localeCompare(b.username));

            // Append sorted users to the list
            usersArray.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = user.username; // Assuming 'username' is a field in your user data
                listItem.addEventListener('click', function () {
                    // Remove 'selected-user' class from all list items
                    const allListItems = userListElement.querySelectorAll('li');
                    allListItems.forEach(item => item.classList.remove('selected-user'));

                    // Add the 'selected-user' class to the clicked list item
                    listItem.classList.add('selected-user');

                    // Display feeds for the selected user
                    displayUserFeeds(user.username); // Pass the username to display feeds
                    displayUserDetails(user);
                });
                userListElement.appendChild(listItem);
            });
        } else {
            alert("No users found.");
        }
    } catch (error) {
        console.error("Error fetching users: ", error);
        alert("Failed to fetch users.");
    }
}


// Function to display user feeds
async function displayUserFeeds(userName) {
    const feedsRef = ref(db, 'feeds'); // Accessing the 'feeds' node directly
    const feedsContent = document.getElementById('feedsContent');

    try {
        const snapshot = await get(feedsRef);
        if (snapshot.exists()) {
            const feeds = snapshot.val();
            feedsContent.innerHTML = ''; // Clear previous content

            // Loop through each feed and check if the nameUser matches the selected user's username
            Object.keys(feeds).forEach(feedId => {
                const feed = feeds[feedId];

                // Check if the feed's nameUser matches the selected user's username
                if (feed.nameUser === userName) {
                    const feedElement = document.createElement('div');
                    feedElement.classList.add('feed-item');
                    feedElement.innerHTML = `
                        <p><strong>Test: </strong> ${feed.title}</p>
                        <p><strong>Score:</strong> ${feed.content}</p>
                        <p><strong>Date: </strong> ${feed.formatedDate}</p>
                    `;
                    feedsContent.appendChild(feedElement);
                }
            });
        } else {
            feedsContent.innerHTML = '<p>No feeds available for this user.</p>';
        }
    } catch (error) {
        console.error("Error fetching feeds: ", error);
        feedsContent.innerHTML = '<p>Failed to load feeds. Try again later.</p>';
    }
}

// Function to display user details
function displayUserDetails(user)
{ const userDetails = document.getElementById('userDetails');
    const averageScore = (user.avgScores.reduce((a, b) => a + b, 0) / user.avgScores.length).toFixed(2);
    document.getElementById('userName').textContent = user.username;
    document.getElementById('averageScore').textContent = averageScore;
    document.getElementById('lastScore').textContent = user.lastScore;
    userDetails.style.display = 'flex';
}

// Initialize and fetch users on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

