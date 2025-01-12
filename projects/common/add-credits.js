// Add credits to body if it doesn't exist
function addCredits() {
    if (!document.querySelector('.credits')) {
        const credits = document.createElement('div');
        credits.className = 'credits';
        credits.innerHTML = '<p>Designed & Developed by Shayak Siraj</p>';
        
        // Try to find footer or add before body end
        const footer = document.querySelector('footer') || document.querySelector('.footer');
        if (footer) {
            footer.appendChild(credits);
        } else {
            document.body.appendChild(credits);
        }
    }
}

// Add credits CSS
function addCreditsStyle() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../common/credits.css';
    document.head.appendChild(link);
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addCreditsStyle();
    addCredits();
});
