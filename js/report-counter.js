/**
 * WALCKENSE ENGINEERING - Individual Report Analytics
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJIwgpElrEDUBxSH4gXxbop_0VlUcvp1vCgEKb9uncOj3kGPGTR59ypgb3p_7TCgzb/exec";

async function trackAndRevealViews() {
    const path = window.location.pathname;
    let articleId = null;

    if (path.includes('report-1-ptdf')) articleId = "report_01";
    if (path.includes('report-2-monitoring')) articleId = "report_02";

    const display = document.getElementById('view-count');
    
    if (articleId) {
        // 1. Send the view 'hit' to Google in the background
        fetch(`${GOOGLE_SCRIPT_URL}?action=hit&key=${articleId}`, { mode: 'no-cors' });

        try {
            // 2. Fetch the actual verified number
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get&key=${articleId}`, {
                method: 'GET',
                redirect: 'follow'
            });
            const data = await response.json();
            
            if (display) {
                // Update text first
                display.innerText = `${data.value || 0} Views`;
                // Make the whole phrase visible only after verification
                display.classList.remove('opacity-0');
                localStorage.setItem(`v_${articleId}`, data.value || 0);
            }
        } catch (e) {
            console.error("Verification failed. Keeping counter hidden.");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial hidden state for the counter
    const viewDisplay = document.getElementById('view-count');
    if (viewDisplay) {
        viewDisplay.classList.add('opacity-0', 'transition-opacity', 'duration-700');
    }
    
    trackAndRevealViews();

    // Progress bar scroll logic
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const bar = document.getElementById("progress-bar");
        if (bar) bar.style.width = scrolled + "%";
    });
});