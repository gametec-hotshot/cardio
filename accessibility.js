// Accessibility Module for CardioReference
// Provides: skip-link management, keyboard navigation, focus trapping, ARIA enhancements
document.addEventListener('DOMContentLoaded', () => {
    Accessibility.init();
});

class Accessibility {
    static init() {
        this.setupSkipLink();
        this.enhanceNavigation();
        this.keyboardNav();
        this.ariaEnhanceInputs();
        this.focusManagement();
        this.announceLiveRegion();
    }

    static setupSkipLink() {
        // Ensure skip link exists and works
        const skipLink = document.getElementById('skip-to-content');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    // Scroll into view
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            // Show skip link on focus
            skipLink.addEventListener('focus', () => {
                skipLink.style.opacity = '1';
                skipLink.style.transform = 'translateY(0)';
            });
        }
    }

    static enhanceNavigation() {
        // Make nav a proper landmark
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Enhance nav links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.href && link.href.includes('#')) {
                link.setAttribute('aria-current', 'false');
            }
        });

        // Protocol nav buttons (treatment protocols page)
        const protocolBtns = document.querySelectorAll('.protocol-nav-btn');
        if (protocolBtns.length > 0) {
            const listContainer = protocolBtns[0]?.closest('.space-y-2');
            if (listContainer && !listContainer.getAttribute('role')) {
                listContainer.setAttribute('role', 'tablist');
                listContainer.setAttribute('aria-label', 'Treatment protocol categories');
            }
            protocolBtns.forEach((btn, index) => {
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
                const protocolId = btn.getAttribute('data-protocol') + '-protocol';
                btn.setAttribute('aria-controls', protocolId);
                btn.setAttribute('id', 'tab-' + (btn.getAttribute('data-protocol') || index));
            });
        }

        // Tool navigation tabs (diagnostic tools page)
        const toolTabs = document.querySelectorAll('.tool-nav-btn');
        if (toolTabs.length > 0) {
            const tabList = toolTabs[0].closest('.flex');
            if (tabList && !tabList.getAttribute('role')) {
                tabList.setAttribute('role', 'tablist');
                tabList.setAttribute('aria-label', 'Diagnostic tool categories');
            }
            toolTabs.forEach((btn, index) => {
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
                const targetId = btn.getAttribute('data-target');
                btn.setAttribute('aria-controls', targetId);
            });
        }

        // Research filter tabs
        const filterBtns = document.querySelectorAll('.research-filter');
        if (filterBtns.length > 0) {
            const filterGroup = filterBtns[0].closest('.flex');
            if (filterGroup && !filterGroup.getAttribute('role')) {
                filterGroup.setAttribute('role', 'tablist');
                filterGroup.setAttribute('aria-label', 'Research category filters');
            }
            filterBtns.forEach((btn, index) => {
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
            });
        }
    }

    static keyboardNav() {
        // Tab navigation for tab lists
        const handleTabArrowKeys = (e, selector, currentIndex) => {
            const tabs = document.querySelectorAll(selector);
            let newIndex = currentIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            } else if (e.key === 'Home') {
                e.preventDefault();
                newIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                newIndex = tabs.length - 1;
            }

            if (newIndex !== currentIndex) {
                tabs.forEach((tab, i) => {
                    tab.setAttribute('tabindex', i === newIndex ? '0' : '-1');
                    tab.setAttribute('aria-selected', i === newIndex ? 'true' : 'false');
                    if (i === newIndex) tab.focus();
                });
            }
        };

        // Protocol tabs keyboard nav (treatment protocols page)
        document.querySelectorAll('.protocol-nav-btn').forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => handleTabArrowKeys(e, '.protocol-nav-btn', index));
        });

        // Tool tabs keyboard nav (diagnostic tools page)
        document.querySelectorAll('.tool-nav-btn').forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => handleTabArrowKeys(e, '.tool-nav-btn', index));
        });

        // Research filter tabs keyboard nav
        document.querySelectorAll('.research-filter').forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => handleTabArrowKeys(e, '.research-filter', index));
        });

        // Search overlay keyboard management
        const searchToggle = document.getElementById('search-toggle');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');

        if (searchToggle && searchOverlay) {
            searchToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (e.key === ' ') e.preventDefault();
                    searchToggle.click();
                }
            });

            // Observe overlay open/close for focus trapping
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isOpen = !searchOverlay.classList.contains('hidden');
                        searchToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                        if (isOpen) {
                            document.getElementById('search-input')?.focus();
                        }
                    }
                });
            });
            observer.observe(searchOverlay, { attributes: true });
        }

        if (searchClose && searchOverlay) {
            searchClose.addEventListener('click', () => {
                searchToggle?.focus();
            });
        }

        // Close search on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (searchOverlay && !searchOverlay.classList.contains('hidden')) {
                    searchOverlay.classList.add('hidden');
                    searchToggle?.focus();
                    document.body.style.overflow = '';
                }
            }
        });

        // Lead buttons keyboard nav (ECG simulator)
        const leadBtns = document.querySelectorAll('.lead-btn');
        if (leadBtns.length > 0) {
            const group = leadBtns[0].closest('.grid');
            if (group && !group.getAttribute('role')) {
                group.setAttribute('role', 'radiogroup');
                group.setAttribute('aria-label', 'ECG lead selection');
            }
            leadBtns.forEach((btn) => {
                btn.setAttribute('role', 'radio');
                const isActive = btn.classList.contains('bg-clinical-blue');
                btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
                btn.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }
    }

    static ariaEnhanceInputs() {
        // Associate labels with form inputs that may lack proper IDs
        const labelGroups = document.querySelectorAll('label');
        labelGroups.forEach(label => {
            const input = label.querySelector('input, select, textarea');
            if (input && !input.getAttribute('id') && label.textContent.trim()) {
                const inputId = 'input-' + Math.random().toString(36).substr(2, 9);
                input.setAttribute('id', inputId);
                label.setAttribute('for', inputId);
            }
        });

        // Mark required fields
        document.querySelectorAll('input[required], select[required]').forEach(el => {
            el.setAttribute('aria-required', 'true');
        });

        // ECG rhythm selector
        const rhythmSelector = document.getElementById('rhythm-selector');
        if (rhythmSelector) {
            rhythmSelector.setAttribute('aria-label', 'Choose ECG rhythm type');
        }

        // Heart rate slider
        const hrSlider = document.getElementById('heart-rate-slider');
        if (hrSlider) {
            hrSlider.setAttribute('aria-label', 'Heart rate in beats per minute');
            hrSlider.setAttribute('aria-valuemin', '40');
            hrSlider.setAttribute('aria-valuemax', '180');
            const display = document.getElementById('heart-rate-display');
            if (display) {
                hrSlider.setAttribute('aria-valuenow', display.textContent || '75');
                // Update dynamic value
                const mo = new MutationObserver(() => {
                    hrSlider.setAttribute('aria-valuenow', display.textContent || '75');
                });
                mo.observe(display, { childList: true, characterData: true, subtree: true });
            }
        }

        // Play/pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.setAttribute('aria-label', 'Play ECG animation');
        }

        // Analyze rhythm button
        const analyzeBtn = document.getElementById('analyze-rhythm-btn');
        if (analyzeBtn) {
            analyzeBtn.setAttribute('aria-label', 'Analyze current ECG rhythm');
        }

        // Calculate buttons — add aria labels
        document.querySelectorAll('button[id^="calculate-"]').forEach(btn => {
            const calcName = btn.id.replace('calculate-', '').toUpperCase()
                .replace(/-/g, ' ').replace(/(\b\w)/g, m => m.toUpperCase());
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Calculate ' + calcName);
            }
        });

        document.querySelectorAll('button[id^="interpret-"]').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                const name = btn.id.replace('interpret-', '').toUpperCase();
                btn.setAttribute('aria-label', 'Interpret ' + name);
            }
        });
    }

    static focusManagement() {
        // Focus visible styles for all interactive elements
        const style = document.createElement('style');
        style.textContent = `
            /* Focus-visible for keyboard users */
            *:focus-visible {
                outline: 3px solid #2563EB;
                outline-offset: 2px;
                border-radius: 4px;
            }

            /* Remove default outline for mouse users */
            *:focus:not(:focus-visible) {
                outline: none;
            }

            /* Screen-reader only text */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }

            /* Skip link styles */
            .skip-link {
                position: absolute;
                top: -100%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 200;
                background: #2563EB;
                color: white;
                padding: 12px 24px;
                border-radius: 0 0 8px 8px;
                font-weight: 600;
                font-size: 14px;
                opacity: 0;
                transform: translate(-50%, -100%);
                transition: all 0.2s ease;
                text-decoration: none;
            }

            .skip-link:focus {
                top: 0;
                opacity: 1;
                transform: translate(-50%, 0);
                color: white;
            }

            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
                .ecg-wave { animation: none !important; }
                .floating-animation { animation: none !important; }
                .pulse-animation { animation: none !important; }
            }

            /* High contrast mode enhancement */
            @media (forced-colors: active) {
                .disorder-card, .protocol-card, .calculator-card,
                .research-card, .medication-tier {
                    border: 2px solid currentColor;
                }
            }
        `;
        document.head.appendChild(style);
    }

    static announceLiveRegion() {
        // Create an aria-live region for screen reader announcements
        let liveRegion = document.getElementById('sr-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'sr-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        window.announceToSR = function(message) {
            liveRegion.textContent = '';
            setTimeout(() => { liveRegion.textContent = message; }, 100);
        };

        // Announce section changes (e.g., new protocol tab selected)
        const protocolBtns = document.querySelectorAll('.protocol-nav-btn');
        protocolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const name = btn.textContent.trim().replace(/\s+/g, ' ');
                    announceToSR('Showing ' + name + ' protocol');
                }, 150);
            });
        });

        // Announce tool section changes
        const toolBtns = document.querySelectorAll('.tool-nav-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const name = btn.textContent.trim().replace(/\s+/g, ' ');
                    announceToSR('Showing ' + name + ' section');
                }, 150);
            });
        });

        // Announce quiz feedback
        const quizFeedback = document.getElementById('quiz-feedback');
        if (quizFeedback) {
            const observer = new MutationObserver(() => {
                const isHidden = quizFeedback.classList.contains('hidden');
                if (!isHidden) {
                    const title = document.getElementById('quiz-feedback-title')?.textContent || '';
                    const text = document.getElementById('quiz-feedback-text')?.textContent || '';
                    announceToSR(title + '. ' + text);
                }
            });
            observer.observe(quizFeedback, { attributes: true, attributeFilter: ['class'] });
        }

        // Announce calculator results
        const resultDivs = document.querySelectorAll('[id$="-result"]');
        resultDivs.forEach(div => {
            const observer = new MutationObserver(() => {
                const isHidden = div.classList.contains('hidden');
                if (!isHidden) {
                    const scoreEl = div.querySelector('[id$="-score"], [id$="-risk-percent"], [id$="-value"], [id$="-interpretation"]');
                    if (scoreEl) {
                        announceToSR('Result: ' + scoreEl.textContent.trim());
                    }
                }
            });
            observer.observe(div, { attributes: true, attributeFilter: ['class'] });
        });
    }
}
