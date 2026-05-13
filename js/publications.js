/**
 * Walckense Engineering - Technical Publications Hub
 * FEATURE: Instant Load + Verified View Reveal
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJIwgpElrEDUBxSH4gXxbop_0VlUcvp1vCgEKb9uncOj3kGPGTR59ypgb3p_7TCgzb/exec";

const articles = [
    {
        id: 1,
        title: "Climate-Resilient Water Infrastructure for Emerging Economies",
        date: "2026-05-10",
        displayDate: "May 10, 2026",
        publishTime: "09:45 AM",
        category: "Sustainability",
        excerpt: "An in-depth look at hydraulic design resilience and sustainability principles from the PTDF 2500 m³/day project site.",
        url: "assets/docs/html/report-1-ptdf.html",
        cloudKey: "report_01"
    },
    {
        id: 2,
        title: "Why Digital Monitoring Matters in Produced Water Treatment",
        date: "2026-05-11",
        displayDate: "May 11, 2026",
        publishTime: "02:30 PM",
        category: "Innovation",
        excerpt: "Design Resilience, Material Selection, and Operational Intelligence from the PTDF 2500 m³/day Water Treatment Project.",
        url: "assets/docs/html/report-2-monitoring.html",
        cloudKey: "report_02"
    }
];

const articleGrid = document.getElementById('articleGrid');

// 1. Instant Rendering (Views start at 0 or cached value)
function renderArticles(data) {
    if (!articleGrid) return;
    articleGrid.innerHTML = '';

    data.forEach(article => {
        // Get cached views or default to 0 so it never looks empty
        const initialViews = localStorage.getItem(`v_${article.cloudKey}`) || "0";

        articleGrid.innerHTML += `
            <div class="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-2xl transition-all flex flex-col h-full">
                <div class="flex justify-between items-start mb-6">
                    <span class="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-100">
                        ${article.category}
                    </span>
                    
                    <span id="container-${article.cloudKey}" class="text-slate-400 text-[10px] font-medium flex items-center">
                        <i class="far fa-eye mr-1"></i> <span id="num-${article.cloudKey}">${initialViews}</span> Views
                    </span>
                </div>
                <h3 class="text-xl leading-tight mb-4 font-bold text-slate-900">${article.title}</h3>
                <p class="text-slate-500 text-sm mb-8 grow leading-relaxed">${article.excerpt}</p>
                <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div class="flex flex-col gap-0.5">
                        <div class="text-[10px] font-bold text-slate-900 uppercase tracking-tight">${article.displayDate}</div>
                        <div class="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                            <i class="far fa-clock mr-1"></i>Published at ${article.publishTime}
                        </div>
                    </div>
                    <a href="${article.url}" 
                       data-key="${article.cloudKey}"
                       class="read-trigger text-[11px] font-extrabold uppercase tracking-widest text-slate-900 hover:text-amber-600 flex items-center gap-2 transition-colors">
                        Read Analysis <i class="fas fa-arrow-right text-[9px]"></i>
                    </a>
                </div>
            </div>
        `;
    });
}

// 2. Verified Background Fetch (Updates the view count from Google Script)
async function updateViewCounts() {
    articles.forEach(async (article) => {
        try {
            const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=get&key=${article.cloudKey}`, {
                method: 'GET',
                redirect: 'follow'
            });
            const data = await res.json();
            
            const countSpan = document.getElementById(`num-${article.cloudKey}`);
            if (countSpan) {
                const liveValue = data.value || 0;
                countSpan.innerText = liveValue;
                localStorage.setItem(`v_${article.cloudKey}`, liveValue);
            }
        } catch (e) {
            console.warn("View verification pending for " + article.cloudKey);
        }
    });
}

// 3. Sorting & Filtering
function setActiveFilter(activeId) {
    ['filter-all', 'filter-recent', 'filter-popular'].forEach(id => {
        document.getElementById(id)?.classList.remove('filter-active');
    });
    document.getElementById(activeId)?.classList.add('filter-active');
}

document.addEventListener('DOMContentLoaded', () => {
    renderArticles(articles); 
    updateViewCounts();       

    document.getElementById('filter-all')?.addEventListener('click', () => {
        setActiveFilter('filter-all');
        renderArticles(articles);
        updateViewCounts(); 
    });

    document.getElementById('filter-recent')?.addEventListener('click', () => {
        setActiveFilter('filter-recent');
        const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
        renderArticles(sorted);
        updateViewCounts();
    });

    document.getElementById('filter-popular')?.addEventListener('click', () => {
        setActiveFilter('filter-popular');
        const sorted = [...articles].sort((a, b) => {
            const vA = parseInt(localStorage.getItem(`v_${a.cloudKey}`) || 0);
            const vB = parseInt(localStorage.getItem(`v_${b.cloudKey}`) || 0);
            return vB - vA;
        });
        renderArticles(sorted);
        updateViewCounts();
    });
});