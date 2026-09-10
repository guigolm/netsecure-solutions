const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const passwordElement = document.getElementById("password");
const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");


const CHARACTERS = {

    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    lowercase: "abcdefghijklmnopqrstuvwxyz",

    numbers: "0123456789",

    symbols: "!@#$%^&*()-_=+[]{};:,.?/|~"

};


lengthInput.addEventListener("input", function () {

    lengthValue.textContent = this.value;

});


function generatePassword() {

    const length = parseInt(lengthInput.value);

    const useUppercase =
        document.getElementById("uppercase").checked;

    const useLowercase =
        document.getElementById("lowercase").checked;

    const useNumbers =
        document.getElementById("numbers").checked;

    const useSymbols =
        document.getElementById("symbols").checked;


    let characterPool = "";

    const selectedSets = [];


    if (useUppercase) {

        characterPool += CHARACTERS.uppercase;

        selectedSets.push(CHARACTERS.uppercase);

    }


    if (useLowercase) {

        characterPool += CHARACTERS.lowercase;

        selectedSets.push(CHARACTERS.lowercase);

    }


    if (useNumbers) {

        characterPool += CHARACTERS.numbers;

        selectedSets.push(CHARACTERS.numbers);

    }


    if (useSymbols) {

        characterPool += CHARACTERS.symbols;

        selectedSets.push(CHARACTERS.symbols);

    }


    if (characterPool.length === 0) {

        alert("Selecione pelo menos um tipo de caractere.");

        return;

    }


    let password = "";


    /*
     * Garante pelo menos um caractere
     * de cada categoria selecionada.
     */

    for (const set of selectedSets) {

        password += randomCharacter(set);

    }


    /*
     * Completa o restante da senha
     */

    while (password.length < length) {

        password += randomCharacter(characterPool);

    }


    /*
     * Embaralha a senha para evitar que
     * as categorias sempre apareçam no início.
     */

    password = shuffle(password);


    passwordElement.textContent = password;


    updateStrength(
        password.length,
        selectedSets.length
    );
}


function randomCharacter(characters) {

    const array = new Uint32Array(1);

    crypto.getRandomValues(array);

    return characters[
        array[0] % characters.length
    ];
}


function shuffle(value) {

    const array = value.split("");

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const random = new Uint32Array(1);

        crypto.getRandomValues(random);

        const j = random[0] % (i + 1);

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array.join("");
}


function updateStrength(length, categories) {

    let score = 0;


    if (length >= 8) {
        score++;
    }

    if (length >= 12) {
        score++;
    }

    if (length >= 16) {
        score++;
    }

    if (length >= 24) {
        score++;
    }

    if (categories >= 2) {
        score++;
    }

    if (categories >= 3) {
        score++;
    }

    if (categories >= 4) {
        score++;
    }


    let percentage = 0;
    let text = "";


    if (score <= 2) {

        percentage = 30;
        text = "Fraca";

    } else if (score <= 4) {

        percentage = 55;
        text = "Moderada";

    } else if (score <= 6) {

        percentage = 80;
        text = "Forte";

    } else {

        percentage = 100;
        text = "Muito forte";

    }


    strengthBar.style.width =
        percentage + "%";

    strengthText.textContent =
        text;
}


async function copyPassword() {

    const password =
        passwordElement.textContent;


    if (
        !password ||
        password === "Clique em \"Gerar Senha\""
    ) {

        alert("Gere uma senha primeiro.");

        return;
    }


    try {

        await navigator.clipboard.writeText(password);

        const button =
            document.querySelector(".copy-button");

        const originalText =
            button.textContent;

        button.textContent = "Copiado!";

        setTimeout(() => {

            button.textContent = originalText;

        }, 1500);

    } catch (error) {

        alert(
            "Não foi possível copiar a senha."
        );

    }
}


function logout() {

    sessionStorage.removeItem("netsecureAuth");

    window.location.href =
        "../../login.html";
}


/*
 * Gera uma senha automaticamente
 * ao abrir a ferramenta.
 */

generatePassword();