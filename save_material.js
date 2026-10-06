/*
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.

    CYB 202
    INTROWEB - FINAL REQUIREMENT
*/
(() => {
    const modal = document.getElementById('save-material-modal');
    if (!modal) return;

    const closeBtn  = document.getElementById('save-close');
    const submitBtn = document.getElementById('save-submit');
    const title     = document.getElementById('save-material-title');
    const message   = document.getElementById('save-message');
    const triggers  = document.querySelectorAll('.save-trigger');

    const lessonKey   = new URLSearchParams(window.location.search).get('lesson');
    const STORAGE_KEY = 'lina:saved-materials';
    let lastFocused = null;

    function getSaved() {
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(list) ? list : [];
        } catch { return []; }
    }
    function setSaved(list) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
        catch { return false; }
    }
    const isSaved = () => getSaved().some(m => m.lesson === lessonKey);

    function setMessage(text, type = '') {
        message.textContent = text;
        message.className = 'rating-message' + (type ? ` ${type}` : '');
    }

    function refreshUI() {
        const saved = isSaved();
        title.textContent = saved ? 'Remove from saved?' : 'Save Material?';
        submitBtn.textContent = saved ? 'Remove' : 'Save';
    }

    function openModal(e) {
        if (e) e.preventDefault();               
        lastFocused = document.activeElement;
        setMessage('');
        refreshUI();
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

    submitBtn.addEventListener('click', () => {
        if (!lessonKey) {
            setMessage('No lesson selected.', 'error');
            return;
        }

        let list = getSaved();
        const wasSaved = list.some(m => m.lesson === lessonKey);

        if (wasSaved) {
            list = list.filter(m => m.lesson !== lessonKey);
        } else {
            const titleEl = document.querySelector('.lesson-material-title-open');
            list.push({
                lesson: lessonKey,
                title: titleEl ? titleEl.textContent : lessonKey,
                date: new Date().toISOString()
            });
        }

        if (!setSaved(list)) {
            setMessage('Could not save on this device.', 'error');
            return;
        }

        setMessage(wasSaved ? 'Removed from saved materials.' : 'You Saved this Material!\nYou may view them in your Saved Materials.', 'success');
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.disabled = false;
            closeModal();
        }, 900);
    });
})();