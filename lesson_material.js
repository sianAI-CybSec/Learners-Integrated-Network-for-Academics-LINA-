import * as pdfjsLib from "/pdfjs/pdf.mjs";

// Define the service worker route for background processing tasks
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";

// Replace this with your actual local or hosted file path
const pdfUrl = '/lessons/IntroToJavaLesson.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumPending = null;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

/*==================================
  Render the specified page.
===================================*/
function renderPage(num) {
    pageIsRendering = true;

  // Fetch the page metadata
    pdfDoc.getPage(num).then(page => {
        // 1. Calculate device scale for sharp text rendering on Retina/High-DPI displays
        const outputScale = window.devicePixelRatio || 1;
        
        // Base viewport scale (1.5)
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        transform: transform
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
        pageIsRendering = false;

        if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
        }
        });

        // Update the counter text values on screen
        document.getElementById('page-num').textContent = num;
    });

    // Enable/Disable buttons safely depending on positional status
    document.getElementById('prev-page').disabled = (num <= 1);
    document.getElementById('next-page').disabled = (num >= pdfDoc.numPages);
}

/*====================================================================
 * Handle queue checking so user double-clicks don't crash rendering engines
====================================================================*/
function queueRenderPage(num) {
    if (pageIsRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Navigation Actions
document.getElementById('prev-page').addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
});

document.getElementById('next-page').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
});

pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    
    // Render the initial landing page
    renderPage(pageNum);
}).catch(err => {
    console.error('Error loading PDF engine data:', err);
    document.querySelector('.canvas-wrapper').innerHTML = '<p style="color:red; padding:20px;">Failed to display PDF document.</p>';
});
