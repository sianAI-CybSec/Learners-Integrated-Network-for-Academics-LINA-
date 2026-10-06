/*
    <!--
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.
 
    CYB 202
    INTROWEB - FINAL REQUIREMENT - SAVE / RATE / NOTE FOR LESSON PAGE
    -->
*/
 
var SAVED_KEY = 'lina_saved_materials'; 
 
var lessonKey = new URLSearchParams(window.location.search).get('lesson');
 
var saveConfirmModal = document.getElementById('save-confirm-modal');
var rateModal  = document.getElementById('rate-modal');
var msgModal   = document.getElementById('msg-modal');
var notesPanel = document.getElementById('notes-panel');
 
var stars     = document.querySelectorAll('.la-star');
var reviewBox = document.getElementById('rate-review');
var rateError = document.getElementById('rate-error');
var notesText = document.getElementById('notes-text');
var currentRating = 0;
 
function getSavedList() {
    var val = localStorage.getItem(SAVED_KEY);
    if (!val) return [];
    return val.split(',').map(function (item) { return item.trim(); })
              .filter(function (item) { return item && item !== '[]'; });
}
 
function showMessage(title, text) {
    document.getElementById('msg-title').textContent = title;
    document.getElementById('msg-text').textContent = text;
    msgModal.hidden = false;
}
 
// SAVE 
function startSave() {
    if (!lessonKey) {
        showMessage('Oops!', 'Open a lesson first before saving.');
        return;
    }
    if (getSavedList().indexOf('lesson:' + lessonKey) !== -1) {
        showMessage('Already Saved', 'This material is already in your saved materials section.');
        return;
    }
    saveConfirmModal.hidden = false;
}
 
document.getElementById('save-yes').addEventListener('click', function () {
    var list = getSavedList();
    list.push('lesson:' + lessonKey);
    localStorage.setItem(SAVED_KEY, list.join(','));
 
    saveConfirmModal.hidden = true;
    showMessage('Materials Saved!', 'You can view your saved materials in your saved materials section.');
});
 
document.getElementById('save-cancel').addEventListener('click', function () {
    saveConfirmModal.hidden = true;
});
 
// RATE
function showStars(rating) {
    for (var i = 0; i < stars.length; i++) {
        var filled = i < rating;
        stars[i].textContent = filled ? '\u2605' : '\u2606';
        stars[i].classList.toggle('filled', filled);
    }
}
 
function startRate() {
    if (!lessonKey) {
        showMessage('Oops!', 'Open a lesson first before rating.');
        return;
    }
    currentRating = Number(localStorage.getItem('lina_rating:' + lessonKey)) || 0;
    reviewBox.value = localStorage.getItem('lina_review:' + lessonKey) || '';
    rateError.textContent = '';
    showStars(currentRating);
    rateModal.hidden = false;
}
 
for (var i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function () {
        currentRating = Number(this.getAttribute('data-value'));
        rateError.textContent = '';
        showStars(currentRating);
    });
}
 
document.getElementById('rate-submit').addEventListener('click', function () {
    if (currentRating === 0) {
        rateError.textContent = 'Please choose a star rating.';
        return;
    }
    localStorage.setItem('lina_rating:' + lessonKey, currentRating);
    localStorage.setItem('lina_review:' + lessonKey, reviewBox.value);
 
    rateModal.hidden = true;
    showMessage('Rating Successful!', 'Thank you for your feedback!');
});
 
document.getElementById('rate-close').addEventListener('click', function () {
    rateModal.hidden = true;
});
 
function toggleNotes() {
    if (!lessonKey) {
        showMessage('Oops!', 'Open a lesson first before taking notes.');
        return;
    }
    if (notesPanel.hidden) {
        notesText.value = localStorage.getItem('lina_note:' + lessonKey) || '';
        notesPanel.hidden = false;
    } else {
        notesPanel.hidden = true;
    }
}
 
notesText.addEventListener('input', function () {
    localStorage.setItem('lina_note:' + lessonKey, notesText.value);
});
 
document.getElementById('notes-close').addEventListener('click', function () {
    notesPanel.hidden = true;
});
 
document.getElementById('msg-exit').addEventListener('click', function () {
    msgModal.hidden = true;
});
 
var actionButtons = document.querySelectorAll('[data-action]');
for (var j = 0; j < actionButtons.length; j++) {
    actionButtons[j].addEventListener('click', function (e) {
        e.preventDefault();
        var action = this.getAttribute('data-action');
        if (action === 'save') startSave();
        if (action === 'rate') startRate();
        if (action === 'note') toggleNotes();
    });
}