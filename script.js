// Variável global para rastrear o passo atual
let currentStep = 1;
const totalSteps = 14;

// Função para navegar entre os passos
function goToStep(stepNumber) {
    // Validar número do passo
    if (stepNumber < 1 || stepNumber > totalSteps) {
        console.error('Passo inválido');
        return;
    }

    // Remover classe 'active' de todos os passos
    const allSteps = document.querySelectorAll('.step');
    allSteps.forEach(step => {
        step.classList.remove('active');
    });

    // Adicionar classe 'active' ao passo selecionado
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Atualizar o passo atual
    currentStep = stepNumber;

    // Atualizar a barra de progresso
    updateProgressBar();

    // Fazer scroll para o topo do fluxograma
    scrollToTop();

    // Adicionar efeito visual
    addAnimationEffect();
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    // Calcular a porcentagem
    const percentage = (currentStep / totalSteps) * 100;

    // Atualizar a largura da barra
    progressFill.style.width = percentage + '%';

    // Atualizar o texto
    progressText.textContent = `Passo ${currentStep} de ${totalSteps}`;
}

// Função para fazer scroll para o topo
function scrollToTop() {
    const flowchartContainer = document.querySelector('.flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para adicionar efeito visual ao mudar de passo
function addAnimationEffect() {
    const flowchartContainer = document.querySelector('.flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.style.opacity = '0.8';
        setTimeout(() => {
            flowchartContainer.style.opacity = '1';
            flowchartContainer.style.transition = 'opacity 0.3s ease-in-out';
        }, 50);
    }
}

// Função para resetar o fluxograma
function resetFlowchart() {
    goToStep(1);
    console.log('Fluxograma reiniciado');
}

// Função para obter o passo atual
function getCurrentStep() {
    return currentStep;
}

// Função para contar quantas escolhas o usuário fez
function getProgressPercentage() {
    return Math.round((currentStep / totalSteps) * 100);
}

// Adicionar atalhos de teclado
document.addEventListener('keydown', (event) => {
    // Tecla Enter para continuar (quando há um botão primário)
    if (event.key === 'Enter') {
        const primaryBtn = document.querySelector('.step.active .btn-primary');
        if (primaryBtn) {
            primaryBtn.click();
        }
    }

    // Tecla Escape para voltar
    if (event.key === 'Escape') {
        const secondaryBtn = document.querySelector('.step.active .btn-secondary');
        if (secondaryBtn) {
            secondaryBtn.click();
        }
    }

    // Setas de teclado para navegação
    if (event.key === 'ArrowRight') {
        const nextBtn = document.querySelector('.step.active .btn-option:first-of-type');
        if (nextBtn) {
            nextBtn.click();
        }
    }

    if (event.key === 'ArrowLeft') {
        const backBtn = document.querySelector('.step.active .btn-secondary');
        if (backBtn) {
            backBtn.click();
        }
    }
});

// Adicionar suporte a touch para mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe para a esquerda - próximo
            const nextBtn = document.querySelector('.step.active .btn-option:first-of-type');
            if (nextBtn) {
                nextBtn.click();
            }
        } else {
            // Swipe para a direita - voltar
            const backBtn = document.querySelector('.step.active .btn-secondary');
            if (backBtn) {
                backBtn.click();
            }
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Fluxograma carregado');
    
    // Inicializar no primeiro passo
    goToStep(1);

    // Adicionar listeners aos botões para efeitos sonoros (opcional)
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
        });
    });

    // Log de informações no console
    console.log('Total de passos:', totalSteps);
    console.log('Atalhos disponíveis:');
    console.log('- Enter: Continuar');
    console.log('- Escape: Voltar');
    console.log('- Setas direcionais: Navegar');
});

// Função para reproduzir som ao clicar (opcional)
function playClickSound() {
    // Usar Web Audio API para criar um som simples
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Frequência em Hz
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Se houver erro, simplesmente ignora
    }
}

// Função para salvar o progresso no localStorage
function saveProgress() {
    localStorage.setItem('flowchartStep', currentStep);
    localStorage.setItem('flowchartTimestamp', new Date().toISOString());
    console.log('Progresso salvo:', currentStep);
}

// Função para carregar o progresso do localStorage
function loadProgress() {
    const savedStep = localStorage.getItem('flowchartStep');
    if (savedStep) {
        const step = parseInt(savedStep);
        if (step >= 1 && step <= totalSteps) {
            goToStep(step);
            console.log('Progresso carregado:', step);
        }
    }
}

// Salvar progresso a cada mudança de passo
const originalGoToStep = goToStep;
goToStep = function(stepNumber) {
    originalGoToStep(stepNumber);
    saveProgress();
};

// Carregar progresso ao iniciar (comentado, descomente se desejar)
// window.addEventListener('load', loadProgress);

// Função para obter estatísticas
function getStatistics() {
    const stats = {
        currentStep: currentStep,
        totalSteps: totalSteps,
        progressPercentage: getProgressPercentage(),
        isCompleted: currentStep === totalSteps
    };
    return stats;
}

// Função para exportar histórico de decisões (simulado)
function exportHistory() {
    const history = {
        timestamp: new Date().toISOString(),
        currentStep: currentStep,
        progressPercentage: getProgressPercentage(),
        browser: navigator.userAgent
    };
    console.log('Histórico de sessão:', history);
    return history;
}

// Adicionar listener ao window para detectar quando sair da página
window.addEventListener('beforeunload', () => {
    saveProgress();
});

// Log de informações úteis
console.log('Sistema de Fluxograma Interativo Carregado');
console.log('Versão: 1.0');
console.log('Total de passos:', totalSteps);
