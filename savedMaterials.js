/*
    <!--
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.

    CYB 202
    INTROWEB - FINAL REQUIREMENT - JAVASCRIPT FOR SAVED MATERIALS
    -->
*/

var STORAGE_KEY = 'lina_saved_materials';
 
var cards = document.querySelectorAll('.saved-card');
var searchInputs = document.querySelectorAll('.saved-search-input');
var emptyMsg = document.getElementById('saved-empty');
var mainView = document.getElementById('main-view');
var folderView = document.getElementById('folder-view');
var folderItem = document.getElementById('open-folder');
 
function getSavedList() {
    var val = localStorage.getItem(STORAGE_KEY);
    if (!val) return [];
    return val.split(',').map(function (item) { return item.trim(); })
              .filter(function (item) { return item && item !== '[]'; });
}
 
function getQuery() {
    return searchInputs.length > 0 ? searchInputs[0].value.trim().toLowerCase() : '';
}
 
function showCards() {
    var saved = getSavedList();
    var query = getQuery();
    var shownInGrid = 0;
 
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var id = card.getAttribute('data-id');
        var always = card.getAttribute('data-always') === 'yes';
        var title = card.querySelector('.saved-title').textContent.toLowerCase();
 
        var isSaved = always || saved.indexOf(id) !== -1;
        var matches = title.indexOf(query) !== -1;
        var visible = isSaved && matches;
 
        card.hidden = !visible;
 
        if (visible && card.parentElement.id === 'materials-grid') {
            shownInGrid++;
        }
    }
 
    if (emptyMsg) emptyMsg.hidden = shownInGrid > 0;
 
    if (folderItem) {
        folderItem.hidden = 'progsdats'.indexOf(query) === -1;
    }
}
 
for (var s = 0; s < searchInputs.length; s++) {
    searchInputs[s].addEventListener('input', function () {
        for (var k = 0; k < searchInputs.length; k++) {
            searchInputs[k].value = this.value;
        }
        showCards();
    });
}
 
// Open folder
if (folderItem) {
    folderItem.addEventListener('click', function () {
        mainView.hidden = true;
        folderView.hidden = false;
        showCards();
    });
}
 
document.getElementById('folder-back').addEventListener('click', function () {
    folderView.hidden = true;
    mainView.hidden = false;
    showCards();
});
 
window.addEventListener('pageshow', showCards);
showCards();
