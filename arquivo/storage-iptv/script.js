function calculateStorage() {

    const channels = parseFloat(
        document.getElementById("channels").value
    );

    const bitrate = parseFloat(
        document.getElementById("bitrate").value
    );

    const retention = parseFloat(
        document.getElementById("retention").value
    );

    const margin = parseFloat(
        document.getElementById("margin").value
    );


    if (
        !channels ||
        !bitrate ||
        !retention ||
        margin < 0
    ) {
        alert("Preencha os campos corretamente.");
        return;
    }


    // Bitrate total em Mbps
    const totalBitrate = channels * bitrate;


    // Conversão:
    // Mbps -> bytes/s
    const bytesPerSecond =
        totalBitrate * 1000000 / 8;


    // Tempo total em segundos
    const totalSeconds =
        retention * 60 * 60;


    // Storage em bytes
    const totalBytes =
        bytesPerSecond * totalSeconds;


    // Conversão decimal
    const rawGB =
        totalBytes / 1000000000;

    const rawTB =
        totalBytes / 1000000000000;


    // Margem
    const recommendedTB =
        rawTB * (1 + margin / 100);

    const marginTB =
        recommendedTB - rawTB;


    document.getElementById("totalBitrate").textContent =
        formatBitrate(totalBitrate);

    document.getElementById("storageRaw").textContent =
        formatStorage(rawGB, rawTB);

    document.getElementById("marginValue").textContent =
        formatTB(marginTB);

    document.getElementById("storageRecommended").textContent =
        formatTB(recommendedTB);
}


function formatStorage(gb, tb) {

    if (tb >= 1) {
        return `${tb.toFixed(2)} TB`;
    }

    return `${gb.toFixed(2)} GB`;
}


function formatTB(value) {

    if (value >= 1) {
        return `${value.toFixed(2)} TB`;
    }

    return `${(value * 1000).toFixed(2)} GB`;
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


calculateStorage();