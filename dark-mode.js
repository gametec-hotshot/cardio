// Dark Mode Toggle
// Persistent across all pages via localStorage

(function() {
    'use strict';

    const DARK_MODE_KEY = 'cardio-dark-mode';

    function prefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function isDarkStored() {
        return localStorage.getItem(DARK_MODE_KEY) === 'true';
    }

    function shouldBeDark() {
        return isDarkStored();
    }

    function applyDarkMode(dark) {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    function createToggleButton() {
        // Check if toggle already exists
        if (document.getElementById('dark-mode-toggle')) return;

        const btn = document.createElement('button');
        btn.id = 'dark-mode-toggle';
        btn.setAttribute('aria-label', 'Toggle dark mode');
        btn.title = 'Toggle dark mode';
        btn.style.cssText = `
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        `;

        const isDark = shouldBeDark();
        updateBtnStyle(btn, isDark);

        btn.addEventListener('click', function() {
            const isNowDark = !document.documentElement.classList.contains('dark');
            applyDarkMode(isNowDark);
            localStorage.setItem(DARK_MODE_KEY, String(isNowDark));
            updateBtnStyle(btn, isNowDark);
            // Dispatch event for other scripts
            window.dispatchEvent(new CustomEvent('dark-mode-changed', { detail: { dark: isNowDark } }));
        });

        document.body.appendChild(btn);
    }

    function updateBtnStyle(btn, isDark) {
        if (isDark) {
            btn.style.background = '#1e293b';
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>`;
        } else {
            btn.style.background = '#f8fafc';
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>`;
        }
    }

    // Apply dark mode as early as possible (prevents flash)
    if (shouldBeDark()) {
        document.documentElement.classList.add('dark');
    }

    // Create toggle after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
})();
