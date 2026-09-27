import { createTimeline } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

document.addEventListener('DOMContentLoaded', () => {
    const tl = createTimeline({
        loop: true
    });

    tl.add('.imageLogo', {
        rotate: 90,
        duration: 500,
        delay: 1000,
        ease: 'easeInOutQuad'
    })
    .add('.imageLogo', {
        rotate: 180,
        duration: 500,
        delay: 1000,
        ease: 'easeInOutQuad'
    })
    .add('.imageLogo', {
        rotate: 270,
        duration: 500,
        delay: 1000,
        ease: 'easeInOutQuad'
    })
    .add('.imageLogo', {
        rotate: 360,
        duration: 500,
        delay: 1000,
        ease: 'easeInOutQuad'
    });
});

