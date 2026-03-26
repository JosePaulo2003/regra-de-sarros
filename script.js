let original = document.getElementById("forma-conceitual").innerHTML;



function criar_matris(){
    var matris = [
        [],
        [],
        [],
    ]
    for (let linha = 1; linha <= 3; linha++) {
        for (let coluna = 1; coluna <= 3; coluna++) {

            let valor = document.getElementById(`${linha}${coluna}`).value;
            matris[linha - 1].push(Number(valor))
            if (coluna == 3) {
                matris[linha - 1].push(matris[linha - 1][0])
                matris[linha - 1].push(matris[linha - 1][1])
            }
        }


    }
    console.log(matris)

    return matris
}

function resetarTudo() {
    document.getElementById('forma-conceitual').innerHTML = original
}
function substituirNaPagina(mapa) {

    function percorrer(node) {
        if (node.nodeType === 3) {

            // IMPORTANTE: subscritos reais
            node.nodeValue = node.nodeValue.replace(/a[₁₂₃][₁₂₃]/g, (match) => {
                return mapa[match] ?? match;
            });

        } else {
            node.childNodes.forEach(percorrer);
        }
    }

    percorrer(document.body);

    // inputs
    document.querySelectorAll("input").forEach(el => {
        if (el.value) {
            el.value = el.value.replace(/a[₁₂₃][₁₂₃]/g, (match) => {
                return mapa[match] ?? match;
            });
        }
    });
}




function aplicar_valores() {
    resetarTudo()
    var matris = criar_matris()

    let mapa = {};

    const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

    for (let linha = 1; linha <= 3; linha++) {
        for (let coluna = 1; coluna <= 3; coluna++) {

            let valor = document.getElementById(`${linha}${coluna}`).value;

            mapa[`a${sub[linha]}${sub[coluna]}`] = valor;
        }
    }

    
    substituirNaPagina(mapa);
}