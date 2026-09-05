// Atualiza automaticamente o ano do rodapé

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();


// Menu mobile

const menuToggle = document.getElementById("menuToggle");

const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {

    menu.classList.toggle("active");

});


// Fecha o menu depois de clicar em um link

const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});