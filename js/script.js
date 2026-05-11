/**
 * WALCKENSE ENGINEERING SERVICES - Master Script
 * Version: 4.3 (Restored Active Links & Fixed Paths)
 */

// --- 1. HERO SLIDER ---
let heroIdx = 0;
const heroSlides = document.querySelectorAll('.slide');
const heroDots = document.querySelectorAll('.dot');
let heroInterval;

function showHeroSlide(n) {
    if (!heroSlides || !heroSlides.length) return;
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    heroIdx = (n + heroSlides.length) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
    heroDots[heroIdx].classList.add('active');
}

function startSlider() {
    if (!heroSlides || !heroSlides.length) return;
    heroInterval = setInterval(() => showHeroSlide(heroIdx + 1), 8000);
}

if (heroDots.length > 0) {
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(heroInterval);
            showHeroSlide(index);
            startSlider();
        });
    });
    startSlider();
}

// --- 2. MAIN SITE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. LOGO & ICON PATH FIXER ---
    const siteLogo = document.getElementById('siteLogo');
    const path = window.location.pathname;
    const isDeep = path.includes('publications/') || path.includes('reports/');

    if (siteLogo && isDeep) {
        siteLogo.src = '../images/logo.jpeg'; 
    }

    // --- B. NAVBAR ACTIVE STATE & SCROLL TRACKING ---
    const navLinks = document.querySelectorAll('.nav-item');
    const isPubPage = path.includes('publications.html');

    function updateNavbar() {
        if (isPubPage) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes('publications.html')) {
                    link.classList.add('active');
                }
            });
        } else {
            let current = "";
            const sections = document.querySelectorAll('section, header#home');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    const id = section.getAttribute('id');
                    if (id) current = id;
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (current && href.includes(current)) link.classList.add('active');
            });
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- C. DRAWER & FORM ---
    const navToggle = document.getElementById('navToggle');
    const navDrawer = document.getElementById('navDrawer');
    if (navToggle) {
        navToggle.addEventListener('click', () => navDrawer.classList.add('open'));
    }
    document.getElementById('closeDrawer')?.addEventListener('click', () => {
        navDrawer.classList.remove('open');
    });

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("submitBtn");
            btn.textContent = "Sending...";
            try {
                const res = await fetch(contactForm.action, { 
                    method: "POST", 
                    body: new FormData(contactForm), 
                    headers: { 'Accept': 'application/json' } 
                });
                if (res.ok) {
                    contactForm.style.display = "none";
                    document.getElementById("formSuccess").style.display = "block";
                }
            } catch (err) {
                btn.textContent = "Send Request";
            }
        });
    }
});

// --- 3. PROJECT SLIDER NAVIGATION ---
function moveSlide(direction) {
    const slides = document.querySelectorAll('.project-slide');
    const active = document.querySelector('.project-slide.active');
    if (!active || !slides.length) return;
    let idx = Array.from(slides).indexOf(active);
    active.classList.remove('active');
    let nextIdx = (idx + direction + slides.length) % slides.length;
    slides[nextIdx].classList.add('active');
}