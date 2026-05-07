// --- 1. Hero Slider ---
let heroIdx = 0;
const heroSlides = document.querySelectorAll('.slide');
const heroDots = document.querySelectorAll('.dot');
let heroInterval;

function showHeroSlide(n) {
  heroSlides.forEach(s => s.classList.remove('active'));
  heroDots.forEach(d => d.classList.remove('active'));
  heroIdx = (n + heroSlides.length) % heroSlides.length;
  heroSlides[heroIdx].classList.add('active');
  heroDots[heroIdx].classList.add('active');
}

function startSlider() {
  heroInterval = setInterval(() => showHeroSlide(heroIdx + 1), 8000);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(heroInterval);
    showHeroSlide(index);
    startSlider();
  });
});
startSlider();

// --- 2. Combined Site Logic (Navbar, Drawer, Form, Scroll) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Navigation & Mobile Drawer
    const navToggle = document.getElementById('navToggle');
    const navDrawer = document.getElementById('navDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navDrawer.classList.add('open');
        });
    }
    if (closeDrawer) closeDrawer.addEventListener('click', () => navDrawer.classList.remove('open'));
    

    // B. Scroll Effects (Navbar Background & Active State)
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        // This handles the background color change on scroll
        header.classList.toggle('scrolled', window.scrollY > 50);

        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-item');
        
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // C. Form Submission Logic
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.style.display = "none";
                    formSuccess.style.display = "block";
                } else {
                    throw new Error("Submission failed");
                }
            } catch (error) {
                alert("Something went wrong. Please try again.");
                submitBtn.textContent = "Send Request";
                submitBtn.disabled = false;
            }
        });
    }
});

// D. Global Reset (Used by Success Message button)
window.resetForm = function() {
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const submitBtn = document.getElementById("submitBtn");

    formSuccess.style.display = "none";
    contactForm.style.display = "block";
    contactForm.reset();
    submitBtn.textContent = "Send Request";
    submitBtn.disabled = false;
};

// --- 3. Project Slider ---
function moveSlide(direction) {
    const slides = document.querySelectorAll('.project-slide');
    const active = document.querySelector('.project-slide.active');
    let idx = Array.from(slides).indexOf(active);
    active.classList.remove('active');
    let nextIdx = (idx + direction + slides.length) % slides.length;
    slides[nextIdx].classList.add('active');
}

