window.triggerPageTransition = function(targetUrl) {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.innerHTML = `
        <div class="transition-content">
            <img src="graphics/lina_logo.png" alt="LINA Logo" class="transition-logo">
            <h1 class="transition-title">LINA</h1>
            <p class="transition-motto">Towards Better Learning</p>
        </div>
    `;
    document.body.appendChild(overlay);

    // Trigger the CSS fade
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });
    });

    // Wait for the animation to finish, then redirect
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 1200);
};

// 2. Only intercept standard <a> links to home.html, NOT the form submission buttons
document.addEventListener('DOMContentLoaded', () => {
    const transitionLinks = document.querySelectorAll('a[href="home.html"]');

    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.triggerPageTransition('home.html');
        });
    });
});