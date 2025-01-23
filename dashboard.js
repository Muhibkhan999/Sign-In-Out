document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("users"); // Clear only the current user data
    window.location.href = "index.html"; // Redirect to index.html
});
    
