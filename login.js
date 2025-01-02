document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Replace with actual validation logic
    if (username === "admin" && password === "admin") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html"; // Redirect to your main page
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
});
