/**
 * Walckense Engineering - Technical Publications Hub
 * Manages article rendering with 0-base view counts
 */

const articles = [
    {
        id: 1,
        title: "Climate-Resilient Water Infrastructure for Emerging Economies",
        date: "May 10, 2026",
        publishTime: "09:45 AM",
        baseViews: 0, 
        category: "Sustainability",
        excerpt: "An in-depth look at hydraulic design resilience and sustainability principles from the PTDF 2500 m³/day project site.",
        url: "assets/docs/html/report-1-ptdf.html",
        isRecent: true,
        isPopular: true
    },
    {
        id: 2,
        title: "Why Digital Monitoring Matters in Produced Water Treatment",
        date: "May 11, 2026",
        publishTime: "10:30 AM",
        baseViews: 0, 
        category: "Innovation",
        excerpt: "Design Resilience, Material Selection, and Operational Intelligence from the PTDF 2500 m³/day Water Treatment Project.",
        url: "assets/docs/html/report-2-monitoring.html",
        isRecent: true,
        isPopular: false
    }
];

const articleGrid = document.getElementById('articleGrid');

function renderArticles(data) {
    if (!articleGrid) return;
    articleGrid.innerHTML = '';
    
    data.forEach(article => {
        const storageKey = `article_view_${article.id}`;
        const liveViews = localStorage.getItem(storageKey) || article.baseViews;

        const card = `
            <article class="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <span class="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                            ${article.category}
                        </span>
                        <div class="text-right">
                            <span class="block text-slate-400 text-[9px] font-bold uppercase tracking-widest">${article.date}</span>
                            <span class="text-slate-400 text-[11px] font-medium italic">
                                <i class="far fa-eye mr-1"></i> ${liveViews} Views
                            </span>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors leading-tight">
                        ${article.title}
                    </h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">
                        ${article.excerpt}
                    </p>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span class="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                        <i class="far fa-clock mr-1 text-amber-600"></i> Published ${article.publishTime}
                    </span>
                    <a href="${article.url}" class="inline-flex items-center text-sm font-bold text-slate-900 hover:text-amber-600 transition-all">
                        Read Analysis <i class="fas fa-chevron-right ml-2 text-[10px]"></i>
                    </a>
                </div>
            </article>
        `;
        articleGrid.innerHTML += card;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderArticles(articles);
    
    // Filter Listeners
    document.getElementById('filter-all')?.addEventListener('click', () => renderArticles(articles));
    document.getElementById('filter-recent')?.addEventListener('click', () => renderArticles(articles.filter(a => a.isRecent)));
    document.getElementById('filter-popular')?.addEventListener('click', () => renderArticles(articles.filter(a => a.isPopular)));
});