const participantesData = [
    { nome: "DÉBORA WESTPHAL", pontos: 9626 },
    { nome: "CELITO FRANCISCO DA SILVA JUNIOR", pontos: 7928 },
    { nome: "DOUGLAS CELIO BATISTA", pontos: 6810 },
    { nome: "CESAR BLUMENAU", pontos: 6799 },
    { nome: "ANDERSON BELLI", pontos: 6093 },
    { nome: "GRUPO CECHIN E FILHOS", pontos: 5908 },
    { nome: "VICTORIA FRASSON ALVES", pontos: 5571 },
    { nome: "MARIO ALVEZ LIMA", pontos: 5557 },
    { nome: "SIMONE DE JESUS", pontos: 4542 },
    { nome: "JOSIVAL ALVES LIMA", pontos: 4511 },
    { nome: "CRISTIANI LONGEN", pontos: 4324 },
    { nome: "GIUCIMAR MAZZUCCO", pontos: 3843 },
    { nome: "JEFFERSON PATRICK", pontos: 3554 },
    { nome: "DANIEL DEYVISON JUNKES", pontos: 3424 },
    { nome: "ELVIRA SCHONS", pontos: 2795 },
    { nome: "NANAINA FERREIRA", pontos: 2420 },
    { nome: "DEIVIS LUDWIG DA SILVA", pontos: 2204 },
    { nome: "LEANDRO BORGES FERREIRA", pontos: 2143 },
    { nome: "LOIA GOMES ALVES", pontos: 2018 },
    { nome: "ENIO JOSE MACHADO", pontos: 1868 },
    { nome: "MHM REPRESENTACOES", pontos: 1703 },
    { nome: "FLORIANE DESIDERIO RIBEIRO", pontos: 1697 },
    { nome: "FERNANDO RESMINI", pontos: 1672 },
    { nome: "LEIR ANTONIO POLONI", pontos: 1597 },
    { nome: "WILSON TRAIN", pontos: 1588 },
    { nome: "MARCELO GUIMARAES", pontos: 1465 },
    { nome: "DORVAL MOSCHEN", pontos: 1199 },
    { nome: "GABRIELA PARUCKER", pontos: 1189 },
    { nome: "VALERIA PAULA GLOWACKI", pontos: 1103 },
    { nome: "LEONARDO MANERICHI", pontos: 1026 },
    { nome: "JOAO JUSCELINO GARBATO", pontos: 865 },
    { nome: "ROBSON CANDIDO DE OLIVEIRA", pontos: 794 },
    { nome: "KADU PEIXOTO", pontos: 758 },
    { nome: "DARLEI RIBEIRO DA SILVA", pontos: 663 },
    { nome: "JOELSO ROBERTO POLONI", pontos: 585 },
    { nome: "THIAGO FIORENTINO LICASTRO", pontos: 475 },
    { nome: "JULIANO JERONIMO", pontos: 332 },
    { nome: "PATRICIA DOS SANTOS PARRA", pontos: 272 },
    { nome: "POSSENTI REPRESENTACOES", pontos: 252 },
    { nome: "RYAN PROVENSI", pontos: 172 },
    { nome: "AMANDA FERREIRA DO CARMO", pontos: 167 },
    { nome: "MARCOS ROMBALDI", pontos: 86 },
    { nome: "SARAH LETICIA FREISLEBEN", pontos: 20 },
    { nome: "SOUZA PROMOÇOES", pontos: 13 }
];

// Estado do jogo
let participantes = [];
let urna = [];
let vitorias = {};
let totalSorteados = 0;
let jogoAtivo = true;
let sorteando = false;
let campeao = null;
let animationTimer = null;

// Elementos DOM
const nomeDisplay = document.getElementById('nomeDisplay');
const totalCupons = document.getElementById('totalCupons');
const totalSorteadosEl = document.getElementById('totalSorteados');
const listaParticipantes = document.getElementById('listaParticipantes');
const totalParticipantes = document.getElementById('totalParticipantes');
const sortearBtn = document.getElementById('sortearBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const resultadoDiv = document.getElementById('resultado');
const campeaoModal = document.getElementById('campeaoModal');
const campeaoNome = document.getElementById('campeaoNome');
const campeaoInfo = document.getElementById('campeaoInfo');
const fecharCampeaoBtn = document.getElementById('fecharCampeaoBtn');

// Função para ajustar tamanho da fonte baseado no comprimento do nome
function ajustarTamanhoFonte(nome) {
    const display = nomeDisplay;
    
    // Remove classes anteriores
    display.classList.remove('nome-longo', 'nome-muito-longo');
    
    // Ajusta baseado no comprimento
    if (nome.length > 30) {
        display.classList.add('nome-muito-longo');
    } else if (nome.length > 20) {
        display.classList.add('nome-longo');
    }
}

// Inicializar jogo
function initJogo() {
    participantes = participantesData.map(p => ({
        ...p,
        vitorias: 0
    }));
    
    vitorias = {};
    participantes.forEach(p => {
        vitorias[p.nome] = 0;
    });
    
    totalSorteados = 0;
    jogoAtivo = true;
    campeao = null;
    sorteando = false;
    
    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }
    
    construirUrna();
    atualizarInterface();
    atualizarLista();
    
    resultadoDiv.classList.remove('mostrar');
    resultadoDiv.textContent = '';
    sortearBtn.disabled = false;
    nomeDisplay.textContent = '---';
    nomeDisplay.classList.remove('sorteando', 'nome-longo', 'nome-muito-longo');
}

// Construir urna com base nos pontos
function construirUrna() {
    urna = [];
    participantes.forEach(p => {
        for (let i = 0; i < p.pontos; i++) {
            urna.push(p.nome);
        }
    });
}

// Sortear nome da urna
function sortearNome() {
    if (!jogoAtivo || urna.length === 0) {
        return null;
    }

    const index = Math.floor(Math.random() * urna.length);
    const nome = urna[index];
    urna.splice(index, 1);
    
    return nome;
}

// Processar vitória
function processarVitoria(nome) {
    if (!jogoAtivo) return false;
    
    vitorias[nome] = (vitorias[nome] || 0) + 1;
    
    const participante = participantes.find(p => p.nome === nome);
    if (participante) {
        participante.vitorias = vitorias[nome];
    }
    
    totalSorteados++;
    
    if (vitorias[nome] >= 5 && !campeao) {
        campeao = nome;
        jogoAtivo = false;
        sortearBtn.disabled = true;
        anunciarCampeao(nome);
        return true;
    }
    
    return false;
}

// Anunciar campeão
function anunciarCampeao(nome) {
    campeaoNome.textContent = nome;
    campeaoInfo.textContent = `🏆 5 vitórias em ${totalSorteados} sorteios!`;
    campeaoModal.style.display = 'block';
    
    // Confetes
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            criarConfete();
        }, i * 80);
    }
    
    resultadoDiv.textContent = `🏆 ${nome} é o CAMPEÃO com 5 vitórias! 🏆`;
    resultadoDiv.classList.add('mostrar');
}

// Criar confete
function criarConfete() {
    const confete = document.createElement('div');
    const cores = ['#f15a22', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#ff69b4', '#7b68ee'];
    const tamanhos = [8, 10, 12, 14];
    
    confete.style.cssText = `
        position: fixed;
        width: ${tamanhos[Math.floor(Math.random() * tamanhos.length)]}px;
        height: ${tamanhos[Math.floor(Math.random() * tamanhos.length)]}px;
        background: ${cores[Math.floor(Math.random() * cores.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        animation: quedaConfete ${2 + Math.random() * 2}s linear forwards;
    `;
    document.body.appendChild(confete);
    
    setTimeout(() => {
        confete.remove();
    }, 4000);
}

// Adicionar estilo do confete
if (!document.getElementById('confeteStyle')) {
    const styleConfete = document.createElement('style');
    styleConfete.id = 'confeteStyle';
    styleConfete.textContent = `
        @keyframes quedaConfete {
            0% { 
                transform: translateY(0) rotate(0deg) scale(1);
                opacity: 1;
            }
            100% { 
                transform: translateY(110vh) rotate(720deg) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleConfete);
}

// Atualizar interface
function atualizarInterface() {
    totalCupons.textContent = urna.length;
    totalSorteadosEl.textContent = totalSorteados;
    totalParticipantes.textContent = participantes.length;
}

// Atualizar lista de participantes
function atualizarLista() {
    listaParticipantes.innerHTML = '';
    
    const sorted = [...participantes].sort((a, b) => b.vitorias - a.vitorias);
    
    sorted.forEach(p => {
        const div = document.createElement('div');
        div.className = `participante-item ${p.nome === campeao ? 'campeao' : ''}`;
        
        const progresso = Math.min((p.vitorias / 5) * 100, 100);
        const estrelas = '⭐'.repeat(Math.min(p.vitorias, 5));
        
        div.innerHTML = `
            <div class="participante-info">
                <span class="participante-nome">${p.nome}</span>
                <span class="participante-pontos">
                    🎫 ${p.pontos} cupons
                </span>
                <span class="participante-vitorias">
                    ${estrelas || '☆'} ${p.vitorias}/5
                </span>
            </div>
            <div class="barra-progresso">
                <div class="barra-progresso-fill" style="width: ${progresso}%"></div>
            </div>
        `;
        
        listaParticipantes.appendChild(div);
    });
}

// Verificar estado do jogo
function verificarEstadoJogo() {
    if (!jogoAtivo) {
        sortearBtn.disabled = true;
        return;
    }
    
    if (urna.length === 0) {
        sortearBtn.disabled = true;
        resultadoDiv.textContent = '⚠️ Acabaram os cupons! Ninguém chegou a 5 vitórias.';
        resultadoDiv.classList.add('mostrar');
        return;
    }
    
    sortearBtn.disabled = false;
}

// Finalizar sorteio
function finalizarSorteio() {
    nomeDisplay.classList.remove('sorteando');
    sorteando = false;
    
    const nome = sortearNome();
    
    if (nome) {
        nomeDisplay.textContent = nome;
        ajustarTamanhoFonte(nome);
        
        const ganhou = processarVitoria(nome);
        
        if (!ganhou && jogoAtivo) {
            resultadoDiv.textContent = `🎯 ${nome} ganhou! (${vitorias[nome]}/5 vitórias)`;
            resultadoDiv.classList.add('mostrar');
        }
        
        atualizarInterface();
        atualizarLista();
        verificarEstadoJogo();
    } else {
        verificarEstadoJogo();
    }
}

// Animação de sorteio
function iniciarAnimacao() {
    if (sorteando || !jogoAtivo || urna.length === 0) {
        return;
    }
    
    sorteando = true;
    sortearBtn.disabled = true;
    resultadoDiv.classList.remove('mostrar');
    nomeDisplay.classList.add('sorteando');
    
    let count = 0;
    const maxIteracoes = 15 + Math.floor(Math.random() * 5);
    
    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }
    
    animationTimer = setInterval(() => {
        if (urna.length > 0) {
            const nome = urna[Math.floor(Math.random() * urna.length)];
            nomeDisplay.textContent = nome;
            ajustarTamanhoFonte(nome);
        } else {
            clearInterval(animationTimer);
            animationTimer = null;
            finalizarSorteio();
            return;
        }
        
        count++;
        if (count >= maxIteracoes) {
            clearInterval(animationTimer);
            animationTimer = null;
            finalizarSorteio();
        }
    }, 80);
}

// Evento de sorteio
sortearBtn.addEventListener('click', () => {
    if (sorteando) return;
    iniciarAnimacao();
});

// Reiniciar jogo
reiniciarBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja reiniciar o sorteio?')) {
        campeaoModal.style.display = 'none';
        if (animationTimer) {
            clearInterval(animationTimer);
            animationTimer = null;
        }
        initJogo();
    }
});

// Fechar modal de campeão
fecharCampeaoBtn.addEventListener('click', () => {
    campeaoModal.style.display = 'none';
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target === campeaoModal) {
        campeaoModal.style.display = 'none';
    }
});

// Iniciar
initJogo();
