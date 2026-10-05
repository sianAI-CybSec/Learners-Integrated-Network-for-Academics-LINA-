(() => {
    'use strict';
 
    const STORAGE_KEY = 'lina_saved_materials';
 
    const BOOKMARK_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>' +
        '</svg>';
 
    let toast = document.querySelector('.df-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'df-toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }
 
    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
    }

    function loadSavedIds() {
        const val = localStorage.getItem(STORAGE_KEY);
        if (!val) return [];
        return val.split(',').map(item => item.trim()).filter(item => item && item !== '[]');
    }

    function storeSavedIds(ids) {
        localStorage.setItem(STORAGE_KEY, ids.join(','));
    }
 
    function setButtonState(btn, title, isSaved) {
        btn.classList.toggle('saved', isSaved);
        btn.setAttribute('aria-pressed', String(isSaved));
        btn.setAttribute(
            'aria-label',
            isSaved ? 'Remove "' + title + '" from saved materials'
                    : 'Save "' + title + '" to saved materials'
        );
    }
 
    document.querySelectorAll('.book-card, .video-card').forEach((card) => {
        if (card.parentElement.classList.contains('card-wrap')) return;

        const type  = card.classList.contains('book-card') ? 'book' : 'video';
        const titleEl = card.querySelector('.book-title, .video-title, h4');
        if (!titleEl) return;

        const title = titleEl.textContent.trim();
        const id    = type + ':' + title;

        const wrap = document.createElement('div');
        wrap.className = 'card-wrap';
        card.parentNode.insertBefore(wrap, card);
        wrap.appendChild(card);
 
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'save-btn';
        btn.innerHTML = BOOKMARK_SVG;
        wrap.appendChild(btn);
 
        setButtonState(btn, title, loadSavedIds().includes(id));
 
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let list = loadSavedIds();
            const isAlreadySaved = list.includes(id);
 
            if (isAlreadySaved) {
                list = list.filter((item) => item !== id);
                showToast('Removed from Saved Materials');
            } else {
                list.push(id);
                showToast('Added to Saved Materials');
            }

            storeSavedIds(list);
            setButtonState(btn, title, !isAlreadySaved);
        });
    });
})();