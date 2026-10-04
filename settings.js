/*
    LINA - Settings & Dark Mode JavaScript
    Handles local storage retrieval and toggle logic.
*/

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Set toggle switch state based on localStorage
    if (darkModeToggle) {
        darkModeToggle.checked = (localStorage.getItem('linaDarkMode') === 'enabled');

        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('linaDarkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('linaDarkMode', 'disabled');
            }
        });
    }
});


/* 
   NOTE FOR GLOBAL INTEGRATION: 
   To make dark mode persist across all LINA pages (Home, Quizzes, etc.), 
   copy lines 10-15 of this script into your global `main.js` file inside 
   its `DOMContentLoaded` block. 
*/