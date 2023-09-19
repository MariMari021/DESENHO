// let canvas = document.getElementById("canvas");
// let contexto = canvas.getContext("2d");
// let desenhando = false;
// let corFundo = "white"; // Cor de fundo padrão
// let corLinha = "red"; // Cor da linha padrão

// // Função para definir a cor de fundo do canvas
// function definirCorFundo(cor) {
//     corFundo = cor;
//     redesenharCanvas(); // Redesenha o canvas com a nova cor de fundo
// }

// // Função para definir a cor da linha
// function definirCorLinha(cor) {
//     corLinha = cor;
//     // Atualize o valor do input de seleção de cor da linha
//     document.getElementById("escolher-cor-linha").value = cor;
// }

// // Função para trocar a cor da linha usando o input de seleção de cor
// function trocarCorLinha() {
//     corLinha = document.getElementById("escolher-cor-linha").value;
// }

// // Função para redesenhar o canvas com a nova cor de fundo
// function redesenharCanvas() {
//     contexto.fillStyle = corFundo;
//     contexto.fillRect(0, 0, canvas.width, canvas.height);
// }

// canvas.addEventListener("mousedown", function (event) {
//     desenhando = true;
//     contexto.strokeStyle = corLinha; // Defina a cor da linha antes de começar a desenhar
//     contexto.beginPath();
//     contexto.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
// });

// canvas.addEventListener("mousemove", function (event) {
//     if (desenhando) {
//         contexto.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
//         contexto.stroke();
//     }
// });

// canvas.addEventListener("mouseup", function () {
//     desenhando = false;
// });

// // Inicialmente, desenhe o canvas com a cor de fundo padrão
// redesenharCanvas();

let canvas = document.getElementById("canvas");
let contexto = canvas.getContext("2d");
let corFundo = "white"; // Cor de fundo padrão
let corLinha = "red"; // Cor da linha padrão
let formaAtual = "lapis"; // Forma de desenho padrão
let modoPreenchimento = false; // Modo de preenchimento

let formas = []; // Armazena todas as formas desenhadas

// Função para definir a cor de fundo do canvas
function definirCorFundo(cor) {
    corFundo = cor;
    redesenharCanvas(); // Redesenha o canvas com a nova cor de fundo
}

// Função para definir a cor da linha
function definirCorLinha(cor) {
    corLinha = cor;
    // Atualize o valor do input de seleção de cor da linha
    document.getElementById("escolher-cor-linha").value = cor;
}

// Função para trocar a cor da linha usando o input de seleção de cor
function trocarCorLinha() {
    corLinha = document.getElementById("escolher-cor-linha").value;
}

// Função para definir a forma de desenho
function definirForma(forma) {
    formaAtual = forma;
}

// Função para ativar/desativar o modo de preenchimento
function ativarModoPreenchimento() {
    modoPreenchimento = !modoPreenchimento; // Inverte o estado do modo de preenchimento
}

// Função para redesenhar o canvas com a nova cor de fundo e todas as formas existentes
function redesenharCanvas() {
    contexto.fillStyle = corFundo;
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    for (const forma of formas) {
        contexto.strokeStyle = forma.cor;
        contexto.lineWidth = forma.larguraLinha;
        contexto.beginPath();
        if (forma.tipo === 'retangulo') {
            contexto.strokeRect(forma.x, forma.y, forma.largura, forma.altura);
            if (modoPreenchimento) {
                contexto.fillStyle = forma.preenchimento;
                contexto.fillRect(forma.x, forma.y, forma.largura, forma.altura);
            }
        } else if (forma.tipo === 'circulo') {
            contexto.beginPath();
            contexto.arc(forma.x, forma.y, forma.raio, 0, 2 * Math.PI);
            contexto.stroke();
            if (modoPreenchimento) {
                contexto.fillStyle = forma.preenchimento;
                contexto.fill();
            }
        } else if (forma.tipo === 'lapis') {
            contexto.beginPath();
            contexto.moveTo(forma.pontos[0].x, forma.pontos[0].y);
            for (let i = 1; i < forma.pontos.length; i++) {
                contexto.lineTo(forma.pontos[i].x, forma.pontos[i].y);
            }
            contexto.stroke();
        }
    }
}

canvas.addEventListener("mousedown", function (event) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    if (formaAtual === 'lapis') {
        desenhando = true;
        contexto.strokeStyle = corLinha;
        contexto.lineWidth = 2;
        formas.push({
            tipo: formaAtual,
            cor: corLinha,
            preenchimento: corFundo, // Defina a cor de preenchimento
            larguraLinha: 2,
            pontos: [{ x, y }]
        });
        contexto.beginPath();
        contexto.moveTo(x, y);
    } else {
        desenhando = false;
        formaInicioX = x;
        formaInicioY = y;
    }
});

canvas.addEventListener("mousemove", function (event) {
    if (desenhando) {
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        contexto.lineTo(x, y);
        contexto.stroke();
        formas[formas.length - 1].pontos.push({ x, y });
    }
});

canvas.addEventListener("mouseup", function (event) {
    if (!desenhando && formaAtual !== 'lapis') {
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        if (formaAtual === 'retangulo') {
            const largura = x - formaInicioX;
            const altura = y - formaInicioY;

            formas.push({
                tipo: formaAtual,
                cor: corLinha,
                preenchimento: modoPreenchimento ? corLinha : corFundo, // Defina a cor de preenchimento
                larguraLinha: 2,
                x: formaInicioX,
                y: formaInicioY,
                largura,
                altura
            });
        } else if (formaAtual === 'circulo') {
            const raio = Math.sqrt(Math.pow(x - formaInicioX, 2) + Math.pow(y - formaInicioY, 2));

            formas.push({
                tipo: formaAtual,
                cor: corLinha,
                preenchimento: modoPreenchimento ? corLinha : corFundo, // Defina a cor de preenchimento
                larguraLinha: 2,
                x: formaInicioX,
                y: formaInicioY,
                raio
            });
        }

        redesenharCanvas();
    }

    desenhando = false;
});

// Inicialmente, desenhe o canvas com a cor de fundo padrão
redesenharCanvas();