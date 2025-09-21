// ============================
// Global Variables
// ============================
const elements = {
    messageInput: null,
    sendButton: null,
    chatArea: null,
    welcomeScreen: null,
    exampleCards: null
};

let state = {
    isFirstMessage: true,
    isTyping: false
};

// IMPORTANTE: Cole aqui a URL da sua API obtida no deploy do Wrangler
const API_URL = 'https://api-novo-site.marcrepository.workers.dev';

// ============================
// Initialization
// ============================
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    attachEventListeners();
});

function initializeElements() {
    elements.messageInput = document.getElementById('messageInput');
    elements.sendButton = document.getElementById('sendButton');
    elements.chatArea = document.getElementById('chatArea');
    elements.welcomeScreen = document.getElementById('welcomeScreen');
    elements.exampleCards = document.querySelectorAll('.example-card');
}

function attachEventListeners() {
    elements.messageInput.addEventListener('input', handleInputChange);
    elements.messageInput.addEventListener('keydown', handleKeyPress);
    elements.sendButton.addEventListener('click', sendMessage);
    elements.exampleCards.forEach(card => {
        card.addEventListener('click', handleExampleClick);
    });
}

// ============================
// Event Handlers
// ============================
function handleInputChange(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    if (textarea.value.trim() && !state.isTyping) {
        elements.sendButton.classList.add('active');
    } else {
        elements.sendButton.classList.remove('active');
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function handleExampleClick(e) {
    const question = e.currentTarget.dataset.question;
    elements.messageInput.value = question;
    elements.messageInput.dispatchEvent(new Event('input'));
    sendMessage();
}

// ============================
// Message Functions
// ============================
async function sendMessage() {
    const userMessage = elements.messageInput.value.trim();
    if (!userMessage || state.isTyping) return;

    state.isTyping = true;
    if (state.isFirstMessage) {
        elements.welcomeScreen.classList.add('hidden');
        elements.chatArea.classList.add('active');
        state.isFirstMessage = false;
    }

    addMessage(userMessage, 'user');
    clearInput();
    addTypingIndicator(); // Adiciona o indicador de "digitando..."

    // --- A MÁGICA ACONTECE AQUI ---
    // Substituímos a simulação pela chamada real à API
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        removeTypingIndicator(); // Remove o indicador

        if (!response.ok) {
            throw new Error('A resposta da rede não foi bem-sucedida.');
        }

        const data = await response.json();
        addMessage(data.reply, 'assistant');

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        removeTypingIndicator(); // Garante que o indicador seja removido em caso de erro
        addMessage('Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde.', 'assistant');
    } finally {
        state.isTyping = false;
        handleInputChange({ target: elements.messageInput }); // Reavalia o estado do botão de enviar
    }
}

function addMessage(text, type) {
    const messageDiv = createMessageElement(text, type);
    elements.chatArea.appendChild(messageDiv);
    scrollToBottom();
}

function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon';
    iconDiv.innerHTML = type === 'user' ? getUserIcon() : getAssistantIcon();

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Converte o texto para HTML para renderizar quebras de linha e outras formatações
    contentDiv.innerHTML = text.replace(/\n/g, '<br>');

    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

// ============================
// Helper Functions
// ============================
function clearInput() {
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    elements.sendButton.classList.remove('active');
}

function scrollToBottom() {
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;
}

function addTypingIndicator() {
    const indicator = createMessageElement('...', 'assistant');
    indicator.id = 'typing-indicator';
    elements.chatArea.appendChild(indicator);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function getUserIcon() {
    return `
        <svg class="icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    `;
}

function getAssistantIcon() {
    return `
        <svg class="icon-ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>
    `;
}
