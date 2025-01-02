
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

import {getDatabase, ref, get, set, child, update, remove, push}
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const db = getDatabase();



// Function to fetch and display users
async function fetchUsers() {
    const usersRef = ref(db, 'users');  // Assuming 'users' node holds user data
    const userListElement = document.getElementById('userList'); // Left pane element for users

    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            userListElement.innerHTML = ''; // Clear the previous list
            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                const listItem = document.createElement('li');
                listItem.textContent = user.username;  // Assuming 'username' is a field in your user data
                listItem.onclick = function() {
                    displayUserFeeds(user.username); // Pass userId (key) when clicked
                };
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
                        <h3>${feed.title}</h3>
                        <p>${feed.content}</p>
                        <p><strong>Date:</strong> ${feed.formatedDate}</p>
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


// Initialize and fetch users on page load

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
