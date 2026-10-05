import * as pdfjsLib from './pdfjs/pdf.mjs';

// Resolve paths relative to THIS file so they work wherever the page is served from
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./pdfjs/pdf.worker.mjs', import.meta.url).href;

// Must match the exact filename (case-sensitive on most servers)
const pdfUrl = new URL('./lessons/java.pdf', import.meta.url).href;

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumPending = null;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

function renderPage(num) {
    pageIsRendering = true;

    pdfDoc.getPage(num).then(page => {
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: 1.5 });

        // Bitmap size (sharp on high-DPI) vs. CSS display size
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderTask = page.render({ canvasContext: ctx, viewport, transform });

        return renderTask.promise.then(() => {
            pageIsRendering = false;
            if (pageNumPending !== null) {
                const next = pageNumPending;
                pageNumPending = null;
                renderPage(next);
            }
        });
    }).catch(err => {
        pageIsRendering = false;
        console.error('Error rendering page:', err);
    });

    document.getElementById('page-num').textContent = num;
    prevBtn.disabled = num <= 1;
    nextBtn.disabled = num >= pdfDoc.numPages;
}

function queueRenderPage(num) {
    if (pageIsRendering) pageNumPending = num;
    else renderPage(num);
}

prevBtn.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
});

nextBtn.addEventListener('click', () => {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
});

pdfjsLib.getDocument({ url: pdfUrl }).promise.then(doc => {
    pdfDoc = doc;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
}).catch(err => {
    console.error('Error loading PDF:', err);
    // Don't wipe the canvas wrapper; show the message beside it
    const msg = document.createElement('p');
    msg.style.cssText = 'color:#ffb4b4; padding:20px;';
    msg.textContent = 'Failed to display PDF document. Check the browser console (F12) for details.';
    document.querySelector('.pdf-viewport').appendChild(msg);
});