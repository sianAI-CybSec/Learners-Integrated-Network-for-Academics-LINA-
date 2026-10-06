import * as pdfjsLib from './pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./pdfjs/pdf.worker.mjs', import.meta.url).href;

/*==================================
  Lesson list
  key used in the URL -> PDF file + display title
  Usage: lesson_material.html?lesson=java => syntax for accessing the js code
===================================*/
const LESSONS = {
    java: { file: 'java.pdf',        title: 'Intro to Java Programming' },
    javascript: { file: 'javascript.pdf', title: 'Intro to WebDev with JavaScript' },
    python_dsa:  { file: 'python_dsa.pdf',   title: 'Stacks and Queues with Python' },
    progsdats: {file: 'progsdats.pdf', title: 'Progsdats and the print statement'},
};

const lessonKey = new URLSearchParams(window.location.search).get('lesson');
const lesson = Object.hasOwn(LESSONS, lessonKey) ? LESSONS[lessonKey] : null;
const pdfUrl = lesson ? new URL(`./lessons/${lesson.file}`, import.meta.url).href : null;

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumPending = null;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

if (lesson) {
    document.querySelectorAll('.lesson-material-title-open').forEach(function (el) {
        el.textContent = lesson.title;
    });
    document.title = `${lesson.title} | LINA Lessons`;
}

/*==================================
  Render the specified page.
===================================*/
function renderPage(num) {
    pageIsRendering = true;

    pdfDoc.getPage(num).then(page => {
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: 1.5 });

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

/*==================================
  Queue renders so fast clicks don't overlap
===================================*/
function queueRenderPage(num) {
    if (pageIsRendering) pageNumPending = num;
    else renderPage(num);
}

prevBtn.addEventListener('click', () => {
    if (!pdfDoc || pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
});

nextBtn.addEventListener('click', () => {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
});

/*==================================
  Error display
===================================*/
function showError(text) {
    const msg = document.createElement('p');
    msg.style.cssText = 'color:#ffb4b4; padding:20px;';
    msg.textContent = text;
    document.querySelector('.pdf-viewport').appendChild(msg);
    prevBtn.disabled = true;
    nextBtn.disabled = true;
}

/*==================================
  Load the selected lesson
===================================*/
if (!pdfUrl) {
    showError('Lesson not found. Please go back and choose a lesson.');
} else {
    pdfjsLib.getDocument({ url: pdfUrl }).promise.then(doc => {
        pdfDoc = doc;
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    }).catch(err => {
        console.error('Error loading PDF:', err);
        showError('Failed to display PDF document.');
    });
}