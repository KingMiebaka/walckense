/**
 * Global Report Counter
 * Detects article ID from URL and updates localStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    let articleId = null;

    // Detect ID based on the filename in the URL
    if (path.includes('report-1')) articleId = "1";
    if (path.includes('report-2')) articleId = "2";

    if (articleId) {
        const storageKey = `article_view_${articleId}`;
        const baseViewsMap = { "1": 124, "2": 89 };
        
        let currentViews = localStorage.getItem(storageKey);
        
        if (!currentViews) {
            currentViews = baseViewsMap[articleId];
        } else {
            currentViews = parseInt(currentViews) + 1;
        }

        // Save back to browser memory
        localStorage.setItem(storageKey, currentViews);
        
        // Update the UI display if the element exists
        const viewDisplay = document.getElementById('view-count');
        if (viewDisplay) viewDisplay.innerText = currentViews;
    }

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) progressBar.style.width = scrolled + "%";
    });
});