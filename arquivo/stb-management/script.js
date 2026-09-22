const devices = [
    {
        id: "STB-HTL-001",
        hotel: "Hotel Leques",
        room: "Quarto 101",
        model: "Intelbras IzyPlay 4K",
        android: "Android 14",
        agent: "1.0.0",
        ip: "10.20.101.21",
        mac: "98:2A:0A:17:D6:37",
        status: "online",
        lastSeen: "agora",
        uptime: "4d 12h",
        storage: "18.4 / 32 GB",
        memory: "1.1 / 2 GB",
        apps: [
            ["LifePlay", "1.5.0.75"],
            ["MyStay", "1.1.7.30"],
            ["YouTube", "20.34.2"],
            ["Netflix", "9.4.0"]
        ]
    },
    {
        id: "STB-HTL-002",
        hotel: "Hotel Leques",
        room: "Quarto 102",
        model: "Intelbras IzyPlay 4K",
        android: "Android 14",
        agent: "1.0.0",
        ip: "10.20.102.22",
        mac: "98:2A:0A:17:D6:38",
        status: "online",
        lastSeen: "agora",
        uptime: "2d 08h",
        storage: "20.1 / 32 GB",
        memory: "1.3 / 2 GB",
        apps: [
            ["LifePlay", "1.5.0.75"],
            ["MyStay", "1.1.7.30"],
            ["YouTube", "20.34.2"]
        ]
    },
    {
        id: "STB-HTL-015",
        hotel: "Hotel Maerkli",
        room: "Quarto 215",
        model: "ZTE ZXV10 B866V2",
        android: "Android TV",
        agent: "1.0.0",
        ip: "10.30.215.15",
        mac: "A4:7B:2C:91:20:15",
        status: "warning",
        lastSeen: "2 min atrás",
        uptime: "11d 03h",
        storage: "27.2 / 32 GB",
        memory: "1.8 / 2 GB",
        apps: [
            ["LifePlay", "1.5.0.75"],
            ["MyStay", "1.1.7.29"]
        ]
    },
    {
        id: "STB-RES-004",
        hotel: "Recanto do Teixeira",
        room: "Quarto 04",
        model: "Smartlabs",
        android: "Android TV",
        agent: "Não instalado",
        ip: "192.168.50.104",
        mac: "00:1A:79:50:04:01",
        status: "offline",
        lastSeen: "há 3 dias",
        uptime: "—",
        storage: "—",
        memory: "—",
        apps: [
            ["LifeTV", "0.11.1"]
        ]
    }
];

let selectedId = null;

const list = document.getElementById("deviceList");
const detail = document.getElementById("detailPanel");
const search = document.getElementById("searchInput");
const filter = document.getElementById("statusFilter");

function visibleDevices() {
    const q = search.value.trim().toLowerCase();
    const f = filter.value;

    return devices.filter(d => {
        const matchesStatus = f === "all" || d.status === f;
        const text = `${d.id} ${d.hotel} ${d.room} ${d.ip} ${d.mac} ${d.model}`.toLowerCase();
        return matchesStatus && text.includes(q);
    });
}

function renderStats() {
    const online = devices.filter(d => d.status === "online").length;
    const offline = devices.filter(d => d.status === "offline").length;
    const installed = devices.filter(d => d.agent !== "Não instalado").length;

    document.getElementById("totalDevices").textContent = devices.length;
    document.getElementById("onlineDevices").textContent = online;
    document.getElementById("offlineDevices").textContent = offline;
    document.getElementById("agentDevices").textContent =
        `${Math.round(installed / devices.length * 100)}%`;
}

function renderList() {
    const items = visibleDevices();

    if (!items.length) {
        list.innerHTML = `<div class="empty-list">Nenhum STB encontrado.</div>`;
        return;
    }

    list.innerHTML = items.map(d => `
        <div class="device ${selectedId === d.id ? "active" : ""}" data-id="${d.id}">
            <span class="status-dot ${d.status}"></span>
            <div>
                <div class="device-name">${d.id}</div>
                <div class="device-meta">${d.hotel} · ${d.room} · ${d.model}</div>
            </div>
            <div class="device-status">
                ${statusText(d.status)}
                <strong>${d.lastSeen}</strong>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".device").forEach(el => {
        el.addEventListener("click", () => selectDevice(el.dataset.id));
    });
}

function statusText(status) {
    return {
        online: "ONLINE",
        warning: "ATENÇÃO",
        offline: "OFFLINE"
    }[status] || status.toUpperCase();
}

function selectDevice(id) {
    selectedId = id;
    const d = devices.find(item => item.id === id);
    renderList();

    detail.innerHTML = `
        <div class="detail-head">
            <div>
                <span class="card-label">DISPOSITIVO</span>
                <h2>${d.id}</h2>
                <div class="device-meta">${d.hotel} · ${d.room}</div>
            </div>
            <span class="status-pill ${d.status}">${statusText(d.status)}</span>
        </div>

        <div class="detail-section">
            <h3>INFORMAÇÕES DO STB</h3>
            <div class="info-grid">
                ${info("Modelo", d.model)}
                ${info("Android", d.android)}
                ${info("Agent", d.agent)}
                ${info("Último contato", d.lastSeen)}
                ${info("IP", d.ip)}
                ${info("MAC", d.mac)}
                ${info("Uptime", d.uptime)}
                ${info("Armazenamento", d.storage)}
                ${info("Memória", d.memory)}
            </div>
        </div>

        <div class="detail-section">
            <h3>COMANDOS REMOTOS</h3>
            <div class="command-grid">
                <button class="btn btn-primary" onclick="command('Reboot')">REINICIAR</button>
                <button class="btn btn-secondary" onclick="command('Ping')">TESTAR AGENT</button>
                <button class="btn btn-secondary" onclick="command('Screenshot')">SCREENSHOT</button>
                <button class="btn btn-secondary" onclick="command('Atualização de APK')">ATUALIZAR APK</button>
                <button class="btn btn-secondary" onclick="command('Coleta de logs')">COLETAR LOGS</button>
                <button class="btn btn-secondary" onclick="command('Sanitização')">SANITIZAR CHECKOUT</button>
            </div>
        </div>

        <div class="detail-section">
            <h3>APLICATIVOS</h3>
            ${(d.apps || []).map(a => `
                <div class="app-row">
                    <span>${a[0]}</span><small>${a[1]}</small>
                </div>
            `).join("")}
        </div>

        <div class="detail-section">
            <h3>EVENTOS RECENTES</h3>
            <div class="log-box">
                [17:51:12] Agent heartbeat recebido<br>
                [17:50:08] Status de rede atualizado<br>
                [17:42:31] LifePlay iniciado<br>
                [16:10:04] Inventário sincronizado
            </div>
        </div>
    `;
}

function info(label, value) {
    return `
        <div class="info-item">
            <span>${label}</span>
            <strong>${value}</strong>
        </div>
    `;
}

function command(name) {
    showToast(`${name}: comando preparado para o dispositivo selecionado.`);
}

function showToast(message) {
    const old = document.querySelector(".toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2800);
}

document.getElementById("refreshButton").addEventListener("click", () => {
    renderStats();
    renderList();
    if (selectedId) selectDevice(selectedId);
    showToast("Painel atualizado.");
});

search.addEventListener("input", renderList);
filter.addEventListener("change", renderList);

function logout() {
    sessionStorage.removeItem("netsecureAuth");
    window.location.href = "../../login.html";
}

renderStats();
renderList();
