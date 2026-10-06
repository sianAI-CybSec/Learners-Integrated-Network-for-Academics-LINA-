/*
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.

    CYB 202
    INTROWEB - FINAL REQUIREMENT
*/
(() => {
    const STAR_EMPTY  = 'graphics/star_material.png';
    const STAR_FILLED = 'graphics/filled_rating_star.png';

    const modal     = document.getElementById('rating-modal');
    if (!modal) return;

    const closeBtn  = document.getElementById('rating-close');
    const submitBtn = document.getElementById('rating-submit');
    const starRow   = document.getElementById('star-row');
    const review    = document.getElementById('rating-review');
    const message   = document.getElementById('rating-message');
    const triggers  = document.querySelectorAll('.rate-trigger');

    const lessonKey  = new URLSearchParams(window.location.search).get('lesson') || 'unknown';
    const storageKey = `lina:rating:${lessonKey}`;

    let rating = 0;
    let lastFocused = null;

    new Image().src = STAR_FILLED;

    /*----- Build the 5 stars -----*/
    const stars = Array.from({ length: 5 }, (_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'star-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-label', `${i + 1} star${i ? 's' : ''}`);
        btn.innerHTML = `<img src="${STAR_EMPTY}" alt="" draggable="false">`;

        btn.addEventListener('mouseenter', () => paint(i + 1));   // hover preview
        btn.addEventListener('focus',      () => paint(i + 1));   // keyboard preview
        btn.addEventListener('click', () => {
            rating = i + 1;
            paint(rating);
            setMessage('');
        });

        starRow.appendChild(btn);
        return btn;
    });

    // Leaving the row (mouse or keyboard) goes back to the chosen rating
    starRow.addEventListener('mouseleave', () => paint(rating));
    starRow.addEventListener('focusout',   e => {
        if (!starRow.contains(e.relatedTarget)) paint(rating);
    });

    function paint(n) {
        stars.forEach((star, i) => {
            star.querySelector('img').src = i < n ? STAR_FILLED : STAR_EMPTY;
            star.setAttribute('aria-checked', String(i + 1 === rating));
        });
    }

    function setMessage(text, type = '') {
        message.textContent = text;
        message.className = 'rating-message' + (type ? ` ${type}` : '');
    }

    /*----- Storage helpers (try/catch: storage can be blocked) -----*/
    function loadSaved() {
        try { return JSON.parse(localStorage.getItem(storageKey)); }
        catch { return null; }
    }
    function save(entry) {
        try { localStorage.setItem(storageKey, JSON.stringify(entry)); return true; }
        catch { return false; }
    }

    /*----- Open / close -----*/
    function openModal(e) {
        if (e) e.preventDefault();               // footer link has href="#"
        lastFocused = document.activeElement;

        // Pre-fill with the user's previous rating for this lesson, if any
        const saved = loadSaved();
        rating = saved ? saved.rating : 0;
        review.value = saved ? saved.review : '';
        paint(rating);
        setMessage('');

        modal.hidden = false;
        document.body.classList.add('modal-open');
        closeBtn.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(t => t.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    /*----- Submit -----*/
    submitBtn.addEventListener('click', () => {
        if (rating === 0) {
            setMessage('Please select a star rating first.', 'error');
            return;
        }

        const entry = {
            lesson: lessonKey,
            rating,
            review: review.value.trim(),
            date: new Date().toISOString()
        };

        if (!save(entry)) {
            setMessage('Could not save your rating on this device.', 'error');
            return;
        }
        console.log('Rating saved:', entry);

        setMessage('Thanks for your feedback!', 'success');
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.disabled = false;
            closeModal();
        }, 900);
    });
})();