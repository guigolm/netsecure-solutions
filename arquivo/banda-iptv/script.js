function calculateBandwidth() {

    const users = parseFloat(
        document.getElementById("users").value
    );

    const bitrate = parseFloat(
        document.getElementById("bitrate").value
    );

    const margin = parseFloat(
        document.getElementById("margin").value
    );


    if (
        !users ||
        !bitrate ||
        margin < 0
    ) {
        alert("Preencha os campos corretamente.");
        return;
    }


    // Banda teórica
    const theoretical =
        users * bitrate;


    // Margem
    const marginValue =
        theoretical * (margin / 100);


    // Banda recomendada
    const recommended =
        theoretical + marginValue;


    document.getElementById("theoretical").textContent =
        formatBitrate(theoretical);

    document.getElementById("marginValue").textContent =
        formatBitrate(marginValue);

    document.getElementById("recommended").textContent =
        formatBitrate(recommended);

    document.getElementById("userResult").textContent =
        users.toLocaleString("pt-BR");
}


function formatBitrate(value) {

    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} Gbps`;
    }

    return `${value.toFixed(2)} Mbps`;
}


function logout() {

    sessionStorage.removeItem("netsecureAuth");

    window.location.href = "../../login.html";
}


calculateBandwidth();