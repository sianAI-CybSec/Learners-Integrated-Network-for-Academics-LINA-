/*
    LINA - NOTES FEATURE (lesson page)
    Pure JavaScript + localStorage. No backend.

    Storage keys:
      lina:notes               -> array of saved notes
      lina:notes:draft:<lesson> -> unfinished draft for one lesson
*/
(() => {
    'use strict';

    const NOTES_STORAGE_KEY = 'lina:notes';
    const DRAFT_KEY_PREFIX = 'lina:notes:draft:';
    const MAX_LENGTH = 5000;
    const DESKTOP_QUERY = window.matchMedia('(min-width: 1024px)');

    /*----- Elements -----*/
    const panel         = document.getElementById('notes-panel');
    if (!panel) return;

    const heading       = document.getElementById('notes-heading');
    const closeBtn      = document.getElementById('notes-close');
    const lessonTitleEl = document.getElementById('notes-lesson-title');
    const pageLabelEl   = document.getElementById('notes-page-label');
    const editor        = document.getElementById('notes-editor');
    const counter       = document.getElementById('notes-character-count');
    const saveBtn       = document.getElementById('save-notes');
    const messageEl     = document.getElementById('notes-message');
    const backdrop      = document.getElementById('notes-backdrop');
    const reopenBtn     = document.getElementById('notes-reopen');
    // every element marked data-notes-trigger (footer Take Notes + the toolbar Note button)
    const noteTriggers  = document.querySelectorAll('[data-notes-trigger]');
    const discardDialog = document.getElementById('notes-discard-dialog');
    const discardCancel = document.getElementById('notes-discard-cancel');
    const discardOk     = document.getElementById('notes-discard-confirm');

    /*----- State -----*/
    let editingNote = null;      // the note being edited, or null for a new note
    let baselineContent = '';    // text the editor is compared with to detect unsaved changes
    let messageTimer = null;
    let lastFocused = null;

    /*==================================
      Lesson info (never hard-coded)
    ===================================*/
    function getLessonKey() {
        return new URLSearchParams(window.location.search).get('lesson');
    }

    // lesson_material.js writes the title from its LESSONS object into this element
    function getLessonTitle() {
        const titleEl = document.querySelector('.lesson-material-title-open');
        const text = titleEl ? titleEl.textContent.trim() : '';
        return text || getLessonKey() || 'Untitled lesson';
    }

    // Page the learner is looking at (read from the existing PDF page counter)
    function getCurrentPage() {
        const pageEl = document.getElementById('page-num');
        const page = pageEl ? parseInt(pageEl.textContent, 10) : NaN;
        return Number.isInteger(page) && page > 0 ? page : 1;
    }

    /*==================================
      Storage helpers (try/catch: storage can be blocked)
    ===================================*/
    function getNotes() {
        try {
            const list = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY));
            return Array.isArray(list) ? list : [];
        } catch {
            return [];
        }
    }

    function writeNotes(list) {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(list));
            return true;
        } catch {
            return false;
        }
    }

    function createId() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // Create a brand-new note (never overwrites older ones)
    function saveNotes(content) {
        const now = new Date().toISOString();
        const note = {
            id: createId(),
            lesson: getLessonKey(),
            lessonTitle: getLessonTitle(),
            page: getCurrentPage(),
            content,
            createdAt: now,
            updatedAt: now
        };
        const list = getNotes();
        list.push(note);
        return writeNotes(list);
    }

    // Update an existing note: keeps id + createdAt, changes content + updatedAt
    function updateNotes(id, content) {
        const list = getNotes();
        const index = list.findIndex(note => note.id === id);
        if (index === -1) return saveNotes(content);   // note was deleted elsewhere
        list[index] = { ...list[index], content, updatedAt: new Date().toISOString() };
        return writeNotes(list);
    }

    /*----- Drafts -----*/
    const draftKey = () => DRAFT_KEY_PREFIX + getLessonKey();

    function loadDraft() {
        try { return localStorage.getItem(draftKey()) || ''; }
        catch { return ''; }
    }
    function saveDraft(text) {
        try { localStorage.setItem(draftKey(), text); }
        catch { /* drafts are optional, ignore */ }
    }
    function removeDraft() {
        try { localStorage.removeItem(draftKey()); }
        catch { /* ignore */ }
    }

    /*==================================
      UI helpers
    ===================================*/
    function showMessage(text, type = '') {
        clearTimeout(messageTimer);
        messageEl.textContent = text;
        messageEl.className = 'notes-message' + (type ? ` ${type}` : '');
        if (text) {
            messageTimer = setTimeout(() => showMessage(''), 3000);
        }
    }

    function updateCounter() {
        counter.textContent = `${editor.value.length} / ${MAX_LENGTH}`;
    }

    function isDirty() {
        return editor.value.trim() !== baselineContent.trim();
    }

    function isOpen() {
        return panel.classList.contains('is-open');
    }

    // Title, page label, heading and button text depend on new vs. edit mode
    function refreshContext() {
        lessonTitleEl.textContent = editingNote ? editingNote.lessonTitle : getLessonTitle();
        const page = editingNote && editingNote.page ? editingNote.page : getCurrentPage();
        pageLabelEl.textContent = `Page ${page}`;
        heading.textContent = editingNote ? 'Edit Notes' : 'New Notes';
        saveBtn.textContent = editingNote ? 'Update Notes' : 'Save Notes';
    }

    // Keeps the sheet above the bottom nav, and above the on-screen keyboard
    function updateLayoutOffsets() {
        const root = document.documentElement;
        const nav = document.querySelector('.home-nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        let bottom = navHeight;
        let height = null;

        const viewport = window.visualViewport;
        if (viewport && !DESKTOP_QUERY.matches) {
            const keyboardInset = window.innerHeight - viewport.height - viewport.offsetTop;
            if (keyboardInset > 120) {          // keyboard is open
                bottom = keyboardInset;
                height = Math.round(viewport.height * 0.85);
            }
        }

        root.style.setProperty('--notes-nav-height', `${navHeight}px`);
        root.style.setProperty('--notes-bottom', `${bottom}px`);
        if (height) root.style.setProperty('--notes-height', `${height}px`);
        else root.style.removeProperty('--notes-height');
    }

    /*==================================
      Open / close
    ===================================*/
    function openNotes({ focus = true } = {}) {
        lastFocused = document.activeElement;
        updateLayoutOffsets();
        refreshContext();
        panel.classList.add('is-open');
        backdrop.classList.toggle('is-open', !DESKTOP_QUERY.matches);
        reopenBtn.hidden = true;
        noteTriggers.forEach(t => t.setAttribute('aria-expanded', 'true'));
        if (focus) editor.focus({ preventScroll: true });
    }

    function closeNotes() {
        panel.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        reopenBtn.hidden = !DESKTOP_QUERY.matches;
        noteTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        if (!DESKTOP_QUERY.matches && lastFocused && lastFocused.focus) lastFocused.focus();
    }

    // Closing asks first if there is unsaved text
    function requestClose() {
        if (isDirty()) discardDialog.showModal();
        else closeNotes();
    }

    function discardChanges() {
        if (editingNote) {
            leaveEditMode();
        } else {
            editor.value = '';
            baselineContent = '';
            removeDraft();
        }
        updateCounter();
        showMessage('');
    }

    /*==================================
      Edit mode (from "Your Notes" -> Edit)
    ===================================*/
    function enterEditMode(note) {
        editingNote = note;
        baselineContent = note.content;
        editor.value = note.content;
        updateCounter();
        refreshContext();
    }

    function leaveEditMode() {
        editingNote = null;
        baselineContent = '';
        editor.value = '';
        // drop ?note=... from the address bar without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete('note');
        history.replaceState(null, '', url);
        refreshContext();
    }

    /*==================================
      Save button
    ===================================*/
    function handleSave() {
        const content = editor.value.trim();

        if (!content) {
            showMessage('Please write something before saving.', 'error');
            editor.focus();
            return;
        }
        if (!getLessonKey()) {
            showMessage('Open a lesson to take notes.', 'error');
            return;
        }

        const wasEditing = Boolean(editingNote);
        const saved = wasEditing ? updateNotes(editingNote.id, content) : saveNotes(content);

        if (!saved) {
            showMessage('Unable to save notes on this device.', 'error');
            return;
        }

        // Reset the editor so the next note starts fresh
        removeDraft();
        if (wasEditing) leaveEditMode();
        editor.value = '';
        baselineContent = '';
        updateCounter();
        showMessage(wasEditing ? '✓ Notes updated!' : '✓ Notes saved!', 'success');

        // On mobile/tablet, tuck the sheet away after a moment
        if (!DESKTOP_QUERY.matches) {
            setTimeout(() => { if (isOpen() && !isDirty()) closeNotes(); }, 900);
        }
    }

    /*==================================
      Events
    ===================================*/
    function setupEvents() {
        editor.addEventListener('input', () => {
            updateCounter();
            if (editingNote) return;                 // drafts are only for new notes
            if (editor.value.trim()) saveDraft(editor.value);
            else removeDraft();
        });

        saveBtn.addEventListener('click', handleSave);
        closeBtn.addEventListener('click', requestClose);
        backdrop.addEventListener('click', requestClose);
        reopenBtn.addEventListener('click', () => openNotes());

        noteTriggers.forEach(trigger => {
            trigger.addEventListener('click', event => {
                event.preventDefault();
                if (!isOpen()) openNotes();
                else if (DESKTOP_QUERY.matches) editor.focus();   // desktop: panel is already visible
                else requestClose();                              // mobile: tap again to close
            });
        });

        discardCancel.addEventListener('click', () => discardDialog.close());
        discardOk.addEventListener('click', () => {
            discardDialog.close();
            discardChanges();
            closeNotes();
        });

        // Escape closes notes, unless a rating/save/discard dialog is on top
        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape' || !isOpen()) return;
            if (discardDialog.open || document.querySelector('.modal-overlay:not([hidden]), .la-overlay:not([hidden])')) return;
            requestClose();
        });

        // Switching between desktop and mobile layouts
        DESKTOP_QUERY.addEventListener('change', () => {
            updateLayoutOffsets();
            if (DESKTOP_QUERY.matches) openNotes({ focus: false });
            else closeNotes();
        });

        window.addEventListener('resize', updateLayoutOffsets);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateLayoutOffsets);
        }
    }

    /*==================================
      Init
    ===================================*/
    function init() {
        editor.maxLength = MAX_LENGTH;
        setupEvents();
        updateLayoutOffsets();

        const lessonKey = getLessonKey();
        if (!lessonKey) {
            editor.disabled = true;
            saveBtn.disabled = true;
            showMessage('Open a lesson to take notes.', 'error');
        }

        // ?note=<id> means "Edit" was chosen on the Your Notes page
        const noteId = new URLSearchParams(window.location.search).get('note');
        const noteToEdit = noteId ? getNotes().find(n => n.id === noteId && n.lesson === lessonKey) : null;

        if (noteToEdit) {
            enterEditMode(noteToEdit);
            openNotes();
            return;
        }

        // Restore an unfinished draft for this lesson
        const draft = lessonKey ? loadDraft() : '';
        if (draft) editor.value = draft;
        updateCounter();
        refreshContext();

        if (DESKTOP_QUERY.matches) openNotes({ focus: false });
        else reopenBtn.hidden = true;
    }

    init();
})();