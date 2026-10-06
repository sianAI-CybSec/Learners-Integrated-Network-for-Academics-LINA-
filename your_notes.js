document.addEventListener('DOMContentLoaded', () => {
    const viewRoot = document.getElementById('view-root');
    const viewFolder = document.getElementById('view-folder');
    const viewEditor = document.getElementById('view-editor');
 
    const btnOpenFolder = document.getElementById('btn-open-folder');
    const btnBackToRoot = document.getElementById('btn-back-to-root');
    const btnCloseEditor = document.getElementById('btn-close-editor');
    const noteButtons = document.querySelectorAll('.btn-open-note');
 
    const noteTextarea = document.getElementById('notes-editor');
    const charCount = document.getElementById('notes-character-count');
    const saveButton = document.getElementById('save-notes');
    const message = document.getElementById('notes-message');
    const LOCAL_STORAGE_KEY = 'lina_saved_note_progsdats';
 
    // Remembers which view the editor was opened from
    let previousView = viewRoot;
 
    function showView(viewToShow) {
        viewRoot.hidden = true;
        viewFolder.hidden = true;
        viewEditor.hidden = true;
        viewToShow.hidden = false;
    }
 
    function updateCharCount() {
        charCount.textContent = `${noteTextarea.value.length} / ${noteTextarea.maxLength}`;
    }
 
    function loadNoteData() {
        const savedNote = localStorage.getItem(LOCAL_STORAGE_KEY);
        noteTextarea.value = savedNote !== null ? savedNote : '';
        updateCharCount();
        message.textContent = '';
        message.classList.remove('success');
    }
 
    // Navigation
    if (btnOpenFolder) {
        btnOpenFolder.addEventListener('click', () => showView(viewFolder));
    }
 
    if (btnBackToRoot) {
        btnBackToRoot.addEventListener('click', () => showView(viewRoot));
    }
 
    // Exit button: close the editor and return to where the user came from
    if (btnCloseEditor) {
        btnCloseEditor.addEventListener('click', () => {
            showView(previousView);
        });
    }
 
    // Open a note in the editor
    noteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            previousView = viewFolder.hidden ? viewRoot : viewFolder;
            loadNoteData();
            showView(viewEditor);
            noteTextarea.focus();
        });
    });
 
    // Editor auto-save + character count
    noteTextarea.addEventListener('input', () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, noteTextarea.value);
        updateCharCount();
    });
 
    // Manual save button
    saveButton.addEventListener('click', () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, noteTextarea.value);
        message.textContent = 'Notes saved.';
        message.classList.add('success');
    });
 
    // Initialize
    showView(viewRoot);
});
