/*
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.

    INTROWEB- FINAL REQUIREMENT
*/

(function () {
    const RESULT_PREFIX = 'search_result_';
    const RESULT_SUFFIX = '.html';
    const FALLBACK_PAGE = 'search_result_template.html';
 
    // Keywords that have their own page
    const KNOWN_KEYWORDS = [
        'java',
        'python',
        'calculus',
        'cryptography',
        'networking'
    ];
 
    // "Java Script!" -> "java_script"
    function toSlug(text) {
        return text
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }
 
    function buildResultUrl(query) {
        const slug = toSlug(query);
        const page = KNOWN_KEYWORDS.includes(slug)
            ? RESULT_PREFIX + slug + RESULT_SUFFIX
            : FALLBACK_PAGE;
        return page + '?q=' + encodeURIComponent(query);
    }
 
    function initSearchBar() {
        const inputs = document.querySelectorAll('input[type="search"][name="search"]');
 
        inputs.forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter') return;
                e.preventDefault();
 
                const query = input.value.trim();
                if (!toSlug(query)) return;
 
                window.location.href = buildResultUrl(query);
            });
        });
    }
 
    function initResultPage() {
        const heading = document.querySelector('.search-result-heading');
        if (!heading) return;
 
        const params = new URLSearchParams(window.location.search);
        let query = params.get('q');

        if (!query && !window.location.pathname.endsWith(FALLBACK_PAGE)) {
            const match = window.location.pathname.match(/search_result_(.+)\.html$/);
            if (match) query = match[1].replace(/_/g, ' ');
        }
        if (!query) return;
 
        heading.textContent = ' ' + query;
        document.title = 'LINA - ' + query;
 
        const input = document.querySelector('input[type="search"][name="search"]');
        if (input) input.value = query;

        const noResults = document.querySelector('.no-search-results');
        if (noResults) {
            noResults.textContent = 'No results found for "' + query + '".';
        }
    }
 
    document.addEventListener('DOMContentLoaded', function () {
        initSearchBar();
        initResultPage();
    });
})();