function adjustDots() {
    const dotElements = document.querySelectorAll('.work-list__dots, .press-list__dots, .artist-list__dots, .hobby-list__dots');
    dotElements.forEach(dotsEl => {
        dotsEl.textContent = '';
        const container = dotsEl.parentElement;
        const children = Array.from(container.children);

        const leftParts = children.slice(0, children.indexOf(dotsEl));
        const rightParts = children.slice(children.indexOf(dotsEl) + 1);

        let usedWidth = 0;
        [...leftParts, ...rightParts].forEach(el => {
            const style = window.getComputedStyle(el);
            let marginLeft = parseFloat(style.marginLeft) || 0;
            let marginRight = parseFloat(style.marginRight) || 0;
            usedWidth += el.offsetWidth + marginLeft + marginRight;
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

document.addEventListener('DOMContentLoaded', () => {
    // Initialize dots
    adjustDots();
    window.addEventListener('resize', adjustDots);

    // Menu toggle functionality
    const menuToggle = document.querySelector('.header__menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuItems = document.querySelector('.header__menu-items');
    const menuClose = document.querySelector('.header__menu-close');

    if (menuToggle && menuOverlay && menuItems) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            menuOverlay.classList.toggle('active', !expanded);
            menuItems.classList.toggle('active', !expanded);
        });

        if (menuClose) {
            menuClose.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', false);
                menuOverlay.classList.remove('active');
                menuItems.classList.remove('active');
            });
        }

        // Add event listener for hash links in the menu
        menuItems.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', false);
                menuOverlay.classList.remove('active');
                menuItems.classList.remove('active');
            });
        });
    }

    // Initialize Tippy tooltips
    tippy('[data-tippy-content]', {
        theme: 'custom',
        arrow: true,
    });
});
