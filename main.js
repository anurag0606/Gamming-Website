/* ========================================
   GAMERZONE - Dynamic JavaScript
   ======================================== */

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hide');
            // Start animations after loader
            initScrollReveal();
            initStatsCounter();
        }
    }, 2500);
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#00f5ff' : '#7c3aed';
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDir;
        if (this.opacity >= 0.6 || this.opacity <= 0.05) {
            this.twinkleDir *= -1;
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create particles
function initParticles() {
    particles = [];
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.save();
                ctx.globalAlpha = (1 - dist / 120) * 0.12;
                ctx.strokeStyle = '#00f5ff';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== CUSTOM CURSOR =====
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Smooth cursor follow
function animateCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor effects on interactive elements
document.querySelectorAll('a, button, .filter-btn, .gamescard, .tourcard').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '60px';
            cursorGlow.style.height = '60px';
            cursorGlow.style.background = 'rgba(0,245,255,0.15)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
            cursorGlow.style.background = 'transparent';
        }
    });
});

// ===== STICKY HEADER =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active nav link on scroll
    updateActiveNav();

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// ===== ACTIVE NAV LINK =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const id = section.getAttribute('id');

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open');
    document.body.style.overflow = mobileNavOverlay.classList.contains('open') ? 'hidden' : '';
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ===== TYPED TEXT EFFECT =====
const texts = ['GAMING', 'CHAMPIONS', 'WARRIORS', 'LEGENDS', 'ESPORTS'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextEl = document.getElementById('typedText');

function typeEffect() {
    if (!typedTextEl) return;

    const currentText = texts[textIndex];

    if (!isDeleting) {
        typedTextEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
    } else {
        typedTextEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 120);
}

setTimeout(typeEffect, 3000); // Start after loader

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered delay for multiple reveals
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, idx * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// ===== STATS COUNTER =====
function initStatsCounter() {
    const statNums = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

// ===== GAME FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const gameCards = document.querySelectorAll('.gamescard');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        gameCards.forEach((card, i) => {
            const item = card.getAttribute('data-item');
            const shouldShow = filter === 'all' || item === filter;

            if (shouldShow) {
                card.classList.remove('hide');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, i * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                setTimeout(() => card.classList.add('hide'), 300);
            }
        });
    });
});

// Progress bar animation on card hover
gameCards.forEach(card => {
    const progressBar = card.querySelector('.progressline span');
    if (progressBar) {
        const targetWidth = progressBar.style.width || '80%';
        progressBar.style.width = '0';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressBar.style.transition = 'width 1.2s ease';
                        progressBar.style.width = targetWidth;
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    }
});

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        gameCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
            if (query === '' || title.includes(query)) {
                card.classList.remove('hide');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
            }
        });
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');

        // Loading state
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
            submitBtn.disabled = false;
            formSuccess.classList.add('show');
            contactForm.reset();

            setTimeout(() => formSuccess.classList.remove('show'), 4000);
        }, 1500);
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    });
});

// ===== PARALLAX EFFECT ON HOME =====
window.addEventListener('scroll', () => {
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        const scrolled = window.scrollY;
        heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
});

// ===== CARD 3D TILT EFFECT =====
function initTiltEffect() {
    document.querySelectorAll('.gamescard, .tourcard').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(600px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'all 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, border-color 0.4s, box-shadow 0.4s';
        });
    });
}

initTiltEffect();

// ===== GLITCH EFFECT ON LOGO =====
const logo = document.querySelector('.logo');
if (logo) {
    setInterval(() => {
        logo.style.textShadow = '2px 0 #ff0000, -2px 0 #00f5ff';
        setTimeout(() => {
            logo.style.textShadow = '';
        }, 100);
    }, 5000);
}

// ===== INIT REVEAL ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStatsCounter();
    // Trigger reveals for elements in view
    setTimeout(() => {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 2700);
});

console.log('%cGAMERZONE 🎮', 'font-size:2em;font-weight:bold;color:#00f5ff;text-shadow:0 0 10px #00f5ff;');
console.log('%cWelcome to the ultimate gaming hub!', 'color:#94a3b8;font-size:1em;');
