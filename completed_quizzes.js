
function openReview() {
    const dashboardView = document.getElementById('quiz-dashboard-view');
    const reviewView = document.getElementById('quiz-review-view');
    
    if(dashboardView && reviewView) {
        dashboardView.classList.add('hidden');
        reviewView.classList.remove('hidden');
        
       
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function closeReview() {
    const dashboardView = document.getElementById('quiz-dashboard-view');
    const reviewView = document.getElementById('quiz-review-view');
    
    if(dashboardView && reviewView) {
        reviewView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        
       
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}