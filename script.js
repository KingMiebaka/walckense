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

// --- 2. Combined Site Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // --- A. CONFIGURATION ---
    const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTR8GPTNFAzyr-6KCNLCxCbRZ94FrUdeZt-zM82AZ_yzuOcMOXM4r0mDUk2RCNHhA7V8G-PLJAWFJF/pub?gid=0&single=true&output=csv";
    
    // YOUR LIVE DEPLOYMENT URL
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-EBomxvCbu7HkNBntuUTkIx8daI1vfYGllLyTN3zSMTr4jHsfTv0DSbZDTH4WiqhfZA/exec"; 

    // TRACKING FUNCTION: Sends click data to Google Sheets
    window.trackClick = async function(title) {
        try {
            // Using no-cors mode to send the "ping" to the script
            await fetch(`${APPS_SCRIPT_URL}?title=${encodeURIComponent(title)}`, { 
                mode: 'no-cors' 
            });
        } catch (e) {
            console.error("Tracking error:", e);
        }
    };

    // --- B. DYNAMIC ARTICLE LOADER ---
    async function fetchPublications() {
        const grid = document.getElementById('articleGrid');
        if (!grid) return; 

        try {
            const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Network response was not ok");
            
            const csvData = await response.text();
            const rows = csvData.split('\n').slice(1);
            
            const articles = rows.map(row => {
                const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return {
                    title: columns[0]?.replace(/"/g, ""),
                    date: columns[1]?.replace(/"/g, ""),
                    category: columns[2]?.replace(/"/g, ""),
                    excerpt: columns[3]?.replace(/"/g, ""),
                    link: columns[4]?.replace(/"/g, "").trim(),
                    views: parseInt(columns[5]) || 0 // Maps Column F (6th column)
                };
            }).filter(art => art.title && art.title.trim() !== "");

            if (articles.length === 0) {
                grid.innerHTML = "<p>No publications found in the sheet.</p>";
            } else {
                displayArticles(articles);
                setupSearchAndFilter(articles);
            }
        } catch (err) {
            console.error("Database Error:", err);
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>Error connecting to database.</p></div>`;
        }
    }

    function displayArticles(data) {
        const grid = document.getElementById('articleGrid');
        if (!grid) return;

        grid.innerHTML = data.map((art, index) => {
            const safeTitle = art.title.replace(/'/g, "\\'"); // Escapes quotes for JS
            return `
            <article class="article-card">
                <div class="article-content">
                    <div class="article-meta">
                        <span class="category">${art.category}</span>
                        <span class="date">${art.date}</span>
                    </div>
                    <h3>${art.title} ${index === 0 ? '<span class="new-badge">NEW</span>' : ''}</h3>
                    <p>${art.excerpt}</p>
                    
                    <a href="${art.link}" 
                       class="read-more" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       onclick="trackClick('${safeTitle}')">
                        View Report <i class="fas fa-file-pdf" style="margin-left: 8px; color: #c28a3e;"></i>
                    </a>
                </div>
            </article>
        `}).join('');
    }

    function setupSearchAndFilter(allArticles) {
        const searchInput = document.getElementById('articleSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = allArticles.filter(art => 
                    art.title.toLowerCase().includes(term) || 
                    art.category.toLowerCase().includes(term)
                );
                displayArticles(filtered);
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterType = btn.dataset.filter;
                let filtered = [...allArticles];

                if (filterType === 'recent') {
                    // Sort by Date (Descending)
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                } else if (filterType === 'most-read') {
                    // Sort by Views (Descending)
                    filtered.sort((a, b) => b.views - a.views);
                } else if (filterType !== 'all' && filterType) {
                    // Filter by Category
                    filtered = allArticles.filter(art => 
                        art.category.toLowerCase().includes(filterType.toLowerCase())
                    );
                }

                displayArticles(filtered);
            });
        });
    }

    fetchPublications();

    // --- C. NAVIGATION ACTIVE STATE ---
    const navLinks = document.querySelectorAll('.nav-item');
    const path = window.location.pathname;
    const isPubPage = path.includes('publications.html');

    if (isPubPage) {
        navLinks.forEach(link => {
            if (link.getAttribute('href').includes('publications.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else {
        const handleScroll = () => {
            let current = "";
            const sections = document.querySelectorAll('section, header#home');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (current && href.includes(current)) link.classList.add('active');
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // --- D. Navigation Drawer ---
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

    // --- E. Navbar Background on Scroll ---
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- F. Contact Form ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("submitBtn");
            btn.textContent = "Sending...";
            btn.disabled = true;

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
                alert("Error sending message.");
                btn.textContent = "Send Request";
                btn.disabled = false;
            }
        });
    }
});

function moveSlide(direction) {
    const slides = document.querySelectorAll('.project-slide');
    const active = document.querySelector('.project-slide.active');
    if (!active) return;
    let idx = Array.from(slides).indexOf(active);
    active.classList.remove('active');
    let nextIdx = (idx + direction + slides.length) % slides.length;
    slides[nextIdx].classList.add('active');
}