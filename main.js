// Portfolio — Shivam Soni
// Minimal JS for subtle entrance animations + AskShivam chat

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll animations ──────────────────────────────────────────────────
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.section, .project-card').forEach((el) => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ── AskShivam chat ─────────────────────────────────────────────────────
    const STACK_AI_URL = 'https://api.stack-ai.com/inference/v0/run/e0d29d77-0008-4f61-9bec-1b3b45ec324a/694d324d82550e8c1e757e13';
    const STACK_AI_KEY = 'd96010b6-4e98-4fd1-bd6d-59c8f946619e';

    const overlay   = document.getElementById('chatOverlay');
    const panel     = document.getElementById('chatPanel');
    const closeBtn  = document.getElementById('chatClose');
    const input     = document.getElementById('chatInput');
    const sendBtn   = document.getElementById('chatSend');
    const messages  = document.getElementById('chatMessages');
    const ctaBtn    = document.querySelector('.cta-button');

    // Unique session id so Stack AI can track conversation context
    const sessionId = 'sess_' + Math.random().toString(36).slice(2, 11);

    function openChat() {
        overlay.classList.add('active');
        panel.classList.add('active');
        overlay.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
        input.focus();
    }

    function closeChat() {
        overlay.classList.remove('active');
        panel.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    ctaBtn.addEventListener('click', (e) => { e.preventDefault(); openChat(); });
    overlay.addEventListener('click', closeChat);
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    sendBtn.addEventListener('click', sendMessage);

    function renderMarkdown(text) {
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '• $1')
            .replace(/---/g, '')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    function appendMessage(text, isUser) {
        const row    = document.createElement('div');
        row.className = `chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        if (isUser) {
            bubble.textContent = text;
        } else {
            bubble.innerHTML = renderMarkdown(text);
        }
        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const row    = document.createElement('div');
        row.className = 'chat-message chat-message--bot';
        row.id = 'typingIndicator';
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-typing';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
        return row;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        sendBtn.disabled = true;
        appendMessage(text, true);
        const typing = showTyping();

        try {
            const res = await fetch(STACK_AI_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STACK_AI_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'in-0': text, 'user_id': sessionId })
            });

            const data = await res.json();
            typing.remove();

            // Stack AI returns the answer under outputs['out-0']
            const reply = data?.outputs?.['out-0']
                       || data?.output
                       || data?.['out-0']
                       || 'Sorry, I didn\'t get a response. Try again.';
            appendMessage(reply, false);

        } catch {
            typing.remove();
            appendMessage('Something went wrong. Please try again.', false);
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }
});
