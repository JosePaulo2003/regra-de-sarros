// Fabio jurou que escreveu isso sozinho, mas a gente sabe que o ChatGPT foi o verdadeiro autor.

const original = document.getElementById("forma-conceitual").innerHTML;

// Formata números para não aparecer "-0" ou casas demais
function formatarNumero(valor) {
    if (Math.abs(valor) < 0.0000001) {
        return "0";
    }
    var resultado = String(valor);
    if (valor < 0) {
        return "(" + resultado + ")";
    }
    return resultado;
}

// Lê a matriz 3x3 dos campos de texto
function pegarMatriz() {
    var matriz = [];

    for (var linha = 1; linha <= 3; linha++) {
        var linhaAtual = [];

        for (var coluna = 1; coluna <= 3; coluna++) {
            var campo = document.getElementById(linha + "" + coluna);

            if (!campo) {
                throw new Error("Campo de entrada não encontrado.");
            }

            var texto = campo.value.trim();

            if (texto === "") {
                throw new Error("Preencha todos os campos da matriz.");
            }

            var numero = parseFloat(texto.replace(",", "."));

            if (isNaN(numero)) {
                throw new Error("Use apenas números válidos.");
            }

            linhaAtual.push(numero);
        }

        matriz.push(linhaAtual);
    }

    return matriz;
}

// Cria o mapa que troca a₁₁, a₂₂ ... pelos números digitados
function montarMapa(matriz) {
    var mapa = {};
    var subs = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

    for (var linha = 1; linha <= 3; linha++) {
        for (var coluna = 1; coluna <= 3; coluna++) {
            var chave = "a" + subs[linha] + subs[coluna];
            mapa[chave] = formatarNumero(matriz[linha - 1][coluna - 1]);
        }
    }

    return mapa;
}

// Volta o bloco de conteúdo conceitual para o HTML original
function resetarTudo() {
    var container = document.getElementById("forma-conceitual");
    container.innerHTML = original;
}

// Substitui as letras da matriz pelo valores que o usuário digitou
function substituirNaPagina(mapa) {
    var container = document.getElementById("forma-conceitual");

    function trocar(node) {
        if (node.nodeType === 3) {
            node.nodeValue = node.nodeValue.replace(/a[₁₂₃][₁₂₃]/g, function (texto) {
                if (mapa[texto]) {
                    return mapa[texto];
                }
                return texto;
            });
        } else {
            for (var i = 0; i < node.childNodes.length; i++) {
                trocar(node.childNodes[i]);
            }
        }
    }

    trocar(container);

    var inputs = document.querySelectorAll("input[type='number']");
    for (var j = 0; j < inputs.length; j++) {
        if (inputs[j].value) {
            inputs[j].value = inputs[j].value.replace(/a[₁₂₃][₁₂₃]/g, function (texto) {
                if (mapa[texto]) {
                    return mapa[texto];
                }
                return texto;
            });
        }
    }
}

// Calcula as 3 diagonais principais, as 3 secundárias e o determinante
function calcularParcelas(matriz) {
    var principal = [];
    var secundaria = [];

    principal.push({ elementos: [matriz[0][0], matriz[1][1], matriz[2][2]], valor: matriz[0][0] * matriz[1][1] * matriz[2][2] });
    principal.push({ elementos: [matriz[0][1], matriz[1][2], matriz[2][0]], valor: matriz[0][1] * matriz[1][2] * matriz[2][0] });
    principal.push({ elementos: [matriz[0][2], matriz[1][0], matriz[2][1]], valor: matriz[0][2] * matriz[1][0] * matriz[2][1] });

    secundaria.push({ elementos: [matriz[2][0], matriz[1][1], matriz[0][2]], valor: -(matriz[2][0] * matriz[1][1] * matriz[0][2]) });
    secundaria.push({ elementos: [matriz[2][1], matriz[1][2], matriz[0][0]], valor: -(matriz[2][1] * matriz[1][2] * matriz[0][0]) });
    secundaria.push({ elementos: [matriz[2][2], matriz[1][0], matriz[0][1]], valor: -(matriz[2][2] * matriz[1][0] * matriz[0][1]) });

    var soma = principal[0].valor + principal[1].valor + principal[2].valor;
    var sub = secundaria[0].valor + secundaria[1].valor + secundaria[2].valor;
    var determinante = soma + sub;

    return {
        principal: principal,
        secundaria: secundaria,
        soma: soma,
        sub: sub,
        determinante: determinante,
    };
}

// Atualiza os textos do passo a passo com os resultados
function atualizarResultados(resultados) {
    var nomesPrincipal = ["A₁", "B₂", "C₃"];
    var nomesSecundaria = ["- X₁", "(− Y₂)", "(− Z₃)"];

    for (var i = 0; i < resultados.principal.length; i++) {
        var exprPrincipal = document.getElementById("diag-p-" + (i + 1) + "-expr");
        var valorPrincipal = document.getElementById("diag-p-" + (i + 1) + "-valor");

        if (exprPrincipal) {
            exprPrincipal.textContent = resultados.principal[i].elementos.join(" × ");
        }

        if (valorPrincipal) {
            valorPrincipal.textContent = "= " + formatarNumero(resultados.principal[i].valor);
            valorPrincipal.classList.remove("result-hidden");
        }
    }

    for (var k = 0; k < resultados.secundaria.length; k++) {
        var exprSec = document.getElementById("diag-s-" + (k + 1) + "-expr");
        var valorSec = document.getElementById("diag-s-" + (k + 1) + "-valor");

        if (exprSec) {
            exprSec.textContent = resultados.secundaria[k].elementos.join(" × ");
        }

        if (valorSec) {
            valorSec.textContent = "= " + formatarNumero(resultados.secundaria[k].valor);
            valorSec.classList.remove("result-hidden");
        }
    }

    var somaDetalhe = document.getElementById("soma-detalhe");
    if (somaDetalhe) {
        var partesSoma = [];
        for (var s = 0; s < resultados.principal.length; s++) {
            partesSoma.push(formatarNumero(resultados.principal[s].valor));
        }
        somaDetalhe.textContent = "SOMA = " + partesSoma.join(" + ") + " = " + formatarNumero(resultados.soma);
    }

    var subDetalhe = document.getElementById("sub-detalhe");
    if (subDetalhe) {
        var partesSub = [];
        for (var t = 0; t < resultados.secundaria.length; t++) {
            partesSub.push(formatarNumero(resultados.secundaria[t].valor));
        }
        subDetalhe.textContent = "SUB = " + partesSub.join(" + ") + " = " + formatarNumero(resultados.sub);
    }

    var detTexto = document.getElementById("determinant-expression");
    if (detTexto) {
        detTexto.textContent = "= " + formatarNumero(resultados.soma) + " + (" + formatarNumero(resultados.sub) + ") = " + formatarNumero(resultados.determinante);
    }

    var detNota = document.getElementById("determinant-note");
    if (detNota) {
        detNota.textContent = "Determinante obtido: " + formatarNumero(resultados.determinante) + " (SOMA + SUB) pela Regra de Sarrus";
    }
}

// Mostra ou esconde mensagens para o usuário
function atualizarLog(mensagem, tipo) {
    var log = document.getElementById("log");

    if (!log) {
        return;
    }

    if (!mensagem) {
        log.textContent = "";
        log.className = "log-message log-success log-hidden";
    } else {
        log.textContent = mensagem;
        log.className = "log-message log-" + (tipo || "info");
    }
}

// Controla a abertura da área opcional de entrada manual
function inicializarEntradaManual() {
    var toggle = document.getElementById("manual-toggle");
    var painel = document.getElementById("manual-panel");
    var botao = document.getElementById("manual-apply");

    if (!toggle || !painel || !botao) {
        return;
    }

    var campos = painel.querySelectorAll("input[type='number']");

    function fecharPainel() {
        painel.setAttribute("hidden", "hidden");
        painel.style.display = "none";
        toggle.setAttribute("aria-expanded", "false");
        botao.disabled = true;

        for (var i = 0; i < campos.length; i++) {
            campos[i].disabled = true;
            campos[i].value = "";
        }

        var icone = toggle.querySelector(".toggle-icon");
        if (icone) {
            icone.textContent = "▸";
        }
    }

    function abrirPainel() {
        painel.removeAttribute("hidden");
        painel.style.display = "grid";
        toggle.setAttribute("aria-expanded", "true");
        botao.disabled = false;

        for (var i = 0; i < campos.length; i++) {
            campos[i].disabled = false;
        }

        var icone = toggle.querySelector(".toggle-icon");
        if (icone) {
            icone.textContent = "▾";
        }
    }

    fecharPainel();

    toggle.addEventListener("click", function () {
        var aberto = toggle.getAttribute("aria-expanded") === "true";

        if (aberto) {
            fecharPainel();
        } else {
            abrirPainel();
        }
    });
}

// Fluxo principal quando o usuário clica em "Aplicar números"
function aplicar_valores() {
    try {
        var matriz = pegarMatriz();
        resetarTudo();

        var mapa = montarMapa(matriz);
        substituirNaPagina(mapa);

        var resultados = calcularParcelas(matriz);
        atualizarResultados(resultados);

        atualizarLog("", "success");
    } catch (erro) {
        resetarTudo();
        atualizarLog(erro.message, "error");
        console.error(erro);
    }
}

inicializarEntradaManual();