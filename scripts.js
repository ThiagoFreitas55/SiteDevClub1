document.addEventListener('DOMContentLoaded', function () {
    // Criação das partículas
    const particlesContainer = document.getElementById('particles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = '#00ff66';
        particle.style.boxShadow = '0 0 10px #00ff66, 0 0 20px #00ff66';
        particle.style.borderRadius = '50%';

        // Posição inicial aleatória
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Animação
        particle.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`;

        particlesContainer.appendChild(particle);

        // Remove a partícula após a animação
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Cria partículas periodicamente (menos partículas em telas pequenas/celulares
    // para evitar travamentos, já que o efeito 3D do herói já consome bastante processamento)
    const isSmallScreen = window.innerWidth <= 768;
    setInterval(createParticle, isSmallScreen ? 160 : 50);

    // Efeito de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Adiciona animação CSS para as partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-150px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Menu Hambúrguer
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav ul li a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
});

// Fecha o menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    }
});

// Atualiza partículas ao redimensionar a janela
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const particles = document.querySelectorAll('#particles > div');
        particles.forEach(particle => particle.remove());
    }, 250);
});

// Carousel
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.project-card');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (!track || !cards.length) return;

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 32;
    let cardsPerView = window.innerWidth > 768 ? 3 : 1;

    // Anima entrada dos cards
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function updateButtons() {
        if (prevButton) prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
        if (nextButton) nextButton.style.display =
            currentIndex >= cards.length - cardsPerView ? 'none' : 'block';
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
            updateButtons();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(currentIndex + 1, cards.length - cardsPerView);
            updateCarousel();
            updateButtons();
        });
    }

    // Atualiza em caso de redimensionamento
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + 32;
        cardsPerView = window.innerWidth > 768 ? 3 : 1;
        currentIndex = Math.min(currentIndex, cards.length - cardsPerView);
        updateCarousel();
        updateButtons();
    });

    // Inicializa
    updateButtons();
});

// Chat AI
class ChatBot {
    constructor() {
        this.chatToggle = document.querySelector('.chat-toggle');
        this.chatContainer = document.querySelector('.chat-container');
        this.closeChatButton = document.querySelector('.close-chat');
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.send-message');

        this.inactivityTimeout = null;
        this.names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Fernanda', 'Rafael'];
        this.currentName = this.getRandomName();
        this.setInactivityTimeout(3 * 60 * 1000);
        this.initializeChat();
        this.addEventListeners();
    }

    getRandomName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }

    initializeChat() {
        this.addMessage(`Olá! Me chamo ${this.currentName}, sou o assistente virtual da DevClub. Em que posso ajudar você hoje?`, 'bot');
    }

    addEventListeners() {
        this.chatToggle.addEventListener('click', () => {
            this.toggleChat();
            this.setInactivityTimeout();
        });
        this.closeChatButton.addEventListener('click', () => {
            this.toggleChat();
            this.clearInactivityTimeout();
        });
        this.sendButton.addEventListener('click', () => {
            this.handleUserMessage();
        });
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (this.chatContainer.classList.contains('active')) {
            this.chatInput.focus();
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async handleUserMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';

        this.clearInactivityTimeout();
        this.setInactivityTimeout(3 * 60 * 1000);

        await this.simulateTyping();
        const response = this.processResponse(message);
        this.addMessage(response, 'bot');
    }

    async simulateTyping() {
        return new Promise(resolve => {
            setTimeout(resolve, Math.random() * 1000 + 500);
        });
    }

    processResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('e aí')) {
            return `Oi! Tudo bem? Sou ${this.currentName} da DevClub. Como posso te ajudar?`;
        }

        if (lowerMessage.includes('cursos') || lowerMessage.includes('curso')) {
            return 'Oferecemos cursos em Desenvolvimento Web, Python, Data Science e muito mais! Qual área te interessa?';
        }

        if (lowerMessage.includes('matricul') || lowerMessage.includes('inscrição')) {
            return 'Para se matricular, clique no botão "Faça sua matrícula" no topo da página ou entre em contato conosco!';
        }

        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('cust')) {
            return 'Nossos preços são competitivos! Entre em contato através do formulário para detalhes específicos.';
        }

        if (lowerMessage.includes('contato') || lowerMessage.includes('email') || lowerMessage.includes('telefone')) {
            return 'Você pode encontrar nossos contatos na seção de Contato. Também estamos disponíveis via WhatsApp!';
        }

        if (lowerMessage.includes('equipe') || lowerMessage.includes('professores') || lowerMessage.includes('instrutor')) {
            return 'Nossa equipe é composta por profissionais experientes. Veja a seção Liderança para conhecer melhor!';
        }

        if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu') || lowerMessage.includes('thanks')) {
            return 'De nada! Fico feliz em ajudar. Tem mais alguma dúvida?';
        }

        if (lowerMessage.includes('tchau') || lowerMessage.includes('adeus') || lowerMessage.includes('até')) {
            return 'Até logo! Volte sempre que precisar! 👋';
        }

        return 'Entendi sua pergunta! Para mais informações específicas, confira as seções do site ou entre em contato conosco!';
    }

    setInactivityTimeout() {
        this.clearInactivityTimeout();
        this.inactivityTimeout = setTimeout(() => {
            this.addMessage('Parece que você se foi... Estarei aqui se precisar!', 'bot');
            this.toggleChat();
        }, 3 * 60 * 1000);
    }

    clearInactivityTimeout() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
        }
    }
}

// Inicializa o chat quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Efeitos adicionais
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        e.target.style.color = '#00ff66';
    });

    link.addEventListener('mouseleave', (e) => {
        e.target.style.color = '#ffffff';
    });
});

// Shuffle projects
function shuffleProjects() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;
    
    const projectCards = Array.from(carouselTrack.getElementsByClassName('project-card'));
    
    for (let i = projectCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [projectCards[i], projectCards[j]] = [projectCards[j], projectCards[i]];
    }
    
    projectCards.forEach(card => {
        carouselTrack.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    shuffleProjects();
});

// Glow particles animation with logo formation effect
// Glow particles animation (three.js) with logo formation + mouse interaction
function initGlowParticles() {
    const canvas = document.getElementById('glow-particles');
    if (!canvas || typeof THREE === 'undefined') return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // Textura de brilho (glow) circular gerada em canvas 2D
    function makeGlowTexture() {
        const size = 128;
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const cctx = c.getContext('2d');
        const grd = cctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grd.addColorStop(0, 'rgba(210,255,190,1)');
        grd.addColorStop(0.5, 'rgba(40,255,110,1)');
        grd.addColorStop(0.85, 'rgba(0,255,80,0.45)');
        grd.addColorStop(1, 'rgba(0,255,80,0)');
        cctx.fillStyle = grd;
        cctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
    }
    const glowTexture = makeGlowTexture();

    let geometry = null;
    let material = null;
    let points = null;
    let particleCount = 0;
    let base = null;   // posições "casa" (x,y) no espaço do mundo
    let phase = null;
    let speed = null;
    let amp = null;

    let animationTime = 0;
    let isForming = true;
    const FORMATION_DURATION = 3.2;

    const mouse = { x: 999999, y: 999999, active: false };
    const REPEL_RADIUS = 95;
    const REPEL_STRENGTH = 50;

    // Converte coordenadas de tela (px, py) para o espaço do mundo do three.js
    function toWorld(px, py) {
        return { x: px - width / 2, y: -(py - height / 2) };
    }

    // Fallback (caso a imagem da logo não carregue): contorno simples
    function generateFallbackPoints() {
        const pts = [];
        const size = Math.min(width, height) * 0.35;
        const startX = width / 2 - size / 2;
        const startY = height / 2 - size / 2;
        const step = 14;
        for (let y = 0; y <= size; y += step) {
            pts.push(toWorld(startX, startY + y));
            pts.push(toWorld(startX + size, startY + y));
        }
        for (let x = 0; x <= size; x += step) {
            pts.push(toWorld(startX + x, startY));
            pts.push(toWorld(startX + x, startY + size));
        }
        return pts;
    }

    // Amostra os pixels reais do logo.png (mesmo arquivo do menu) para que
    // a chuva de partículas se condense na logo de verdade
    function generateLogoPoints(callback) {
        const logoImgEl = document.querySelector('.logo img');
        if (!logoImgEl || !logoImgEl.src) {
            callback(generateFallbackPoints());
            return;
        }

        let done = false;
        const finish = (pts) => {
            if (done) return;
            done = true;
            callback(pts);
        };
        const safety = setTimeout(() => finish(generateFallbackPoints()), 1200);

        const img = new Image();
        img.onload = () => {
            clearTimeout(safety);
            try {
                const displaySize = Math.max(300, Math.min(520, width * 0.45, height * 0.6));
                const sampleCanvas = document.createElement('canvas');
                sampleCanvas.width = displaySize;
                sampleCanvas.height = displaySize;
                const sctx = sampleCanvas.getContext('2d');
                sctx.drawImage(img, 0, 0, displaySize, displaySize);
                const data = sctx.getImageData(0, 0, displaySize, displaySize).data;
                const step = 2;
                const startX = width / 2 - displaySize / 2;
                const startY = height / 2 - displaySize / 2;
                const pts = [];
                for (let y = 0; y < displaySize; y += step) {
                    for (let x = 0; x < displaySize; x += step) {
                        const idx = (y * displaySize + x) * 4;
                        const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                        if (a > 100 && (r + g + b) < 180) {
                            pts.push(toWorld(startX + x, startY + y));
                        }
                    }
                }
                if (pts.length < 10) finish(generateFallbackPoints());
                else {
                    // Limite de segurança: em computadores/celulares mais
                    // fracos, milhares de pontos com brilho aditivo derrubam
                    // o FPS. Se passar de 6000, descarta pontos igualmente
                    // espaçados pra manter a forma, só menos densa.
                    const MAX_POINTS = 6000;
                    if (pts.length > MAX_POINTS) {
                        const keepRatio = MAX_POINTS / pts.length;
                        const thinned = pts.filter((_, idx) => (idx * keepRatio) % 1 < keepRatio);
                        finish(thinned);
                    } else {
                        finish(pts);
                    }
                }
            } catch (e) {
                finish(generateFallbackPoints());
            }
        };
        img.onerror = () => {
            clearTimeout(safety);
            finish(generateFallbackPoints());
        };
        img.src = logoImgEl.src;
    }

    function buildParticles(homePts) {
        particleCount = homePts.length;
        const positions = new Float32Array(particleCount * 3);
        base = new Float32Array(particleCount * 2);
        phase = new Float32Array(particleCount);
        speed = new Float32Array(particleCount);
        amp = new Float32Array(particleCount * 2);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const home = homePts[i];
            base[i * 2] = home.x;
            base[i * 2 + 1] = home.y;
            // Nasce "chovendo" de cima da tela
            positions[i * 3] = home.x + (Math.random() - 0.5) * width * 0.6;
            positions[i * 3 + 1] = height / 2 + Math.random() * height * 0.8 + 40;
            positions[i * 3 + 2] = 0;
            phase[i] = Math.random() * Math.PI * 2;
            speed[i] = 0.6 + Math.random() * 1.1;
            amp[i * 2] = 0.6 + Math.random() * 1.2;
            amp[i * 2 + 1] = 0.6 + Math.random() * 1.2;
            sizes[i] = 8 + Math.random() * 5;
            const b = 0.75 + Math.random() * 0.25;
            colors[i * 3] = 0.1 * b;
            colors[i * 3 + 1] = b;
            colors[i * 3 + 2] = 0.12 * b;
        }

        if (points) {
            scene.remove(points);
            geometry.dispose();
        }
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        if (!material) {
            material = new THREE.PointsMaterial({
                map: glowTexture,
                size: 9,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                sizeAttenuation: true
            });
        }
        points = new THREE.Points(geometry, material);
        scene.add(points);
    }

    // Reinicia a formação (usado no clique): espalha e faz cair de novo
    function replayFormation() {
        if (!geometry) return;
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const bx = base[i * 2], by = base[i * 2 + 1];
            pos[i * 3] = bx + (Math.random() - 0.5) * width * 0.9;
            pos[i * 3 + 1] = by + (Math.random() - 0.5) * height * 0.9;
        }
        geometry.attributes.position.needsUpdate = true;
        animationTime = 0;
        isForming = true;
    }

    let lastFrameTime = performance.now();

    function animate() {
        requestAnimationFrame(animate);
        const now = performance.now();
        // Limita o "salto" de tempo (ex: aba fora de foco) pra não fazer a
        // formação pular direto pro fim quando a aba volta a ficar ativa
        const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
        lastFrameTime = now;
        animationTime += dt;

        // Fatores de suavização convertidos para independentes de FPS:
        // equivalem a 0.05 e 0.18 por quadro a 60fps, mas continuam corretos
        // em qualquer taxa de quadros (computador rápido ou lento).
        const kForm = 1 - Math.pow(1 - 0.05, dt * 60);
        const kAlive = 1 - Math.pow(1 - 0.18, dt * 60);

        if (geometry) {
            const pos = geometry.attributes.position.array;

            if (animationTime < FORMATION_DURATION && isForming) {
                // Fase de formação: a chuva cai e se organiza na logo
                for (let i = 0; i < particleCount; i++) {
                    const bx = base[i * 2], by = base[i * 2 + 1];
                    pos[i * 3] += (bx - pos[i * 3]) * kForm;
                    pos[i * 3 + 1] += (by - pos[i * 3 + 1]) * kForm;
                }
            } else {
                isForming = false;
                // Fase "viva": oscila suavemente e reage ao mouse (faíscas
                // se afastam do cursor e voltam para a posição da logo)
                for (let i = 0; i < particleCount; i++) {
                    const bx = base[i * 2], by = base[i * 2 + 1];
                    const t = animationTime * speed[i] + phase[i];
                    let tx = bx + Math.sin(t) * amp[i * 2];
                    let ty = by + Math.cos(t * 0.85) * amp[i * 2 + 1];

                    if (mouse.active) {
                        const dx = tx - mouse.x;
                        const dy = ty - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < REPEL_RADIUS && dist > 0.001) {
                            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
                            tx += (dx / dist) * force;
                            ty += (dy / dist) * force;
                        }
                    }

                    pos[i * 3] += (tx - pos[i * 3]) * kAlive;
                    pos[i * 3 + 1] += (ty - pos[i * 3 + 1]) * kAlive;
                }
            }
            geometry.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
    }

    let lastWidth = window.innerWidth;
    let resizeDebounce = null;

    function onResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);

        // No celular, a barra de endereço aparece/some ao rolar a tela e isso
        // dispara "resize" o tempo todo mudando só a altura. Isso não deve
        // recalcular a logo (só reposicionar em mudanças reais de largura),
        // senão os pontos ficam trocados de lugar e a logo "esparrama".
        const widthChanged = Math.abs(width - lastWidth) > 60;
        if (!widthChanged) return;

        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
            lastWidth = width;
            if (particleCount) {
                generateLogoPoints((pts) => {
                    // Reconstrói as partículas do zero (com a contagem nova
                    // de pontos) em vez de tentar remapear pelo índice, que
                    // é o que causava a bagunça.
                    buildParticles(pts);
                    animationTime = 0;
                    isForming = true;
                });
            }
        }, 250);
    }

    function onPointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const w = toWorld(px, py);
        mouse.x = w.x;
        mouse.y = w.y;
        mouse.active = true;
    }
    function onPointerLeave() {
        mouse.active = false;
    }

    generateLogoPoints((pts) => {
        buildParticles(pts);
        animate();
    });

    // Formação acontece uma única vez; depois de formada, a logo permanece
    // de frente (só reage sutilmente ao mouse passando perto).
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('resize', onResize);
}

document.addEventListener('DOMContentLoaded', initGlowParticles);