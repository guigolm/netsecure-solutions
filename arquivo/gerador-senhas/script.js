const lengthInput =
    document.getElementById("length");

const lengthValue =
    document.getElementById("lengthValue");

const passwordElement =
    document.getElementById("password");

const strengthText =
    document.getElementById("strengthText");

const strengthBar =
    document.getElementById("strengthBar");


const CHARACTERS = {

    uppercase:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    lowercase:
        "abcdefghijklmnopqrstuvwxyz",

    numbers:
        "0123456789",

    symbols:
        "!@#$%^&*()-_=+[]{};:,.?/|~"

};


/* Atualiza o número do tamanho */

lengthInput.addEventListener(
    "input",
    function () {

        lengthValue.textContent =
            this.value;

    }
);


/* =========================
   GERAR SENHA
========================= */

function generatePassword() {

    const length =
        parseInt(lengthInput.value);


    const uppercase =
        document.getElementById(
            "uppercase"
        ).checked;


    const lowercase =
        document.getElementById(
            "lowercase"
        ).checked;


    const numbers =
        document.getElementById(
            "numbers"
        ).checked;


    const symbols =
        document.getElementById(
            "symbols"
        ).checked;


    let pool = "";

    const selectedSets = [];


    if (uppercase) {

        pool += CHARACTERS.uppercase;

        selectedSets.push(
            CHARACTERS.uppercase
        );

    }


    if (lowercase) {

        pool += CHARACTERS.lowercase;

        selectedSets.push(
            CHARACTERS.lowercase
        );

    }


    if (numbers) {

        pool += CHARACTERS.numbers;

        selectedSets.push(
            CHARACTERS.numbers
        );

    }


    if (symbols) {

        pool += CHARACTERS.symbols;

        selectedSets.push(
            CHARACTERS.symbols
        );

    }


    if (pool.length === 0) {

        alert(
            "Selecione pelo menos um tipo de caractere."
        );

        return;

    }


    let password = "";


    /*
     * Garante pelo menos um caractere
     * de cada categoria escolhida.
     */

    for (const set of selectedSets) {

        password +=
            randomCharacter(set);

    }


    /*
     * Completa a senha.
     */

    while (password.length < length) {

        password +=
            randomCharacter(pool);

    }


    /*
     * Embaralha.
     */

    password =
        shuffle(password);


    passwordElement.textContent =
        password;


    updateStrength(
        length,
        selectedSets.length
    );

}


/* =========================
   CARACTERE ALEATÓRIO
========================= */

function randomCharacter(characters) {

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return characters[
        array[0] % characters.length
    ];

}


/* =========================
   EMBARALHAR
========================= */

function shuffle(value) {

    const array =
        value.split("");


    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const random =
            new Uint32Array(1);

        crypto.getRandomValues(random);


        const j =
            random[0] % (i + 1);


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }


    return array.join("");

}


/* =========================
   FORÇA
========================= */

function updateStrength(
    length,
    categories
) {

    let score = 0;


    if (length >= 8)
        score++;


    if (length >= 12)
        score++;


    if (length >= 16)
        score++;


    if (length >= 24)
        score++;


    if (categories >= 2)
        score++;


    if (categories >= 3)
        score++;


    if (categories >= 4)
        score++;


    let percentage;

    let text;


    if (score <= 2) {

        percentage = 30;

        text = "Fraca";

    }
    else if (score <= 4) {

        percentage = 55;

        text = "Moderada";

    }
    else if (score <= 6) {

        percentage = 80;

        text = "Forte";

    }
    else {

        percentage = 100;

        text = "Muito forte";

    }


    strengthBar.style.width =
        percentage + "%";


    strengthText.textContent =
        text;

}


/* =========================
   COPIAR
========================= */

async function copyPassword() {

    const password =
        passwordElement.textContent;


    if (
        !password ||
        password ===
        'Clique em "Gerar Senha"'
    ) {

        alert(
            "Gere uma senha primeiro."
        );

        return;

    }


    try {

        await navigator.clipboard
            .writeText(password);


        const button =
            document.querySelector(
                ".copy-button"
            );


        const original =
            button.textContent;


        button.textContent =
            "Copiado!";


        setTimeout(
            function () {

                button.textContent =
                    original;

            },
            1500
        );


    }
    catch (error) {

        alert(
            "Não foi possível copiar a senha."
        );

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    sessionStorage.removeItem(
        "netsecureAuth"
    );

    window.location.href =
        "../../login.html";

}


/* Gera uma senha ao abrir */

generatePassword();