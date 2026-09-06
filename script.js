// =========================================================
// ANO DO RODAPÉ
// =========================================================

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();



// =========================================================
// MENU MOBILE
// =========================================================

const menuToggle = document.getElementById("menuToggle");

const menu = document.getElementById("menu");


menuToggle.addEventListener("click", () => {

    menu.classList.toggle("active");

});



// =========================================================
// FECHAR MENU AO CLICAR EM UM LINK
// =========================================================

const menuLinks = document.querySelectorAll(".menu a");


menuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});