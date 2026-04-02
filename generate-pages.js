const fs = require('fs');
const code = fs.readFileSync('main.js', 'utf8');

// Find the disorders array - skip the empty initializer, find the one with data
const searchStr = 'this.disorders = [';
let searchPos = 0;
let matches = [];
while (true) {
    const idx = code.indexOf(searchStr, searchPos);
    if (idx === -1) break;
    const bracketIdx = code.indexOf('[', idx);
    // peek at next char to see if it's empty []
    const peek = code.substring(bracketIdx + 1, bracketIdx + 3).trim();
    if (peek !== ']') {
        matches.push({ idx, bracketIdx });
    }
    searchPos = idx + 1;
}

console.log('Found', matches.length, 'non-empty disorders arrays');

const { bracketIdx } = matches[0];
console.log('Array starts at char', bracketIdx);

// Walk through the array, tracking bracket depth
let depth = 0;
let endIdx = bracketIdx;
let escaped = false;
let inSingleQuote = false;
let inDoubleQuote = false;

for (let i = bracketIdx; i < code.length; i++) {
    const ch = code[i];

    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }

    // Handle single/double quoted strings
    if (ch === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; continue; }
    if (ch === '"' && !inSingleQuote) { inDoubleQuote = !inDoubleQuote; continue; }

    // Skip comments (only outside strings)
    if (!inSingleQuote && !inDoubleQuote) {
        if (ch === '/' && code[i+1] === '/') {
            while (i < code.length && code[i] !== '\n') i++;
            continue;
        }
        if (ch === '/' && code[i+1] === '*') {
            while (i < code.length && !(code[i] === '*' && code[i+1] === '/')) i++;
            i++;
            continue;
        }
    }

    if (!inSingleQuote && !inDoubleQuote) {
        if (ch === '[') depth++;
        if (ch === ']') depth--;
        if (depth === 0) { endIdx = i + 1; break; }
    }
}

const raw = code.substring(bracketIdx, endIdx);
const cleaned = raw.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

try {
    const disorders = new Function('return ' + cleaned)();
    console.log('Parsed', disorders.length, 'disorders');

    if (!fs.existsSync('disorders')) {
        fs.mkdirSync('disorders', { recursive: true });
    }

    disorders.forEach(d => {
        const symTags = d.symptoms.map(s => s.replace(/-/g, ' ')).map(s =>
            '<span class="inline-block px-3 py-1 bg-clinical-blue bg-opacity-10 text-clinical-blue rounded-full text-sm font-medium">' + s + '</span>'
        ).join('\n            ');
        const riskTags = d.riskFactors.map(r => r.replace(/-/g, ' ')).map(r =>
            '<span class="inline-block px-3 py-1 bg-alert-coral bg-opacity-10 text-alert-coral rounded-full text-sm font-medium">' + r + '</span>'
        ).join('\n            ');
        const diagTags = d.diagnostics.map(t => t.replace(/-/g, ' ')).map(t =>
            '<span class="inline-block px-3 py-1 bg-diagnostic-teal bg-opacity-10 text-diagnostic-teal rounded-full text-sm font-medium">' + t + '</span>'
        ).join('\n            ');
        const treatTags = d.treatments.map(t => t.replace(/-/g, ' ')).map(t =>
            '<span class="inline-block px-3 py-1 bg-success-green bg-opacity-10 text-success-green rounded-full text-sm font-medium">' + t + '</span>'
        ).join('\n            ');

        const html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + d.name + ' | CardioReference</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet"><script src="https://cdn.tailwindcss.com">\x3c/script><script>tailwind.config={theme:{extend:{colors:{"clinical-blue":"#2563EB","diagnostic-teal":"#0891B2","alert-coral":"#DC2626","neutral-slate":"#475569","light-gray":"#F1F5F9","deep-navy":"#1E293B","success-green":"#059669","cardiac-purple":"#7C3AED","ecg-chartreuse":"#84CC16","warning-amber":"#D97706"},fontFamily:{"inter":["Inter","sans-serif"],"playfair":["Playfair Display","serif"]}}}};\x3c/script></head><body class="bg-light-gray font-inter"><nav class="bg-white shadow-lg border-b-2 border-clinical-blue sticky top-0 z-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><a href="../index.html" class="flex items-center space-x-4"><svg class="h-8 w-8 text-clinical-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><div><h1 class="text-xl font-playfair font-bold text-deep-navy">CardioReference</h1><p class="text-xs text-neutral-slate">Professional Cardiology Resource</p></div></a><a href="../index.html#disorders" class="px-6 py-2 bg-clinical-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">\u2190 Back to All Disorders</a></div></div></nav><section class="relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-deep-navy via-clinical-blue to-diagnostic-teal opacity-95"></div><div class="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-20"><span class="inline-block px-4 py-1.5 text-xs font-semibold text-white rounded-full bg-white bg-opacity-20 mb-4">' + d.category + '</span><h1 class="text-3xl md:text-5xl font-playfair font-bold mb-6 text-white">' + d.name + '</h1><p class="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl">' + d.description + '</p></div></section><div class="max-w-7xl mx-auto px-4 -mt-8 relative z-20"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"><p class="text-sm text-neutral-slate mb-1">Prevalence</p><p class="text-lg font-bold text-deep-navy">' + d.prevalence + '</p></div><div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"><p class="text-sm text-neutral-slate mb-1">Severity</p><p class="text-lg font-bold text-alert-coral">' + d.severity + '</p></div><div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"><p class="text-sm text-neutral-slate mb-1">Incidence</p><p class="text-sm font-semibold text-deep-navy">' + d.incidence + '</p></div><div class="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"><p class="text-sm text-neutral-slate mb-1">Mortality</p><p class="text-sm font-semibold text-deep-navy">' + d.mortality + '</p></div></div></div><div class="max-w-7xl mx-auto px-4 py-12 space-y-6"><div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"><div class="flex items-center mb-6"><div class="w-3 h-3 bg-alert-coral rounded-full mr-3"></div><h2 class="text-2xl font-playfair font-bold text-deep-navy">Common Symptoms</h2></div><div class="flex flex-wrap gap-3">' + symTags + '</div></div><div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"><div class="flex items-center mb-6"><div class="w-3 h-3 bg-clinical-blue rounded-full mr-3"></div><h2 class="text-2xl font-playfair font-bold text-deep-navy">Risk Factors</h2></div><div class="flex flex-wrap gap-3">' + riskTags + '</div></div><div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"><div class="flex items-center mb-6"><div class="w-3 h-3 bg-diagnostic-teal rounded-full mr-3"></div><h2 class="text-2xl font-playfair font-bold text-deep-navy">Diagnostic Tests</h2></div><div class="flex flex-wrap gap-3">' + diagTags + '</div></div><div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"><div class="flex items-center mb-6"><div class="w-3 h-3 bg-success-green rounded-full mr-3"></div><h2 class="text-2xl font-playfair font-bold text-deep-navy">Treatment Options</h2></div><div class="flex flex-wrap gap-3">' + treatTags + '</div></div><div class="bg-gradient-to-r from-light-gray to-white rounded-2xl p-6 shadow-lg border border-gray-200"><p class="text-sm text-neutral-slate italic">\u26a0\ufe0f <strong>Medical Disclaimer:</strong> This resource is for educational purposes only. The information provided is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals and follow your institution\'s protocols before making any clinical decisions.</p></div><div class="text-center pt-4 pb-8"><a href="../index.html#disorders" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-clinical-blue to-diagnostic-teal text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg">\u2190 Back to All Disorders</a></div></div><footer class="bg-deep-navy text-white py-12"><div class="max-w-7xl mx-auto px-4 text-center"><p class="text-sm text-gray-400 mb-1">\u00a9 2024 CardioReference. Evidence-based content updated regularly.</p><p class="text-sm text-gray-400 mb-3">Designed & Developed by <span class="text-clinical-blue font-semibold">Ritik Dhage</span></p><p class="text-xs text-gray-500 italic">This information is for educational purposes only and should not replace professional medical advice.</p></div></footer></body></html>';

        fs.writeFileSync('disorders/' + d.id + '.html', html);
        console.log('\u2713 disorders/' + d.id + '.html');
    });

    console.log('\nGenerated ' + disorders.length + ' pages');
} catch (e) {
    console.error('Parse error:', e.message);
}
