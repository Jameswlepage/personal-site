function adjustDots() {
    const dotElements = document.querySelectorAll('.dots');
    dotElements.forEach(dotsEl => {
        // Reset dots
        dotsEl.textContent = '';
        const container = dotsEl.parentElement;
        const children = Array.from(container.children);

        const leftParts = children.slice(0, children.indexOf(dotsEl));
        const rightParts = children.slice(children.indexOf(dotsEl) + 1);

        let usedWidth = 0;
        [...leftParts, ...rightParts].forEach(el => {
            const style = window.getComputedStyle(el);
            usedWidth += el.offsetWidth
                + parseFloat(style.marginLeft)
                + parseFloat(style.marginRight);
        });

        const totalWidth = container.clientWidth;
        const available = totalWidth - usedWidth;

        if (available > 0) {
            const dotWidth = 4;
            const count = Math.floor(available / dotWidth);
            dotsEl.textContent = '.'.repeat(Math.max(count, 0));
        }
    });
}

function adjustTooltipPosition() {
    const citations = document.querySelectorAll('.citation');
    citations.forEach(citation => {
        const tooltip = citation.querySelector('.citation-tooltip');

        citation.addEventListener('mouseenter', () => {
            const tooltipRect = tooltip.getBoundingClientRect();
            const citationRect = citation.getBoundingClientRect();

            if (tooltipRect.left < 0) {
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateX(0)';
            }

            if (tooltipRect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
                tooltip.style.transform = 'translateX(0)';
            }

            if (tooltipRect.top < 0) {
                tooltip.style.bottom = 'auto';
                tooltip.style.top = '100%';
            }
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    const headerText = document.querySelector('.header-text');
    const fullTitle = headerText.querySelector('.full-title');
    const SCROLL_THRESHOLD = 50;
    let isAnimating = false;
    let isShrunk = false;
    let originalText = fullTitle.textContent.trim();

    // Split the full title into spans
    const initializeTitle = () => {
        fullTitle.textContent = '';

        // Create spans for each character
        [...originalText].forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            fullTitle.appendChild(span);
        });
    };

    initializeTitle();

    const handleScroll = () => {
        if (window.innerWidth > 700) { // Apply only on desktop
            if (window.scrollY > SCROLL_THRESHOLD && !isShrunk && !isAnimating) {
                isAnimating = true;
                const spanElements = Array.from(fullTitle.querySelectorAll('span'));

                spanElements.forEach((span, index) => {
                    setTimeout(() => {
                        if (!['J', 'W', 'L'].includes(span.textContent)) {
                            span.style.opacity = '0';
                            setTimeout(() => {
                                span.remove();
                                if (index === spanElements.length - 1) {
                                    isAnimating = false;
                                }
                            }, 300); // Match CSS transition duration
                        } else {
                            // Keep JWL letters bold
                            span.style.fontWeight = 'bold';
                        }
                    }, index * 50); // Stagger animation
                });

                isShrunk = true;
            } else if (window.scrollY <= SCROLL_THRESHOLD && isShrunk && !isAnimating) {
                isAnimating = true;

                // Reconstruct the full title
                let existingSpans = Array.from(fullTitle.querySelectorAll('span'));
                let currentIndex = 0;

                [...originalText].forEach((char, index) => {
                    const existingSpan = existingSpans[currentIndex];
                    if (existingSpan && existingSpan.textContent === char) {
                        currentIndex++;
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.opacity = '0';
                        fullTitle.insertBefore(span, existingSpans[currentIndex]);
                        existingSpans.splice(currentIndex, 0, span);

                        setTimeout(() => {
                            span.style.opacity = '1';
                            if (index === originalText.length - 1) {
                                isAnimating = false;
                            }
                        }, index * 50); // Stagger animation
                    }
                });

                // Reset fontWeight for JWL letters
                fullTitle.querySelectorAll('span').forEach(span => {
                    if (['J', 'W', 'L'].includes(span.textContent)) {
                        span.style.fontWeight = '';
                    }
                });

                isShrunk = false;
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize utility functions
    adjustDots();
    adjustTooltipPosition();
});

// Window event listeners
window.addEventListener('resize', adjustDots);
