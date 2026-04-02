const fs = require('fs');

const code = fs.readFileSync('main.js', 'utf8');

// Extract disorders array from main.js
// Find: this.disorders = [ ... ];
// Use bracket matching to extract the array
let idx = code.indexOf('this.disorders = [');
let bracketIdx = code.indexOf('[', idx);
let depth = 0;
let endIdx = bracketIdx;
for (let i = bracketIdx; i < code.length; i++) {
    if (code[i] === '[') depth++;
    if (code[i] === ']') depth--;
    if (depth === 0) { endIdx = i + 1; break; }
}

const arrStr = code.substring(bracketIdx, endIdx);
// Remove comments before eval
const cleaned = arrStr
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

const disorders = new Function('return ' + cleaned)();
console.log(`Parsed ${disorders.length} disorders`);

// Create disorders directory
if (!fs.existsSync('disorders')) {
    fs.mkdirSync('disorders', { recursive: true });
}

disorders.forEach(d => {
    const symTags = d.symptoms.map(s => s.replace(/-/g, ' ')).map(s => 
        `<span class="inline-block px-3 py-1 bg-clinical-blue bg-opacity-10 text-clinical-blue rounded-full text-sm font-medium">${s}</span>`
    ).join('\n                ');
    
    const riskTags = d.riskFactors.map(r => r.replace(/-/g, ' ')).map(r =>
        `<span class="inline-block px-3 py-1 bg-alert-coral bg-opacity-10 text-alert-coral rounded-full text-sm font-medium">${r}</span>`
    ).join('\n                ');
    
    const diagTags = d.diagnostics.map(t => t.replace(/-/g, ' ')).map(t =>
        `<span class="inline-block px-3 py-1 bg-diagnostic-teal bg-opacity-10 text-diagnostic-teal rounded-full text-sm font-medium">${t}</span>`
    ).join('\n                ');
    
    const treatTags = d.treatments.map(t => t.replace(/-/g, ' ')).map(t =>
        `<span class="inline-block px-3 py-1 bg-success-green bg-opacity-10 text-success-green rounded-full text-sm font-medium">${t}</span>`
    ).join('\n                ');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${d.name} | CardioReference</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    'clinical-blue': '#2563EB', 'diagnostic-teal': '#0891B2',
                    'alert-coral': '#DC2626', 'warning-amber': '#D97706',
                    'neutral-slate': '#475569', 'light-gray': '#F1F5F9',
                    'success-green': '#059669', 'deep-navy': '#1E293B',
                    'cardiac-purple': '#7C3AED', 'ecg-chartreuse': '#84CC16',
                    'imaging-orange': '#EA580C', 'biomarker-rose': '#E11D48'
                },
                fontFamily: { 'inter': ['Inter','sans-serif'], 'playfair': ['Playfair Display','serif'] }
            }
        }
    };
    <\/script>
    <style>
        .disorder-card { background: linear-gradient(135deg, #F1F5F9 0%, #ffffff 100%); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .fade-in-delay { animation: fadeIn 0.6s ease-out 0.1s forwards; opacity: 0; }
    </style>
</head>
<body class="bg-light-gray font-inter">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b-2 border-clinical-blue sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="../index.html" class="flex items-center space-x-4">
                    <svg class="h-8 w-8 text-clinical-blue" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <div>
                        <h1 class="text-xl font-playfair font-bold text-deep-navy">CardioReference</h1>
                        <p class="text-xs text-neutral-slate">Professional Cardiology Resource</p>
                    </div>
                </a>
                <a href="../index.html#disorders" class="hidden md:inline-block px-6 py-2 bg-clinical-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">← Back to All Disorders</a>
                <a href="../index.html#disorders" class="md:hidden px-4 py-2 bg-clinical-blue text-white rounded-lg hover:bg-blue-700">← Back</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-deep-navy via-clinical-blue to-diagnostic-teal opacity-95"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-20">
            <span class="inline-block px-4 py-1.5 text-xs font-semibold text-white rounded-full bg-white bg-opacity-20 mb-4 fade-in">${d.category}</span>
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 text-white fade-in">${d.name}</h1>
            <p class="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl fade-in-delay">${d.description}</p>
        </div>
    </section>

    <!-- Quick Stats -->
    <div class="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div class="w-12 h-12 bg-clinical-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-clinical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.098-1.304-.283-1.912M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.098-1.304.283-1.912m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <p class="text-sm text-neutral-slate mb-1">Prevalence</p>
                <p class="text-lg font-bold text-deep-navy">${d.prevalence}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div class="w-12 h-12 bg-alert-coral bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-alert-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <p class="text-sm text-neutral-slate mb-1">Severity</p>
                <p class="text-lg font-bold text-alert-coral">${d.severity}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div class="w-12 h-12 bg-diagnostic-teal bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-diagnostic-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <p class="text-sm text-neutral-slate mb-1">Incidence</p>
                <p class="text-sm font-semibold text-deep-navy">${d.incidence}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div class="w-12 h-12 bg-cardiac-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-cardiac-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-neutral-slate mb-1">Mortality</p>
                <p class="text-sm font-semibold text-deep-navy">${d.mortality}</p>
            </div>
        </div>
    </div>

    <!-- Detailed Sections -->
    <div class="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <!-- Symptoms -->
        <div class="disorder-card bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center mb-6">
                <div class="w-3 h-3 bg-alert-coral rounded-full mr-3"></div>
                <h2 class="text-2xl font-playfair font-bold text-deep-navy">Common Symptoms</h2>
            </div>
            <div class="flex flex-wrap gap-3">
                ${symTags}
            </div>
        </div>

        <!-- Risk Factors -->
        <div class="disorder-card bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center mb-6">
                <div class="w-3 h-3 bg-clinical-blue rounded-full mr-3"></div>
                <h2 class="text-2xl font-playfair font-bold text-deep-navy">Risk Factors</h2>
            </div>
            <div class="flex flex-wrap gap-3">
                ${riskTags}
            </div>
        </div>

        <!-- Diagnostic Tests -->
        <div class="disorder-card bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center mb-6">
                <div class="w-3 h-3 bg-diagnostic-teal rounded-full mr-3"></div>
                <h2 class="text-2xl font-playfair font-bold text-deep-navy">Diagnostic Tests</h2>
            </div>
            <div class="flex flex-wrap gap-3">
                ${diagTags}
            </div>
        </div>

        <!-- Treatment Options -->
        <div class="disorder-card bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center mb-6">
                <div class="w-3 h-3 bg-success-green rounded-full mr-3"></div>
                <h2 class="text-2xl font-playfair font-bold text-deep-navy">Treatment Options</h2>
            </div>
            <div class="flex flex-wrap gap-3">
                ${treatTags}
            </div>
        </div>

        <!-- Medical Disclaimer -->
        <div class="bg-gradient-to-r from-light-gray to-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <p class="text-sm text-neutral-slate italic">
                ⚠️ <strong>Medical Disclaimer:</strong> This resource is for educational purposes only. 
                The information provided is not a substitute for professional medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare professionals and follow your institution's protocols before 
                making any clinical decisions. In case of medical emergency, contact emergency services immediately.
            </p>
        </div>

        <!-- Navigation -->
        <div class="text-center pt-4 pb-8">
            <a href="../index.html#disorders" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-clinical-blue to-diagnostic-teal text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Back to All Disorders
            </a>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-deep-navy text-white py-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <div class="flex items-center justify-center space-x-4 mb-6">
                <svg class="h-8 w-8 text-clinical-blue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <h3 class="text-2xl font-playfair font-bold">CardioReference</h3>
            </div>
            <p class="text-gray-300 mb-4 max-w-lg mx-auto">Professional cardiology resource providing comprehensive coverage of cardiovascular disorders.</p>
            <p class="text-sm text-gray-400 mb-1">© 2024 CardioReference. Evidence-based content updated regularly.</p>
            <p class="text-sm text-gray-400 mb-3">Designed & Developed by <span class="text-clinical-blue font-semibold">Ritik Dhage</span></p>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(`disorders/${d.id}.html`, html);
    console.log(`✓ ${d.id}.html`);
});

console.log(`\nGenerated ${disorders.length} disease detail pages in disorders/`);
