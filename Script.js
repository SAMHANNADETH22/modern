document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU FUNCTIONALITY ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const submenuButtons = document.querySelectorAll('.mobile-menu-category');

    // 1. Main Hamburger Menu Toggle
    // This part handles opening and closing the entire mobile menu.
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Submenu Accordion Toggle
    // This part handles the expanding/collapsing of categories inside the mobile menu.
    submenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const submenu = button.nextElementSibling;
            const arrow = button.querySelector('svg');

            // Ensure we are targeting a valid submenu
            if (submenu && submenu.classList.contains('mobile-submenu')) {
                // Check if the current submenu is already open before we do anything
                const isSubmenuOpen = submenu.style.maxHeight && submenu.style.maxHeight !== '0px';

                // First, close all submenus to create the accordion effect
                document.querySelectorAll('.mobile-submenu').forEach(otherSubmenu => {
                    otherSubmenu.style.maxHeight = '0px';
                    const otherArrow = otherSubmenu.previousElementSibling.querySelector('svg');
                    if (otherArrow) {
                        otherArrow.classList.remove('rotate-180');
                    }
                });

                // If the clicked submenu was NOT already open, then open it.
                if (!isSubmenuOpen) {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                    if (arrow) {
                        arrow.classList.add('rotate-180');
                    }
                }
            }
        });
    });

    // === THEME SWITCHER SCRIPT ===
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    if (themeToggleButton && lightIcon && darkIcon) {
        const themes = ['light', 'dark', 'system'];

        const applyTheme = (theme) => {
            document.documentElement.classList.remove('dark'); // reset
            let isDark;

            if (theme === 'dark') {
                isDark = true;
            } else if (theme === 'light') {
                isDark = false;
            } else { // 'system'
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            if (isDark) {
                document.documentElement.classList.add('dark');
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
            } else {
                lightIcon.classList.remove('hidden');
                darkIcon.classList.add('hidden');
            }
        };

        themeToggleButton.addEventListener('click', () => {
            let currentTheme = localStorage.getItem('theme') || 'system';
            let currentIndex = themes.indexOf(currentTheme);
            let nextIndex = (currentIndex + 1) % themes.length;
            let newTheme = themes[nextIndex];

            if (newTheme === 'system') {
                localStorage.removeItem('theme');
            } else {
                localStorage.setItem('theme', newTheme);
            }
            applyTheme(newTheme);
        });

        // Apply theme on initial load
        const savedTheme = localStorage.getItem('theme');
        applyTheme(savedTheme || 'system');

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (!localStorage.getItem('theme')) { // Only update if theme is 'system'
                applyTheme('system');
            }
        });
    }

    // === INFINITE STEP CAROUSEL SCRIPT ===
    const transitionTime = 600;

    function initStepCarousel(containerSelector, interval) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const track = container.querySelector('.carousel-track-js');
        if (!track) return;

        const originalItems = Array.from(track.children);
        if (originalItems.length <= 1) return;

        // Clone items for seamless loop
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        const itemStyle = window.getComputedStyle(originalItems[0]);
        const itemMargin = parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
        const itemWidthWithMargin = originalItems[0].offsetWidth + itemMargin;
        let currentIndex = 0;

        setInterval(() => {
            currentIndex++;
            track.style.transition = `transform ${transitionTime}ms ease-in-out`;
            track.style.transform = `translateX(-${currentIndex * itemWidthWithMargin}px)`;

            // Reset to the beginning without transition for a seamless loop
            if (currentIndex >= originalItems.length) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0)`;
                }, transitionTime);
            }
        }, interval);
    }

    // Initialize the locations carousel
    initStepCarousel('#locations-carousel', 3000);
});