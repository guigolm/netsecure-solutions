const USERNAME = "netsecure";
const PASSWORD = "NetSecure@2026";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === USERNAME && password === PASSWORD) {

        sessionStorage.setItem("netsecureAuth", "true");

        window.location.href = "arquivo.html";

    } else {

        errorMessage.textContent = "Usuário ou senha incorretos.";

        document.getElementById("password").value = "";
    }
});