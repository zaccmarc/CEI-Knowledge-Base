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
    // Input field events
    elements.messageInput.addEventListener('input', handleInputChange);
    elements.messageInput.addEventListener('keydown', handleKeyPress);

    // Send button event
    elements.sendButton.addEventListener('click', sendMessage);

    // Example cards events
    elements.exampleCards.forEach(card => {
        card.addEventListener('click', handleExampleClick);
    });
}

// ============================
// Event Handlers
// ============================
function handleInputChange(e) {
    const textarea = e.target;

    // Auto-resize textarea
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';

    // Toggle send button state
    if (textarea.value.trim()) {
        elements.sendButton.classList.add('active');
    } else {
        elements.sendButton.classList.remove('active');
    }
}

function handleKeyPress(e) {
    // Send message on Enter (without Shift)
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
function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || state.isTyping) return;

    // Hide welcome screen on first message
    if (state.isFirstMessage) {
        elements.welcomeScreen.classList.add('hidden');
        elements.chatArea.classList.add('active');
        state.isFirstMessage = false;
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    clearInput();

    // Simulate AI response
    state.isTyping = true;
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'assistant');
        state.isTyping = false;
    }, 1000);
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
    contentDiv.textContent = text;

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

// ============================
// AI Response Simulation
// ============================
function generateAIResponse(message) {
    const responses = {
        'fine motor': 'Here are some excellent fine motor skill activities for young children: threading beads, using play dough, practicing with safety scissors, finger painting, and building with small blocks. These activities help develop hand-eye coordination and prepare children for writing.',
        'biting': 'When handling biting in the classroom: Stay calm, comfort the injured child first, then address the biter with firm but gentle words. Explain that biting hurts others, provide alternatives like words to express feelings, and closely supervise to prevent future incidents.',
        'environment': 'Great environment project ideas include: creating a classroom garden, starting a recycling program, nature walks with collection bags, making bird feeders, and teaching about water conservation through hands-on activities. These help children connect with nature and understand sustainability.',
        'default': 'I understand you\'re asking about teaching strategies for young children. Let me help you with specific information about early childhood education practices. What particular aspect would you like to explore?'
    };

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('fine motor') || lowerMessage.includes('motor skill')) {
        return responses['fine motor'];
    } else if (lowerMessage.includes('biting') || lowerMessage.includes('bite')) {
        return responses['biting'];
    } else if (lowerMessage.includes('environment') || lowerMessage.includes('project')) {
        return responses['environment'];
    } else {
        return responses['default'];
    }
}