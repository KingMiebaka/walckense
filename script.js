// --- 1. Hero Slider ---
let heroIdx = 0;
const heroSlides = document.querySelectorAll('.slide');
const heroDots = document.querySelectorAll('.dot');
let heroInterval;

function showHeroSlide(n) {
    if (!heroSlides.length) return;
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    heroIdx = (n + heroSlides.length) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
    heroDots[heroIdx].classList.add('active');
}

function startSlider() {
    if (!heroSlides.length) return;
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

// --- 2. Combined Site Logic (Navbar, Drawer, Form, Scroll, Publications) ---
document.addEventListener('DOMContentLoaded', () => {

    // --- A. ARTICLE DATABASE: ADD YOUR NEW ARTICLES HERE EVERY DAY ---
    const articlesData = [
        {
            title: "Optimizing Decentralized Wastewater Systems",
            date: "MAY 2026",
            category: "WASH INFRASTRUCTURE",
            excerpt: "An analysis of modular STP performance under variable hydraulic loading in African metropolitan areas.",
            link: "#", 
            type: "recent", // Options: "recent", "most-read", "case-study"
            isNew: true     // Adds a "NEW" badge automatically
        },
        {
            title: "Climate-Resilient Utility Systems: A 5-Year Outlook",
            date: "APRIL 2026",
            category: "CLIMATE RESILIENCE",
            excerpt: "Strategies for future-proofing mechanical assets against extreme weather and resource scarcity.",
            link: "#",
            type: "most-read",
            isNew: false
        },
        {
            title: "Predictive Maintenance in Fluid Management",
            date: "MARCH 2026",
            category: "HYDROINFORMATICS",
            excerpt: "How AI-assisted modeling reduced operational downtime in industrial pump stations by 30%.",
            link: "#",
            type: "recent",
            isNew: false
        }
    ];

    // --- B. Publication Rendering Logic ---
    const articleGrid = document.getElementById('articleGrid');

// Function to render articles to the page
    function renderArticles(data) {
        if (!articleGrid) return;
        
        // UPDATE THE LINE BELOW:
        articleGrid.innerHTML = data.map((article, index) => `
            <article class="article-card" data-type="${article.type}">
                <div class="article-meta">
                    <span class="date">${article.date}</span>
                    <span class="category">${article.category}</span>
                </div>
                <h3>
                    ${article.title} 
                    ${index === 0 ? '<span class="new-badge">NEW</span>' : ''} 
                </h3>
                <p>${article.excerpt}</p>
                <div class="card-footer">
                    <span class="type-tag">${article.type.replace('-', ' ')}</span>
                    <a href="${article.link}" class="read-more">Read Full Article <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `).join('');
    }

    // Initialize Articles
    renderArticles(articlesData);

    // --- C. Search & Filter Logic ---
    const searchInput = document.getElementById('articleSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = articlesData.filter(art => 
                art.title.toLowerCase().includes(term) || 
                art.category.toLowerCase().includes(term)
            );
            renderArticles(filtered);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'all' ? articlesData : articlesData.filter(art => art.type === filter);
            renderArticles(filtered);
        });
    });

    // --- D. Navigation & Mobile Drawer ---
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

    // --- E. Scroll Effects (Navbar Background & Active State) ---
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);

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

    // --- F. Form Submission Logic ---
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

// --- 3. Global Functions (Reset & Sliders) ---
window.resetForm = function() {
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const submitBtn = document.getElementById("submitBtn");

    if (formSuccess) formSuccess.style.display = "none";
    if (contactForm) {
        contactForm.style.display = "block";
        contactForm.reset();
    }
    if (submitBtn) {
        submitBtn.textContent = "Send Request";
        submitBtn.disabled = false;
    }
};

function moveSlide(direction) {
    const slides = document.querySelectorAll('.project-slide');
    const active = document.querySelector('.project-slide.active');
    if (!active) return;
    let idx = Array.from(slides).indexOf(active);
    active.classList.remove('active');
    let nextIdx = (idx + direction + slides.length) % slides.length;
    slides[nextIdx].classList.add('active');
}