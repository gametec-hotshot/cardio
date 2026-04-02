/**
 * CardioReference — Dark Mode System v2
 *
 * Features:
 *   • Smooth CSS transitions between light ↔ dark
 *   • Floating sleek toggle button with sun/moon icons
 *   • OS preference detection (prefers-color-scheme: dark)
 *   • Persistent via localStorage
 *   • Cross-tab sync (storage event)
 *   • Zero-FOUC: <html class="dark"> injected synchronously before paint
 */

(function () {
    'use strict';

    var KEY = 'cardio-dark-mode';

    /* ─── Helpers ─────────────────────────────────────────── */

    function stored() {
        return localStorage.getItem(KEY);            // "true" | "false" | null
    }

    function systemPrefersDark() {
        return window.matchMedia &&
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function shouldBeDark() {
        var v = stored();
        if (v !== null) return v === 'true';         // explicit user choice wins
        return systemPrefersDark();                   // fall back to OS
    }

    /* ─── Apply / Remove ──────────────────────────────────── */

    function apply(dark) {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Update toggle icon if it exists
        var btn = document.getElementById('cardio-dark-toggle');
        if (btn) setIcon(btn, dark);
    }

    /* ─── Toggle Button ───────────────────────────────────── */

    function setIcon(btn, dark) {
        if (dark) {
            btn.style.background  = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
            btn.style.color       = '#fbbf24';
            btn.style.boxShadow   = '0 4px 20px rgba(251,191,36,0.18), 0 2px 8px rgba(0,0,0,0.4)';
            btn.setAttribute('aria-label', 'Switch to light mode');
            btn.title             = 'Switch to light mode';
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>`;
        } else {
            btn.style.background  = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
            btn.style.color       = '#1e293b';
            btn.style.boxShadow   = '0 4px 20px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)';
            btn.setAttribute('aria-label', 'Switch to dark mode');
            btn.title             = 'Switch to dark mode';
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>`;
        }
    }

    function createToggle() {
        if (document.getElementById('cardio-dark-toggle')) return;

        var btn = document.createElement('button');
        btn.id            = 'cardio-dark-toggle';
        btn.setAttribute('role', 'switch');
        btn.setAttribute('aria-checked', String(shouldBeDark()));
        btn.style.cssText = [
            'position:fixed',
            'bottom:1.5rem',
            'right:1.5rem',
            'z-index:2147483647',
            'width:3.25rem',
            'height:3.25rem',
            'border-radius:50%',
            'border:2px solid rgba(148,163,184,0.2)',
            'cursor:pointer',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'font-size:0',
            'transition:background 0.4s cubic-bezier(.4,0,.2,1),color 0.4s ease,box-shadow 0.4s ease,transform 0.2s ease',
            '-webkit-tap-highlight-color:transparent',
            'backdrop-filter:blur(6px)',
            '-webkit-backdrop-filter:blur(6px)',
            'outline:none'
        ].join(';');

        var isDark = shouldBeDark();
        setIcon(btn, isDark);

        /* Hover / focus polish */
        btn.addEventListener('mouseover', function () { btn.style.transform = 'scale(1.12)'; });
        btn.addEventListener('mouseout',  function () { btn.style.transform = 'scale(1)';    });
        btn.addEventListener('focus',     function () { btn.style.outline = '2px solid #3b82f6'; btn.style.outlineOffset = '2px'; });
        btn.addEventListener('blur',      function () { btn.style.outline = 'none'; });

        /* Click: toggle */
        btn.addEventListener('click', function () {
            var now = !document.documentElement.classList.contains('dark');
            apply(now);
            localStorage.setItem(KEY, String(now));
            btn.setAttribute('aria-checked', String(now));
            document.documentElement.setAttribute('data-theme', now ? 'dark' : 'light');
        });

        document.body.appendChild(btn);
    }

    /* ─── System preference change listener ───────────────── */

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (stored() === null) apply(e.matches);   // only auto-react if user never chose
        });
    }

    /* ─── Cross-tab sync ──────────────────────────────────── */

    window.addEventListener('storage', function (e) {
        if (e.key === KEY && e.newValue !== null) {
            apply(e.newValue === 'true');
            var btn = document.getElementById('cardio-dark-toggle');
            if (btn) btn.setAttribute('aria-checked', e.newValue);
        }
    });

    /* ─── Boot ────────────────────────────────────────────── */

    /* 1. Apply before paint (avoids FOUC on disorder pages) */
    apply(shouldBeDark());

    /* 2. Build DOM toggle when ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggle);
    } else {
        createToggle();
    }
})();
