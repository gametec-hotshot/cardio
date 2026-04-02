class LayoutManager {
    constructor(rootPath = '.') {
        this.rootPath = rootPath;
        this.init();
    }

    init() {
        this.renderLayout();
        this.initializeUX();
    }

    renderLayout() {
        // Render Header
        const headerContainer = document.getElementById('app-header');
        if (headerContainer) {
            headerContainer.innerHTML = this.getHeaderHTML();
        }

        // Render Footer
        const footerContainer = document.getElementById('app-footer');
        if (footerContainer) {
            footerContainer.innerHTML = this.getFooterHTML();
        }

        // Render Search Overlay
        const searchContainer = document.getElementById('app-search');
        if (searchContainer) {
            searchContainer.innerHTML = this.getSearchOverlayHTML();
        } else {
            // If no container, append to body
            const div = document.createElement('div');
            div.id = 'app-search';
            div.innerHTML = this.getSearchOverlayHTML();
            document.body.appendChild(div);
        }
    }

    initializeUX() {
        // Scroll to Top
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    scrollTopBtn.classList.remove('opacity-0', 'invisible');
                    scrollTopBtn.classList.add('opacity-100', 'visible');
                } else {
                    scrollTopBtn.classList.add('opacity-0', 'invisible');
                    scrollTopBtn.classList.remove('opacity-100', 'visible');
                }
            });

            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Reading Progress Bar
        const progressBar = document.getElementById('reading-progress');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + "%";
            });
        }

        this.setupLightbox();
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
                // Animate menu items
                if (!menu.classList.contains('hidden')) {
                    anime({
                        targets: '#mobile-menu a',
                        translateX: [-20, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(50),
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    }

    setupLightbox() {
        // Create lightbox overlay if it doesn't exist
        if (!document.getElementById('lightbox-overlay')) {
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox-overlay';
            lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-[60] hidden flex items-center justify-center cursor-zoom-out p-4';
            lightbox.innerHTML = `
                <img id="lightbox-image" src="" alt="Full screen view" class="max-w-full max-h-full rounded-lg shadow-2xl transform transition-transform duration-300 scale-95 opacity-0">
            `;
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', () => {
                const img = document.getElementById('lightbox-image');
                img.classList.remove('scale-100', 'opacity-100');
                img.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    lightbox.classList.add('hidden');
                }, 300);
            });
        }

        // Add click listeners to triggers
        document.querySelectorAll('.lightbox-trigger').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const lightbox = document.getElementById('lightbox-overlay');
                const lightboxImg = document.getElementById('lightbox-image');

                lightboxImg.src = img.src;
                lightbox.classList.remove('hidden');

                // Small delay to allow display:block to apply before animating
                requestAnimationFrame(() => {
                    lightboxImg.classList.remove('scale-95', 'opacity-0');
                    lightboxImg.classList.add('scale-100', 'opacity-100');
                });
            });
        });
    }

    getHeaderHTML() {
        return `
        <nav class="bg-white shadow-lg border-b-2 border-clinical-blue sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="${this.rootPath}/index.html" class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            <svg class="h-8 w-8 text-clinical-blue" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-xl font-playfair font-bold text-deep-navy">CardioReference</h1>
                            <p class="text-xs text-neutral-slate">Professional Cardiology Resource</p>
                        </div>
                    </a>
                    
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="${this.rootPath}/index.html" class="text-neutral-slate hover:text-clinical-blue transition-colors font-medium">Home</a>
                        <a href="${this.rootPath}/index.html#disorders" class="text-neutral-slate hover:text-clinical-blue transition-colors font-medium">Disorders</a>
                        <a href="${this.rootPath}/diagnostic-tools.html" class="text-neutral-slate hover:text-clinical-blue transition-colors font-medium">Diagnostic Tools</a>
                        <a href="${this.rootPath}/treatment-protocols.html" class="text-neutral-slate hover:text-clinical-blue transition-colors font-medium">Treatment Protocols</a>
                        <a href="${this.rootPath}/research.html" class="text-neutral-slate hover:text-clinical-blue transition-colors font-medium">Latest Research</a>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <button id="search-toggle" class="p-2 text-neutral-slate hover:text-clinical-blue transition-colors" aria-label="Search">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                        <!-- Mobile Menu Button -->
                        <button id="mobile-menu-btn" class="md:hidden p-2 text-neutral-slate hover:text-clinical-blue transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Mobile Menu Overlay -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                <div class="px-4 pt-2 pb-4 space-y-1">
                    <a href="${this.rootPath}/index.html" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-slate hover:text-clinical-blue hover:bg-gray-50">Home</a>
                    <a href="${this.rootPath}/index.html#disorders" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-slate hover:text-clinical-blue hover:bg-gray-50">Disorders</a>
                    <a href="${this.rootPath}/diagnostic-tools.html" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-slate hover:text-clinical-blue hover:bg-gray-50">Diagnostic Tools</a>
                    <a href="${this.rootPath}/treatment-protocols.html" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-slate hover:text-clinical-blue hover:bg-gray-50">Treatment Protocols</a>
                    <a href="${this.rootPath}/research.html" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-slate hover:text-clinical-blue hover:bg-gray-50">Latest Research</a>
                </div>
            </div>
            <div id="reading-progress" class="h-1 bg-clinical-blue w-0 transition-all duration-100"></div>
        </nav>
        `;
    }

    getFooterHTML() {
        return `
        <footer class="bg-deep-navy text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <div class="flex items-center justify-center space-x-4 mb-6">
                        <svg class="h-8 w-8 text-clinical-blue" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <h3 class="text-2xl font-playfair font-bold">CardioReference</h3>
                    </div>
                    <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Professional cardiology resource providing comprehensive coverage of cardiovascular disorders, 
                        diagnostic tools, and evidence-based treatment protocols for healthcare professionals.
                    </p>
                    <div class="border-t border-gray-600 pt-6">
                        <p class="text-sm text-gray-400 mb-3">
                            © 2024 CardioReference. Professional medical education resource. 
                            <span class="text-clinical-blue">Evidence-based content updated regularly.</span>
                        </p>
                        <p class="text-sm text-gray-400 mb-3">
                            Designed & Developed by <span class="text-clinical-blue font-semibold">Ritik Dhage</span>
                        </p>
                        <p class="text-xs text-gray-500 italic max-w-2xl mx-auto">
                            ⚠️ <strong>Medical Disclaimer:</strong> This resource is for educational purposes only. The information provided is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals and follow your institution's protocols before making any clinical decisions. In case of medical emergency, contact emergency services immediately.
                        </p>
                    </div>
                </div>
            </div>
            <!-- Scroll to Top Button -->
            <button id="scroll-top-btn" class="fixed bottom-8 right-8 bg-clinical-blue text-white p-3 rounded-full shadow-lg opacity-0 invisible transition-all duration-300 hover:bg-blue-700 z-50" aria-label="Scroll to top">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
            </button>
        </footer>
        `;
    }

    getSearchOverlayHTML() {
        return `
        <div id="search-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="search-container bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
                    <div class="flex items-center space-x-4 mb-4">
                        <svg class="w-6 h-6 text-clinical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input 
                            type="text" 
                            id="search-input" 
                            placeholder="Search disorders, symptoms, diagnostic tests, or treatments..."
                            class="flex-1 text-lg bg-transparent border-none outline-none text-deep-navy placeholder-neutral-slate focus:ring-0"
                        >
                        <button id="search-close" class="text-neutral-slate hover:text-clinical-blue transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div id="search-results" class="space-y-2 max-h-96 overflow-y-auto">
                        <!-- Search results will be populated here -->
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
