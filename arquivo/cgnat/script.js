/* =====================================================
   MENU
===================================================== */

const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if (menuToggle && menu) {

    menuToggle.addEventListener("click", () => {

        menu.classList.toggle("active");

    });


    const menuLinks =
        document.querySelectorAll(".menu a");


    menuLinks.forEach((link) => {

        link.addEventListener("click", () => {

            menu.classList.remove("active");

        });

    });

}


/* =====================================================
   ELEMENTOS
===================================================== */

const inputText =
    document.getElementById("inputText");

const processButton =
    document.getElementById("processButton");

const clearButton =
    document.getElementById("clearButton");

const resultsBody =
    document.getElementById("resultsBody");

const resultCount =
    document.getElementById("resultCount");

const lineCounter =
    document.getElementById("lineCounter");

const selectAll =
    document.getElementById("selectAll");

const copyButton =
    document.getElementById("copyButton");

const copyIpButton =
    document.getElementById("copyIpButton");

const exportButton =
    document.getElementById("exportButton");

const statusMessage =
    document.getElementById("statusMessage");


/* =====================================================
   DADOS
===================================================== */

let processedResults = [];


/* =====================================================
   CONTADOR DE LINHAS
===================================================== */

inputText.addEventListener("input", () => {

    const text =
        inputText.value.trim();


    if (!text) {

        lineCounter.textContent =
            "0 linhas";

        return;

    }


    const lines =
        text.split(/\r?\n/);


    const count =
        lines.length;


    lineCounter.textContent =
        `${count} ${count === 1 ? "linha" : "linhas"}`;

});


/* =====================================================
   PROCESSAMENTO
===================================================== */

function processData() {

    clearStatus();


    const inputData =
        inputText.value.trim();


    if (!inputData) {

        showStatus(
            "Por favor, insira os dados no campo.",
            true
        );

        return;

    }


    try {

        const lines =
            inputData.split(/\r?\n/);


        /*
         * Estrutura semelhante ao DataFrame
         * utilizado no Python original.
         */

        const records =
            [];


        lines.forEach((message) => {

            const ipMatch =
                message.match(
                    /(\d{1,3}(?:\.\d{1,3}){3})/
                );


            const natMatch =
                message.match(
                    /NAT-OTR-(T|Y)/
                );


            records.push({

                message: message,

                ip: ipMatch
                    ? ipMatch[1]
                    : null,

                nat: natMatch
                    ? natMatch[1]
                    : null

            });

        });


        /*
         * Agrupa os registros por IP.
         */

        const groups =
            new Map();


        records.forEach((record) => {

            if (!record.ip) {
                return;
            }


            if (!groups.has(record.ip)) {

                groups.set(
                    record.ip,
                    []
                );

            }


            groups
                .get(record.ip)
                .push(record);

        });


        /*
         * Regra original do Python:
         *
         * possuir T
         * E
         * não possuir Y
         */

        const results =
            [];


        groups.forEach(
            (recordsForIp, ip) => {

                const hasT =
                    recordsForIp.some(
                        record =>
                            record.nat === "T"
                    );


                const hasY =
                    recordsForIp.some(
                        record =>
                            record.nat === "Y"
                    );


                if (
                    hasT &&
                    !hasY
                ) {

                    /*
                     * O Python original utiliza
                     * todas as linhas do grupo
                     * após o filtro.
                     *
                     * Como o resultado deve
                     * representar os registros T,
                     * mostramos as linhas T.
                     */

                    recordsForIp
                        .filter(
                            record =>
                                record.nat === "T"
                        )
                        .forEach(
                            record => {

                                results.push({
                                    message:
                                        record.message,

                                    ip:
                                        ip,

                                    nat:
                                        record.nat
                                });

                            }
                        );

                }

            }
        );


        processedResults =
            results;


        renderResults();


        if (results.length === 0) {

            showStatus(
                "Nenhum resultado encontrado.",
                false
            );

        } else {

            showStatus(
                `${results.length} resultado(s) encontrado(s).`,
                false
            );

        }

    }

    catch (error) {

        showStatus(
            `Ocorreu um erro ao processar os dados: ${error.message}`,
            true
        );

    }

}


/* =====================================================
   RENDERIZA RESULTADOS
===================================================== */

function renderResults() {

    resultsBody.innerHTML = "";


    resultCount.textContent =
        processedResults.length;


    selectAll.checked = false;


    if (
        processedResults.length === 0
    ) {

        const row =
            document.createElement("tr");

        row.className =
            "empty-row";


        row.innerHTML = `

            <td colspan="4">

                <div class="empty-state">

                    <span>
                        ◇
                    </span>

                    <p>
                        Nenhum resultado encontrado.
                    </p>

                </div>

            </td>

        `;


        resultsBody.appendChild(row);

        return;

    }


    processedResults.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td class="select-column">

                    <input
                        type="checkbox"
                        class="row-checkbox"
                        data-index="${index}"
                    >

                </td>


                <td class="message-cell"></td>


                <td class="ip-cell"></td>


                <td class="nat-cell"></td>

            `;


            /*
             * textContent evita que conteúdo
             * dos logs seja interpretado como HTML.
             */

            row.querySelector(
                ".message-cell"
            ).textContent =
                item.message;


            row.querySelector(
                ".ip-cell"
            ).textContent =
                item.ip;


            row.querySelector(
                ".nat-cell"
            ).textContent =
                `NAT-OTR-${item.nat}`;


            resultsBody.appendChild(row);

        }
    );


    attachRowEvents();

}


/* =====================================================
   EVENTOS DAS LINHAS
===================================================== */

function attachRowEvents() {

    const checkboxes =
        document.querySelectorAll(
            ".row-checkbox"
        );


    checkboxes.forEach((checkbox) => {

        checkbox.addEventListener(
            "change",
            updateSelectAllState
        );

    });

}


/* =====================================================
   SELECIONAR TODOS
===================================================== */

selectAll.addEventListener(
    "change",
    () => {

        const checkboxes =
            document.querySelectorAll(
                ".row-checkbox"
            );


        checkboxes.forEach(
            checkbox => {

                checkbox.checked =
                    selectAll.checked;

            }
        );

    }
);


/* =====================================================
   ESTADO DO SELECIONAR TODOS
===================================================== */

function updateSelectAllState() {

    const checkboxes =
        Array.from(
            document.querySelectorAll(
                ".row-checkbox"
            )
        );


    if (
        checkboxes.length === 0
    ) {

        selectAll.checked = false;

        return;

    }


    selectAll.checked =
        checkboxes.every(
            checkbox =>
                checkbox.checked
        );

}


/* =====================================================
   OBTÉM RESULTADOS SELECIONADOS
===================================================== */

function getSelectedResults() {

    const checkboxes =
        document.querySelectorAll(
            ".row-checkbox:checked"
        );


    return Array.from(
        checkboxes
    ).map((checkbox) => {

        const index =
            Number(
                checkbox.dataset.index
            );


        return processedResults[index];

    });

}


/* =====================================================
   COPIAR SELEÇÃO
===================================================== */

copyButton.addEventListener(
    "click",
    async () => {

        const selected =
            getSelectedResults();


        if (
            selected.length === 0
        ) {

            showStatus(
                "Nenhuma linha selecionada.",
                true
            );

            return;

        }


        const result =
            selected
                .map(item =>
                    [
                        item.message,
                        item.ip,
                        `NAT-OTR-${item.nat}`
                    ].join("\t")
                )
                .join("\n");


        await copyText(
            result,
            "Dados selecionados copiados!"
        );

    }
);


/* =====================================================
   COPIAR SOMENTE IPs
===================================================== */

copyIpButton.addEventListener(
    "click",
    async () => {

        const selected =
            getSelectedResults();


        if (
            selected.length === 0
        ) {

            showStatus(
                "Nenhuma linha selecionada.",
                true
            );

            return;

        }


        /*
         * Remove IPs duplicados.
         */

        const ips =
            [
                ...new Set(
                    selected.map(
                        item => item.ip
                    )
                )
            ];


        await copyText(
            ips.join("\n"),
            "IPs copiados!"
        );

    }
);


/* =====================================================
   EXPORTAR TXT
===================================================== */

exportButton.addEventListener(
    "click",
    () => {

        const selected =
            getSelectedResults();


        if (
            selected.length === 0
        ) {

            showStatus(
                "Nenhuma linha selecionada.",
                true
            );

            return;

        }


        const content =
            selected
                .map(item =>
                    [
                        item.message,
                        item.ip,
                        `NAT-OTR-${item.nat}`
                    ].join("\t")
                )
                .join("\n");


        const blob =
            new Blob(
                [content],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "resultado-cgnat.txt";


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(url);


        showStatus(
            "Arquivo exportado com sucesso!",
            false
        );

    }
);


/* =====================================================
   COPIAR PARA ÁREA DE TRANSFERÊNCIA
===================================================== */

async function copyText(
    text,
    successMessage
) {

    try {

        await navigator.clipboard.writeText(
            text
        );


        showStatus(
            successMessage,
            false
        );

    }

    catch (error) {

        /*
         * Fallback para navegadores que
         * bloqueiam navigator.clipboard.
         */

        const textarea =
            document.createElement("textarea");


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try {

            document.execCommand(
                "copy"
            );


            showStatus(
                successMessage,
                false
            );

        }

        catch {

            showStatus(
                "Não foi possível copiar automaticamente.",
                true
            );

        }


        textarea.remove();

    }

}


/* =====================================================
   LIMPAR
===================================================== */

clearButton.addEventListener(
    "click",
    () => {

        inputText.value = "";

        processedResults = [];


        lineCounter.textContent =
            "0 linhas";


        resultCount.textContent =
            "0";


        selectAll.checked =
            false;


        renderResults();


        clearStatus();

    }
);


/* =====================================================
   STATUS
===================================================== */

function showStatus(
    message,
    isError = false
) {

    statusMessage.textContent =
        message;


    statusMessage.classList.toggle(
        "error",
        isError
    );

}


function clearStatus() {

    statusMessage.textContent =
        "";

    statusMessage.classList.remove(
        "error"
    );

}


/* =====================================================
   ATALHO CTRL + ENTER
===================================================== */

inputText.addEventListener(
    "keydown",
    (event) => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            processData();

        }

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

renderResults();