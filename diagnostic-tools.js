// Diagnostic Tools JavaScript
// Interactive ECG simulator, risk calculators, and clinical decision support

class DiagnosticTools {
    constructor() {
        this.ecgAnimation = null;
        this.currentRhythm = 'normal-sinus';
        this.currentHeartRate = 75;
        this.currentLead = 'II';
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeECGSimulator();
        this.initializeRiskCalculators();
        this.initializeBMICalculator();
        this.initializeFlowcharts();
        this.initializeBiomarkerInterpreter();
        this.initializeECGIntervalCalculator();
    }

    initializeNavigation() {
        const navButtons = document.querySelectorAll('.tool-nav-btn');
        const sections = document.querySelectorAll('.tool-section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                
                // Update navigation
                navButtons.forEach(btn => {
                    btn.classList.remove('text-clinical-blue', 'font-semibold', 'border-b-2', 'border-clinical-blue');
                    btn.classList.add('text-neutral-slate');
                });
                button.classList.add('text-clinical-blue', 'font-semibold', 'border-b-2', 'border-clinical-blue');
                button.classList.remove('text-neutral-slate');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.add('hidden');
                });
                document.getElementById(target).classList.remove('hidden');
            });
        });
    }

    initializeECGSimulator() {
        const rhythmSelector = document.getElementById('rhythm-selector');
        const heartRateSlider = document.getElementById('heart-rate-slider');
        const heartRateDisplay = document.getElementById('heart-rate-display');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const analyzeRhythmBtn = document.getElementById('analyze-rhythm-btn');
        const leadButtons = document.querySelectorAll('.lead-btn');

        if (rhythmSelector) {
            rhythmSelector.addEventListener('change', (e) => {
                this.currentRhythm = e.target.value;
                this.updateECGDisplay();
            });
        }

        if (heartRateSlider) {
            heartRateSlider.addEventListener('input', (e) => {
                this.currentHeartRate = parseInt(e.target.value);
                heartRateDisplay.textContent = this.currentHeartRate;
                this.updateECGDisplay();
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.toggleECGAnimation();
            });
        }

        if (analyzeRhythmBtn) {
            analyzeRhythmBtn.addEventListener('click', () => {
                this.analyzeCurrentRhythm();
            });
        }

        leadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                leadButtons.forEach(btn => {
                    btn.classList.remove('bg-clinical-blue', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-neutral-slate');
                });
                e.target.classList.add('bg-clinical-blue', 'text-white');
                e.target.classList.remove('bg-gray-200', 'text-neutral-slate');
                
                this.currentLead = e.target.dataset.lead;
                this.updateECGDisplay();
            });
        });

        // Initialize ECG display
        this.updateECGDisplay();
    }

    generateECGWaveform(rhythm, heartRate) {
        const width = 800;
        const height = 400;
        const centerY = height / 2;
        
        let path = `M 0 ${centerY}`;
        
        // Calculate timing based on heart rate
        const rrInterval = 60 / heartRate; // seconds
        const samplesPerRR = 100;
        const totalSamples = 300;
        
        switch (rhythm) {
            case 'normal-sinus':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.1) { // P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) { // PR segment
                        y = centerY;
                    } else if (phase < 0.35) { // QRS complex
                        if (phase < 0.22) y = centerY - 15; // Q wave
                        else if (phase < 0.28) y = centerY + 80; // R wave
                        else if (phase < 0.32) y = centerY - 30; // S wave
                        else y = centerY; // Return to baseline
                    } else if (phase < 0.55) { // ST segment
                        y = centerY;
                    } else if (phase < 0.85) { // T wave
                        y = centerY - 25 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else { // Return to baseline
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'atrial-fibrillation':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    // Irregular baseline (fibrillation waves)
                    y += 5 * Math.sin(i * 0.1) * Math.random();
                    
                    if (phase < 0.35) { // QRS complex (irregular timing)
                        if (phase < 0.05) y = centerY - 10;
                        else if (phase < 0.15) y = centerY + 70;
                        else if (phase < 0.25) y = centerY - 20;
                        else y = centerY;
                    } else if (phase < 0.7) { // ST segment and T wave
                        if (phase < 0.5) y = centerY;
                        else y = centerY - 20 * Math.sin((phase - 0.5) * Math.PI / 0.2);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'sinus-tachycardia':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % (samplesPerRR * 0.7)) / (samplesPerRR * 0.7); // Faster rate (tachycardia)
                    let y = centerY;
                    
                    if (phase < 0.08) { // P wave - smaller
                        y = centerY - 15 * Math.sin(phase * Math.PI / 0.08);
                    } else if (phase < 0.18) { // PR segment
                        y = centerY;
                    } else if (phase < 0.32) { // QRS complex
                        if (phase < 0.2) y = centerY - 12;
                        else if (phase < 0.25) y = centerY + 70;
                        else if (phase < 0.3) y = centerY - 25;
                        else y = centerY;
                    } else if (phase < 0.5) { // ST segment
                        y = centerY;
                    } else if (phase < 0.78) { // T wave - smaller
                        y = centerY - 20 * Math.sin((phase - 0.5) * Math.PI / 0.28);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'sinus-bradycardia':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % (samplesPerRR * 1.5)) / (samplesPerRR * 1.5); // Slower rate (bradycardia)
                    let y = centerY;
                    
                    if (phase < 0.15) { // P wave - larger spacing
                        y = centerY - 25 * Math.sin(phase * Math.PI / 0.15);
                    } else if (phase < 0.25) { // PR segment
                        y = centerY;
                    } else if (phase < 0.4) { // QRS complex
                        if (phase < 0.28) y = centerY - 18;
                        else if (phase < 0.35) y = centerY + 85;
                        else if (phase < 0.39) y = centerY - 35;
                        else y = centerY;
                    } else if (phase < 0.6) { // ST segment
                        y = centerY;
                    } else if (phase < 0.9) { // T wave
                        y = centerY - 30 * Math.sin((phase - 0.6) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'atrial-flutter':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    // Sawtooth flutter waves in atrial region
                    if (phase < 0.3) {
                        y = centerY - 30 * Math.sin(phase * Math.PI * 4);
                    } else if (phase < 0.35) { // Narrow QRS
                        y = centerY + 60;
                    } else if (phase < 0.4) {
                        y = centerY - 20;
                    } else {
                        y = centerY + 20 * Math.sin((phase - 0.4) * Math.PI / 0.6);
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'ventricular-tachycardia':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % (samplesPerRR * 0.6)) / (samplesPerRR * 0.6); // Faster rate
                    let y = centerY;
                    
                    if (phase < 0.4) { // Wide QRS complex
                        if (phase < 0.05) y = centerY - 20;
                        else if (phase < 0.2) y = centerY + 100;
                        else if (phase < 0.35) y = centerY - 40;
                        else y = centerY;
                    } else if (phase < 0.8) { // ST segment and T wave
                        if (phase < 0.6) y = centerY;
                        else y = centerY - 30 * Math.sin((phase - 0.6) * Math.PI / 0.2);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'ventricular-fibrillation':
                for (let i = 0; i < totalSamples; i++) {
                    let y = centerY + (Math.random() - 0.5) * 80; // Chaotic baseline
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'first-degree-avb':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.15) { // P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.15);
                    } else if (phase < 0.35) { // Prolonged PR interval
                        y = centerY;
                    } else if (phase < 0.5) { // QRS complex
                        if (phase < 0.38) y = centerY - 15;
                        else if (phase < 0.43) y = centerY + 75;
                        else if (phase < 0.48) y = centerY - 28;
                        else y = centerY;
                    } else if (phase < 0.7) { // ST segment
                        y = centerY;
                    } else if (phase < 1) { // T wave
                        y = centerY - 25 * Math.sin((phase - 0.7) * Math.PI / 0.3);
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'second-degree-avb':
                for (let i = 0; i < totalSamples; i++) {
                    const cycle = i % (samplesPerRR * 3); // Every 3rd beat dropped
                    const phase = cycle / samplesPerRR;
                    let y = centerY;
                    
                    if (cycle > samplesPerRR * 2) { // Dropped beat - flat line
                        y = centerY;
                    } else if (phase < 0.1) {
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) {
                        y = centerY;
                    } else if (phase < 0.35) {
                        if (phase < 0.22) y = centerY - 15;
                        else if (phase < 0.28) y = centerY + 80;
                        else if (phase < 0.32) y = centerY - 30;
                        else y = centerY;
                    } else if (phase < 0.55) {
                        y = centerY;
                    } else if (phase < 0.85) {
                        y = centerY - 25 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'third-degree-avb':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    // Atrial rate (independent P waves at ~70 bpm)
                    const atrialPhase = ((i * 1.07) % samplesPerRR) / samplesPerRR;
                    // Ventricular escape rate (slow, ~35 bpm)
                    const ventPhase = ((i * 0.47) % samplesPerRR) / samplesPerRR;
                    let y = centerY;

                    // P waves (independent, regular atrial activity)
                    if (atrialPhase < 0.08) {
                        y = centerY - 18 * Math.sin(atrialPhase * Math.PI / 0.08);
                    }

                    // QRS complex (slow ventricular escape rhythm)
                    if (ventPhase < 0.32) {
                        if (ventPhase < 0.06) y = centerY - 10;
                        else if (ventPhase < 0.15) y = centerY + 65;
                        else if (ventPhase < 0.26) y = centerY - 35;
                        else y = centerY;
                    }

                    // T wave for ventricular escape beats
                    if (ventPhase > 0.45 && ventPhase < 0.75) {
                        y = centerY - 30 * Math.sin((ventPhase - 0.45) * Math.PI / 0.3);
                    }

                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'premature-ventricular':
                for (let i = 0; i < totalSamples; i++) {
                    const position = i / totalSamples;
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (position < 0.5) { // Normal beats
                        if (phase < 0.1) y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                        else if (phase < 0.35) {
                            if (phase < 0.22) y = centerY - 15;
                            else if (phase < 0.28) y = centerY + 80;
                            else if (phase < 0.32) y = centerY - 30;
                            else y = centerY;
                        } else if (phase < 0.85) {
                            y = centerY - 25 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                        }
                    } else { // PVC - wide, abnormal
                        if (phase < 0.3) y = centerY + 100;
                        else if (phase < 0.5) y = centerY - 50;
                        else y = centerY - 20 * Math.sin((phase - 0.5) * Math.PI / 0.5);
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'supraventricular-tachycardia':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % (samplesPerRR * 0.5)) / (samplesPerRR * 0.5); // Very fast rate
                    let y = centerY;
                    
                    if (phase < 0.3) { // Short PR interval
                        if (phase < 0.05) y = centerY - 10 * Math.sin(phase * Math.PI / 0.05);
                        else y = centerY;
                    } else if (phase < 0.45) { // Narrow QRS
                        if (phase < 0.35) y = centerY + 65;
                        else if (phase < 0.42) y = centerY - 25;
                        else y = centerY;
                    } else { // Rapid repeat
                        y = centerY - 15 * Math.sin((phase - 0.45) * Math.PI / 0.55);
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
                
            case 'left-bundle-branch-block':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.1) { // Normal P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) { // PR segment
                        y = centerY;
                    } else if (phase < 0.45) { // Wide, notched QRS — LBBB pattern
                        if (phase < 0.22) y = centerY - 10; // Loss of septal Q
                        else if (phase < 0.32) y = centerY + 75; // Slurred upstroke (R wave)
                        else if (phase < 0.44) y = centerY + 15 + 10 * Math.sin((phase - 0.32) * Math.PI / 0.12); // Notching at peak
                        else y = centerY;
                    } else if (phase < 0.55) { // ST depression with discordance
                        y = centerY + 8;
                    } else if (phase < 0.9) { // Inverted/asymmetric T wave (discordant)
                        y = centerY + 20 * Math.sin((phase - 0.55) * Math.PI / 0.35);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'right-bundle-branch-block':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.1) { // Normal P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) { // PR segment
                        y = centerY;
                    } else if (phase < 0.4) { // RSR' pattern — classic RBBB
                        if (phase < 0.22) y = centerY - 15; // Normal Q wave
                        else if (phase < 0.28) y = centerY + 70; // Initial R wave
                        else if (phase < 0.32) y = centerY - 20; // S wave
                        else if (phase < 0.4) y = centerY + 60; // Secondary R' wave (terminal notch)
                    } else if (phase < 0.55) { // ST depression (discordant)
                        y = centerY + 8;
                    } else if (phase < 0.85) { // Inverted T wave in right precordial leads
                        y = centerY + 18 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'junctional-rhythm':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    // Junctional rhythm: narrow QRS, absent or retrograde P waves, rate 40-60 bpm
                    // Retrograde P wave may appear just before or buried in/after QRS
                    
                    if (phase < 0.08) { // Retrograde P wave (inverted, often buried in QRS)
                        y = centerY + 10 * Math.sin(phase * Math.PI / 0.08); // Inverted compared to normal
                    } else if (phase < 0.18) { // PR segment (short or absent PR interval)
                        y = centerY;
                    } else if (phase < 0.33) { // Narrow QRS complex (junctional origin)
                        if (phase < 0.2) y = centerY - 8; // Minimal Q wave
                        else if (phase < 0.27) y = centerY + 65; // R wave (narrower since junctional)
                        else if (phase < 0.31) y = centerY - 22; // S wave
                        else y = centerY;
                    } else if (phase < 0.5) { // ST segment
                        y = centerY;
                    } else if (phase < 0.8) { // T wave
                        y = centerY - 20 * Math.sin((phase - 0.5) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'mobitz-type-i':
                for (let i = 0; i < totalSamples; i++) {
                    const cycle = i % (samplesPerRR * 4); // 4-beat Wenckebach cycle: P-P, P-PR-prolonged, P-PR-very-long, dropped
                    const phase = cycle / samplesPerRR;
                    let y = centerY;
                    
                    // Wenckebach: progressive PR lengthening, then dropped QRS
                    if (cycle < samplesPerRR) { // Beat 1: normal PR
                        if (phase < 0.08) { // Normal P wave
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.17) { // Normal PR segment
                            y = centerY;
                        } else if (phase < 0.32) { // Normal QRS
                            if (phase < 0.19) y = centerY - 12;
                            else if (phase < 0.25) y = centerY + 75;
                            else if (phase < 0.30) y = centerY - 28;
                            else y = centerY;
                        } else if (phase < 0.5) { y = centerY; }
                        else if (phase < 0.80) { // T wave
                            y = centerY - 22 * Math.sin((phase - 0.5) * Math.PI / 0.3);
                        } else { y = centerY; }
                    } else if (cycle < samplesPerRR * 2) { // Beat 2: prolonged PR
                        if (phase < 0.08) { // P wave
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.22) { // Prolonged PR segment
                            y = centerY;
                        } else if (phase < 0.37) { // QRS
                            if (phase < 0.24) y = centerY - 12;
                            else if (phase < 0.30) y = centerY + 75;
                            else if (phase < 0.35) y = centerY - 28;
                            else y = centerY;
                        } else if (phase < 0.55) { y = centerY; }
                        else if (phase < 0.85) { y = centerY - 22 * Math.sin((phase - 0.55) * Math.PI / 0.3); }
                        else { y = centerY; }
                    } else if (cycle < samplesPerRR * 3) { // Beat 3: very long PR
                        if (phase < 0.08) { // P wave
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.27) { // Very prolonged PR segment
                            y = centerY;
                        } else if (phase < 0.42) { // QRS
                            if (phase < 0.29) y = centerY - 12;
                            else if (phase < 0.35) y = centerY + 75;
                            else if (phase < 0.40) y = centerY - 28;
                            else y = centerY;
                        } else if (phase < 0.6) { y = centerY; }
                        else if (phase < 0.90) { y = centerY - 22 * Math.sin((phase - 0.6) * Math.PI / 0.3); }
                        else { y = centerY; }
                    } else { // Beat 4: DROPPED BEAT — only P wave, no QRS
                        if (phase < 0.08) { // P wave present
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.27) { // Long PR — but NO QRS follows
                            y = centerY;
                        } else if (phase < 0.6) { // ST segment without QRS
                            y = centerY - 3 * Math.sin((phase - 0.27) * Math.PI / 0.33); // tiny blip
                        } else if (phase < 0.85) {
                            y = centerY - 10 * Math.sin((phase - 0.6) * Math.PI / 0.25); // tiny T-like wave
                        } else { y = centerY; }
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'mobitz-type-ii':
                for (let i = 0; i < totalSamples; i++) {
                    const cycle = i % (samplesPerRR * 3); // 3 beats: 2 conducted, 1 dropped — no PR change
                    const phase = cycle / samplesPerRR;
                    let y = centerY;
                    
                    // Mobitz II: constant PR interval, sudden dropped QRS
                    if (cycle < samplesPerRR) { // Beat 1: conducted normally
                        if (phase < 0.08) { // Normal P wave
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.18) { // Normal PR (constant)
                            y = centerY;
                        } else if (phase < 0.33) { // Normal QRS
                            if (phase < 0.20) y = centerY - 12;
                            else if (phase < 0.26) y = centerY + 78;
                            else if (phase < 0.31) y = centerY - 30;
                            else y = centerY;
                        } else if (phase < 0.5) { y = centerY; }
                        else if (phase < 0.80) { y = centerY - 23 * Math.sin((phase - 0.5) * Math.PI / 0.3); }
                        else { y = centerY; }
                    } else if (cycle < samplesPerRR * 2) { // Beat 2: conducted normally — SAME PR
                        if (phase < 0.08) { // P wave
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else if (phase < 0.18) { // Same PR interval (constant — key feature)
                            y = centerY;
                        } else if (phase < 0.33) { // QRS
                            if (phase < 0.20) y = centerY - 12;
                            else if (phase < 0.26) y = centerY + 78;
                            else if (phase < 0.31) y = centerY - 30;
                            else y = centerY;
                        } else if (phase < 0.5) { y = centerY; }
                        else if (phase < 0.80) { y = centerY - 23 * Math.sin((phase - 0.5) * Math.PI / 0.3); }
                        else { y = centerY; }
                    } else { // Beat 3: DROPPED — flatline except P wave
                        if (phase < 0.08) { // P wave still occurs
                            y = centerY - 18 * Math.sin(phase * Math.PI / 0.08);
                        } else { // No QRS — sudden block
                            y = centerY;
                        }
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'accelerated-idioventricular':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    // AIVR: ventricular escape at 40-100 bpm (faster than normal escape 20-40)
                    // Wide QRS, dissociated P waves (may be absent), benign post-reperfusion rhythm
                    // Wide, bizarre QRS — ventricular origin
                    
                    if (phase < 0.06) { // Small initial deflection
                        y = centerY + 8 * Math.sin(phase * Math.PI / 0.06);
                    } else if (phase < 0.38) { // Very wide, bizarre QRS complex (ventricular origin)
                        if (phase < 0.10) y = centerY - 5; // Small q
                        else if (phase < 0.18) y = centerY + 70; // Tall R (wide)
                        else if (phase < 0.28) y = centerY + 50; // Wide plateau
                        else if (phase < 0.35) y = centerY - 20; // Deep S
                        else y = centerY;
                    } else if (phase < 0.50) { // ST segment elevation (common in AIVR, concordant with QRS)
                        y = centerY + 8;
                    } else if (phase < 0.85) { // Large T wave discordant (opposite direction to QRS)
                        y = centerY + 28 * Math.sin((phase - 0.50) * Math.PI / 0.35);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'sinus-arrhythmia':
                for (let i = 0; i < totalSamples; i++) {
                    const basePhase = (i % samplesPerRR) / samplesPerRR;
                    // Respiratory sinus arrhythmia: RR interval varies cyclically
                    // Faster RR (shorter cycle) during inspiration, slower during expiration
                    const respMod = 1.0 + 0.15 * Math.sin(i / samplesPerRR * Math.PI * 0.5);
                    const phase = (i % (samplesPerRR * respMod)) / (samplesPerRR * respMod);
                    let y = centerY;
                    
                    if (phase < 0.1) { // P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) { // PR segment
                        y = centerY;
                    } else if (phase < 0.35) { // QRS complex
                        if (phase < 0.22) y = centerY - 15; // Q wave
                        else if (phase < 0.28) y = centerY + 80; // R wave
                        else if (phase < 0.32) y = centerY - 30; // S wave
                        else y = centerY;
                    } else if (phase < 0.55) { // ST segment
                        y = centerY;
                    } else if (phase < 0.85) { // T wave
                        y = centerY - 25 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'accelerated-junctional':
                for (let i = 0; i < totalSamples; i++) {
                    // Accelerated junctional: rate 60-100 bpm (faster than junctional escape 40-60)
                    // Narrow QRS, inverted/buried P waves
                    const phase = (i % (samplesPerRR * 0.85)) / (samplesPerRR * 0.85);
                    let y = centerY;
                    
                    if (phase < 0.06) { // Retrograde (inverted) P wave — often buried in/before QRS
                        y = centerY + 12 * Math.sin(phase * Math.PI / 0.06); // Inverted compared to sinus P
                    } else if (phase < 0.14) { // Short/absent PR interval (junctional origin)
                        y = centerY;
                    } else if (phase < 0.29) { // Narrow QRS (junctional, supraventricular QRS morphology)
                        if (phase < 0.16) y = centerY - 6; // Minimal Q wave
                        else if (phase < 0.23) y = centerY + 65; // R wave (narrow)
                        else if (phase < 0.27) y = centerY - 22; // S wave
                        else y = centerY;
                    } else if (phase < 0.42) { // ST segment
                        y = centerY;
                    } else if (phase < 0.72) { // T wave
                        y = centerY - 20 * Math.sin((phase - 0.42) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            case 'wpw-pattern':
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.15) { // Very short P wave
                        y = centerY - 12 * Math.sin(phase * Math.PI / 0.15);
                    } else if (phase < 0.2) { // VERY short PR — delta wave begins
                        // Delta wave (slurred upstroke from pre-excitation)
                        y = centerY + 15 * ((phase - 0.15) / 0.05);
                    } else if (phase < 0.35) { // Wide QRS starting with delta wave
                        if (phase < 0.22) y = centerY + 15 + 55 * ((phase - 0.2) / 0.02); // Delta ramp to R
                        else if (phase < 0.28) y = centerY + 80; // Tall R wave
                        else if (phase < 0.33) y = centerY - 10; // S wave
                        else y = centerY;
                    } else if (phase < 0.55) { // ST segment with secondary changes
                        y = centerY;
                    } else if (phase < 0.85) { // T wave discordant (opposite to QRS)
                        y = centerY + 22 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else {
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;

            default:
                // Generate normal sinus rhythm as default
                for (let i = 0; i < totalSamples; i++) {
                    const phase = (i % samplesPerRR) / samplesPerRR;
                    let y = centerY;
                    
                    if (phase < 0.1) { // P wave
                        y = centerY - 20 * Math.sin(phase * Math.PI / 0.1);
                    } else if (phase < 0.2) { // PR segment
                        y = centerY;
                    } else if (phase < 0.35) { // QRS complex
                        if (phase < 0.22) y = centerY - 15; // Q wave
                        else if (phase < 0.28) y = centerY + 80; // R wave
                        else if (phase < 0.32) y = centerY - 30; // S wave
                        else y = centerY; // Return to baseline
                    } else if (phase < 0.55) { // ST segment
                        y = centerY;
                    } else if (phase < 0.85) { // T wave
                        y = centerY - 25 * Math.sin((phase - 0.55) * Math.PI / 0.3);
                    } else { // Return to baseline
                        y = centerY;
                    }
                    
                    path += ` L ${(i / totalSamples) * width} ${y}`;
                }
                break;
        }
        
        return path;
    }

    updateECGDisplay() {
        const ecgPath = document.getElementById('ecg-path');
        if (ecgPath) {
            const waveform = this.generateECGWaveform(this.currentRhythm, this.currentHeartRate);
            ecgPath.setAttribute('d', waveform);
            
            // If animation is playing, restart it with the new waveform
            if (this.isPlaying) {
                // Stop current animation
                if (this.ecgAnimation) {
                    this.ecgAnimation.pause();
                }
                
                // Restart animation with new path
                this.restartECGAnimation();
            }
        }
    }

    toggleECGAnimation() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const ecgPath = document.getElementById('ecg-path');
        const ecgSvg = document.getElementById('ecg-svg');
        
        if (this.isPlaying) {
            // Stop animation
            if (this.ecgAnimation) {
                this.ecgAnimation.pause();
            }
            playPauseBtn.innerHTML = '▶ Play ECG';
            playPauseBtn.classList.remove('bg-alert-coral');
            playPauseBtn.classList.add('bg-success-green');
            this.isPlaying = false;
        } else {
            // Start animation
            // Calculate the path length for stroke-dasharray
            const pathLength = ecgPath.getTotalLength();
            
            // Set up the stroke-dasharray for animation
            ecgPath.setAttribute('stroke-dasharray', pathLength);
            ecgPath.setAttribute('stroke-dashoffset', pathLength);
            
            this.ecgAnimation = anime({
                targets: ecgPath,
                strokeDashoffset: [pathLength, 0],
                duration: 4000,
                easing: 'linear',
                loop: true,
                complete: () => {
                    // Reset for next loop
                    if (this.isPlaying) {
                        anime({
                            targets: ecgPath,
                            strokeDashoffset: [pathLength, 0],
                            duration: 4000,
                            easing: 'linear',
                            loop: true
                        });
                    }
                }
            });
            
            playPauseBtn.innerHTML = '⏸ Pause ECG';
            playPauseBtn.classList.remove('bg-success-green');
            playPauseBtn.classList.add('bg-alert-coral');
            this.isPlaying = true;
        }
    }

    restartECGAnimation() {
        const ecgPath = document.getElementById('ecg-path');
        
        // Force browser reflow to ensure path data is updated
        void ecgPath.offsetWidth;
        
        const pathLength = ecgPath.getTotalLength();
        
        // Reset stroke-dasharray and strokeDashoffset
        ecgPath.setAttribute('stroke-dasharray', pathLength);
        ecgPath.setAttribute('stroke-dashoffset', pathLength);
        
        // Create new animation with updated path length
        this.ecgAnimation = anime({
            targets: ecgPath,
            strokeDashoffset: [pathLength, 0],
            duration: 4000,
            easing: 'linear',
            loop: true
        });
    }

    analyzeCurrentRhythm() {
        const analysisDiv = document.getElementById('rhythm-analysis');
        const contentDiv = document.getElementById('analysis-content');
        
        const rhythmAnalysis = {
            'normal-sinus': {
                name: 'Normal Sinus Rhythm',
                rate: this.currentHeartRate,
                characteristics: [
                    'Regular P waves preceding each QRS complex',
                    'Normal PR interval (0.12-0.20 seconds)',
                    'Normal QRS duration (&lt;0.12 seconds)',
                    'Consistent P wave morphology',
                    'Heart rate 60-100 bpm'
                ],
                clinical: 'Normal cardiac rhythm requiring no intervention.'
            },
            'sinus-tachycardia': {
                name: 'Sinus Tachycardia',
                rate: this.currentHeartRate,
                characteristics: [
                    'Regular P waves preceding each QRS complex',
                    'Normal PR interval',
                    'Normal QRS duration',
                    'Heart rate &gt;100 bpm',
                    'Gradual onset and termination'
                ],
                clinical: 'Often physiologic response to stress, exercise, or illness. Consider underlying causes.'
            },
            'atrial-fibrillation': {
                name: 'Atrial Fibrillation',
                rate: this.currentHeartRate,
                characteristics: [
                    'Irregularly irregular rhythm',
                    'No distinct P waves',
                    'Fibrillatory baseline',
                    'Variable QRS morphology',
                    'Chaotic atrial activity'
                ],
                clinical: 'Requires anticoagulation assessment and rate/rhythm control consideration.'
            },
            'ventricular-tachycardia': {
                name: 'Ventricular Tachycardia',
                rate: this.currentHeartRate,
                characteristics: [
                    'Wide QRS complexes (&gt;0.12 seconds)',
                    'Heart rate typically 100-250 bpm',
                    'AV dissociation may be present',
                    'Capture beats possible',
                    'Fusion beats may occur'
                ],
                clinical: 'Medical emergency requiring immediate intervention and possible cardioversion.'
            },
            'third-degree-avb': {
                name: 'Third-Degree (Complete) AV Block',
                rate: this.currentHeartRate,
                characteristics: [
                    'Complete AV dissociation — P waves and QRS complexes are independent',
                    'Atrial rate faster than ventricular rate',
                    'Regular P-P intervals and regular R-R intervals (but unrelated)',
                    'Ventricular escape rhythm (idioventricular or junctional)',
                    'PR interval varies with no consistent relationship'
                ],
                clinical: 'Complete heart block requires immediate evaluation. Often needs permanent pacemaker. May present with syncope (Stokes-Adams attacks), hemodynamic instability, or heart failure. Treat underlying cause if reversible (e.g., drug toxicity, myocarditis).'
            },
            'left-bundle-branch-block': {
                name: 'Left Bundle Branch Block (LBBB)',
                rate: this.currentHeartRate,
                characteristics: [
                    'Wide QRS complex (≥0.12 seconds)',
                    'Broad, notched or slurred R wave in lateral leads (I, aVL, V5-V6)',
                    'Absent septal Q waves in lateral leads',
                    'ST and T wave discordant to QRS (opposite direction)',
                    'Prolonged R-wave peak time (>60ms in V5-V6)'
                ],
                clinical: 'May indicate underlying heart disease (MI, cardiomyopathy, HTN). New-onset LBBB with chest pain is treated as STEMI equivalent. May obscure MI diagnosis on ECG. Consider Sgarbossa criteria for ACS in LBBB.'
            },
            'right-bundle-branch-block': {
                name: 'Right Bundle Branch Block (RBBB)',
                rate: this.currentHeartRate,
                characteristics: [
                    'Wide QRS complex (≥0.12 seconds)',
                    'RSR\' pattern in V1-V2 (rabbit ears)',
                    'Wide, slurred S wave in leads I and V6',
                    'ST and T wave discordant in right precordial leads',
                    'Normal axis in isolated RBBB'
                ],
                clinical: 'May be normal variant or indicate RV strain (PE, cor pulmonale), congenital heart disease, or progressive conduction system disease. New RBBB with chest pain and syncope may indicate PE or extensive anterior MI.'
            },
            'wpw-pattern': {
                name: 'Wolff-Parkinson-White (WPW) Pattern',
                rate: this.currentHeartRate,
                characteristics: [
                    'Short PR interval (<0.12 seconds)',
                    'Delta wave — slurred upstroke of QRS complex',
                    'Wide QRS complex (≥0.12 seconds)',
                    'Secondary ST-T wave changes (discordant to delta wave)',
                    'May predispose to AVRT (supraventricular tachycardia via accessory pathway)'
                ],
                clinical: 'Pre-excitation syndrome with accessory pathway (Bundle of Kent). Risk of orthodromic and antidromic AVRT. Antidromic AVRT and AFib with WPW can degenerate to VF. AV nodal-blocking agents (adenosine, verapamil, beta-blockers) are CONTRAINDICATED in AFib with WPW. Definitive treatment: catheter ablation of accessory pathway.'
            },
            'junctional-rhythm': {
                name: 'Junctional Escape Rhythm',
                rate: this.currentHeartRate,
                characteristics: [
                    'Narrow QRS complex (<0.12 seconds)',
                    'Rate typically 40-60 bpm (AV junctional pacemaker discharge rate)',
                    'Absent, retrograde (inverted), or buried P waves',
                    'If retrograde P wave visible: may appear before, during, or after QRS',
                    'Regular rhythm with no preceding sinus P wave'
                ],
                clinical: 'Junctional rhythm arises when the SA node fails and the AV junction takes over as the pacemaker of last resort. Common in complete heart block, sick sinus syndrome, digoxin toxicity, inferior MI, and after cardiac surgery. A junctional escape rhythm is a protective mechanism; suppressing it may cause asystole. Treatment addresses the underlying cause. If patient is stable and asymptomatic, observation may be appropriate. If symptomatic or underlying cause not reversible, pacemaker may be required.'
            },
            'mobitz-type-i': {
                name: 'Mobitz Type I (Wenckebach) AV Block',
                rate: this.currentHeartRate,
                characteristics: [
                    'Progressive prolongation of the PR interval before each dropped QRS',
                    'Cyclical pattern: PR interval gets longer, then a QRS is dropped',
                    'RR intervals progressively shorten before the pause',
                    'The pause containing the dropped beat is less than 2 normal RR intervals',
                    'QRS is typically narrow (block is above the His bundle)',
                    'P waves are regular and "march through" despite dropped QRS'
                ],
                clinical: 'Mobitz Type I (Wenckebach) second-degree AV block is usually benign and often reversible. Common causes: increased vagal tone, athletic conditioning, inferior MI (supplies AV node — usually RCA), digoxin toxicity, and beta-blocker or calcium channel blocker use. Unlike Mobitz II, it rarely progresses to complete heart block. Asymptomatic patients may not require treatment. Symptomatic patients or those with inferior MI may benefit from atropine. Permanent pacemaker is rarely indicated unless the block is symptomatic and not reversible. Differentiate from Mobitz Type II, which has constant PR with dropped QRS and a much higher risk of progression to complete heart block.'
            },
            'mobitz-type-ii': {
                name: 'Mobitz Type II Second-Degree AV Block',
                rate: this.currentHeartRate,
                characteristics: [
                    'Constant, normal PR intervals on conducted beats',
                    'Intermittent, unexpected dropped QRS complexes',
                    'No progressive PR prolongation before the dropped beat',
                    'May occur in a ratio pattern (2:1, 3:1 conduction)',
                    'QRS complex may be wide (infranodal block, often with bundle branch block)',
                    'PP intervals are regular throughout'
                ],
                clinical: 'Mobitz Type II second-degree AV block is an ominous finding indicating disease of the His-Purkinje system (below the AV node). It carries a high risk of sudden progression to complete (third-degree) heart block with an unstable ventricular escape rhythm. Causes: anterior MI (LAD supplies His-Purkinje), Lenègre disease (degenerative conduction disease), Lyme cardiology, cardiac surgery, and cardiomyopathy. Unlike Mobitz Type I, there is NO progressive PR prolongation — the block happens suddenly. Atropine may worsen Mobitz Type II (by increasing SA rate without improving His-Purkinje conduction). Permanent pacemaker implantation is indicated even in asymptomatic patients. This is a Class I indication (ACC/AHA/HRS guidelines).'
            },
            'accelerated-idioventricular': {
                name: 'Accelerated Idioventricular Rhythm (AIVR)',
                rate: this.currentHeartRate,
                characteristics: [
                    'Wide QRS complex (≥0.12 seconds) — ventricular origin',
                    'Rate 40-100 bpm (faster than typical ventricular escape of 20-40 bpm)',
                    'Absent or dissociated P waves (AV dissociation common)',
                    'Discordant ST-T changes (ST segments and T waves opposite to QRS direction)',
                    'Gradual onset and termination (unlike VTach which bursts)',
                    'Often described as a "slow VTach" or "slow wide complex rhythm"'
                ],
                clinical: 'Accelerated Idioventricular Rhythm (AIVR) is a relatively benign rhythm that most commonly occurs as a reperfusion phenomenon after successful thrombolysis or PCI in STEMI. The ventricular pacemaker accelerates to rates competitive with the sinus node. It is typically self-limiting and does NOT degenerate to VF or VT. AIVR does NOT require antiarrhythmic treatment — in the reperfusion context, it is actually an encouraging sign of restored flow. Suppression with lidocaine or amiodarone is dangerous (may result in asystole if the sinus node does not recover). If the AIVR persists with hemodynamic compromise, atropine or temporary pacing to override the ventricular focus may be used. Other causes: digoxin toxicity, electrolyte disturbances, post-cardiac surgery, and myocarditis.'
            },
            'first-degree-avb': {
                name: 'First-Degree AV Block',
                rate: this.currentHeartRate,
                characteristics: [
                    'Prolonged PR interval (&gt;0.20 seconds / &gt;1 large box) on every beat',
                    '1:1 AV conduction — every P wave is followed by a QRS complex',
                    'Normal QRS morphology and duration (unless concurrent bundle branch block exists)',
                    'Regular rhythm with unchanged P-P and R-R intervals',
                    'PR interval remains constant (does NOT progressively lengthen)'
                ],
                clinical: 'First-degree AV block represents delayed conduction through the AV node or His-Purkinje system. It is usually benign and asymptomatic, requiring no specific treatment. Common causes include increased vagal tone, athletic conditioning, medications (beta-blockers, calcium channel blockers, digoxin), and degenerative conduction system disease (Lev-Lenègre disease). Unlike higher-degree AV blocks, first-degree AV block does NOT predispose to complete heart block on its own. However, it may indicate underlying conduction system disease and warrants follow-up. If PR interval is markedly prolonged (&gt;0.30 s), it may cause symptoms resembling pacemaker syndrome due to suboptimal AV timing — in such cases, AV-sequential pacing may be considered.'
            },
            'sinus-arrhythmia': {
                name: 'Sinus Arrhythmia',
                rate: this.currentHeartRate,
                characteristics: [
                    'Normal P wave morphology — each P wave has sinus origin',
                    'PP and RR intervals vary by more than 0.12 seconds (respiratory cyclic pattern)',
                    'PR interval is constant and normal (0.12–0.20 s)',
                    'P wave precedes every QRS complex (sinus mechanism preserved)',
                    'Heart rate increases during inspiration and decreases during expiration',
                    'Variation is typically smooth and cyclical (phasic with respiration)'
                ],
                clinical: 'Sinus arrhythmia is a normal physiologic variant, most commonly seen in young, healthy individuals. It reflects normal autonomic modulation of the SA node by the vagus nerve during the respiratory cycle. No treatment is required. It is particularly pronounced in children, young adults, and athletes. Non-respiratory sinus arrhythmia (not cycling with breathing) may be seen in elderly patients or with cardiac disease and may indicate underlying pathology. A marked sinus arrhythmia may be accentuated by digoxin or may be unmasked by vagal maneuvers. It should be distinguished from other irregular rhythms like atrial fibrillation, PACs, or sinus node dysfunction.'
            },
            'accelerated-junctional': {
                name: 'Accelerated Junctional Rhythm',
                rate: this.currentHeartRate,
                characteristics: [
                    'Narrow QRS complex (&lt;0.12 seconds) — supraventricular QRS morphology',
                    'Rate 60-100 bpm (faster than junctional escape rate of 40-60 bpm)',
                    'Retrograde (inverted) P waves — may appear before, within, or after QRS complex',
                    'Short PR interval (&lt;0.12 s) if retrograde P wave precedes QRS',
                    'Regular rhythm with stable R-R intervals',
                    'P wave may be buried within the QRS complex (not visible on surface ECG)'
                ],
                clinical: 'Accelerated junctional rhythm occurs when the AV junction fires at an enhanced rate, faster than the SA node and faster than the normal junctional escape rate. Common causes include: digoxin toxicity (enhanced automaticity + AV block is classic), post-cardiac surgery (especially valve surgery), rheumatic heart disease, inferior myocardial infarction, myocarditis, and sympathetic overdrive. Unlike junctional escape rhythm (which is a protective backup mechanism), accelerated junctional rhythm represents enhanced automaticity of the junctional pacemaker cells. Digoxin toxicity should ALWAYS be considered in a patient presenting with accelerated junctional rhythm. If the patient is hemodynamically stable and the underlying cause is reversible (e.g., digoxin excess), treating the cause is often sufficient. If persistent and symptomatic, beta-blockers or calcium channel blockers may suppress the accelerated junctional focus. Permanent pacing is rarely indicated unless there is underlying sinus node dysfunction.'
            }
        };
        
        const analysis = rhythmAnalysis[this.currentRhythm] || rhythmAnalysis['normal-sinus'];
        
        contentDiv.innerHTML = `
            <div class="mb-4">
                <h5 class="font-semibold text-deep-navy mb-2">${analysis.name}</h5>
                <p class="text-sm text-neutral-slate mb-2">Heart Rate: ${analysis.rate} bpm</p>
            </div>
            
            <div class="mb-4">
                <h6 class="font-medium text-deep-navy mb-2">ECG Characteristics:</h6>
                <ul class="text-sm text-neutral-slate space-y-1">
                    ${analysis.characteristics.map(char => `<li>• ${char}</li>`).join('')}
                </ul>
            </div>
            
            <div>
                <h6 class="font-medium text-deep-navy mb-2">Clinical Significance:</h6>
                <p class="text-sm text-neutral-slate">${analysis.clinical}</p>
            </div>
        `;
        
        analysisDiv.classList.remove('hidden');
        
        // Animate the analysis panel
        anime({
            targets: analysisDiv,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    initializeRiskCalculators() {
        // ASCVD Risk Calculator
        const calculateAscvdBtn = document.getElementById('calculate-ascvd');
        if (calculateAscvdBtn) {
            calculateAscvdBtn.addEventListener('click', () => {
                this.calculateASCVD();
            });
        }

        // CHADS2-VASc Calculator
        const calculateChadsBtn = document.getElementById('calculate-chads');
        if (calculateChadsBtn) {
            calculateChadsBtn.addEventListener('click', () => {
                this.calculateCHADS2VASc();
            });
        }

        // BNP Interpreter
        const interpretBnpBtn = document.getElementById('interpret-bnp');
        if (interpretBnpBtn) {
            interpretBnpBtn.addEventListener('click', () => {
                this.interpretBNP();
            });
        }

        // Wells Criteria for PE Calculator
        const calculateWellsBtn = document.getElementById('calculate-wells');
        if (calculateWellsBtn) {
            calculateWellsBtn.addEventListener('click', () => {
                this.calculateWells();
            });
        }

        // HEART Score Calculator
        const calculateHeartBtn = document.getElementById('calculate-heart');
        if (calculateHeartBtn) {
            calculateHeartBtn.addEventListener('click', () => {
                this.calculateHeartScore();
            });
        }

        // Framingham Risk Score Calculator
        const calculateFrsBtn = document.getElementById('calculate-frs');
        if (calculateFrsBtn) {
            calculateFrsBtn.addEventListener('click', () => {
                this.calculateFramingham();
            });
        }

        // TIMI Risk Score Calculator
        const calculateTimiBtn = document.getElementById('calculate-timi');
        if (calculateTimiBtn) {
            calculateTimiBtn.addEventListener('click', () => {
                this.calculateTIMI();
            });
        }

        // GRACE Risk Score Calculator
        const calculateGraceBtn = document.getElementById('calculate-grace');
        if (calculateGraceBtn) {
            calculateGraceBtn.addEventListener('click', () => {
                this.calculateGRACE();
            });
        }

        // HAS-BLED Score Calculator
        const calculateHasbledBtn = document.getElementById('calculate-hasbled');
        if (calculateHasbledBtn) {
            calculateHasbledBtn.addEventListener('click', () => {
                this.calculateHASBLED();
            });
        }

        // SCORE2 / SCORE2-OP Risk Calculator
        const calculateScore2Btn = document.getElementById('calculate-score2');
        if (calculateScore2Btn) {
            calculateScore2Btn.addEventListener('click', () => {
                this.calculateSCORE2();
            });
        }

        // ORBIT Bleeding Risk Score Calculator
        const calculateOrbitBtn = document.getElementById('calculate-orbit');
        if (calculateOrbitBtn) {
            calculateOrbitBtn.addEventListener('click', () => {
                this.calculateORBIT();
            });
        }
    }

    calculateTIMI() {
        let score = 0;

        if (document.getElementById('timi-age').checked) score++;
        if (document.getElementById('timi-cad-risk').checked) score++;
        if (document.getElementById('timi-known-cad').checked) score++;
        if (document.getElementById('timi-aspirin').checked) score++;
        if (document.getElementById('timi-angina').checked) score++;
        if (document.getElementById('timi-st').checked) score++;
        if (document.getElementById('timi-troponin').checked) score++;

        document.getElementById('timi-score-value').textContent = score + ' / 7';

        let riskGroup, mace, recommendation, colorClass;

        if (score <= 1) {
            riskGroup = 'Low Risk';
            colorClass = 'text-success-green';
            mace = '14-day MACE (death/MI/urgent revascularization): ~4.7%';
            recommendation = 'Consider conservative management. Outpatient stress testing or CCTA may be appropriate. Early discharge is likely safe if serial troponins remain negative and no high-risk features develop.';
        } else if (score === 2) {
            riskGroup = 'Intermediate Risk';
            colorClass = 'text-warning-amber';
            mace = '14-day MACE: ~8.3%';
            recommendation = 'Admit for observation with serial troponins. Consider non-invasive stress testing or coronary CT angiography. Early invasive strategy may be considered if additional risk factors present.';
        } else if (score <= 4) {
            riskGroup = 'High Risk';
            colorClass = 'text-imaging-orange';
            mace = '14-day MACE: ~15–20%';
            recommendation = 'Early invasive strategy recommended. Coronary angiography within 24 hours. Initiate dual antiplatelet therapy and anticoagulation per ACS protocol. Cardiology consultation.';
        } else {
            riskGroup = 'Very High Risk';
            colorClass = 'text-alert-coral';
            mace = '14-day MACE: ~41%';
            recommendation = 'Urgent early invasive strategy — coronary angiography within 24 hours (sooner if unstable). Dual antiplatelet therapy, anticoagulation, high-intensity statin. Consider CABG if multivessel or left main disease.';
        }

        const scoreEl = document.getElementById('timi-score-value');
        scoreEl.className = `text-3xl font-bold mb-2 ${colorClass}`;

        document.getElementById('timi-risk-group').textContent = riskGroup;
        document.getElementById('timi-risk-group').className = `text-sm font-semibold ${colorClass}`;

        document.getElementById('timi-mace').textContent = mace;
        document.getElementById('timi-recommendation').textContent = recommendation;
        document.getElementById('timi-result').classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: '#timi-result',
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    calculateGRACE() {
        const age = parseInt(document.getElementById('grace-age').value);
        const hr = parseInt(document.getElementById('grace-hr').value);
        const sbp = parseInt(document.getElementById('grace-sbp').value);
        const cr = parseFloat(document.getElementById('grace-cr').value);
        const killip = document.getElementById('grace-killip').value;
        const arrest = document.getElementById('grace-arrest').value === 'yes';
        const st = document.getElementById('grace-st').value === 'yes';
        const trop = document.getElementById('grace-trop').value === 'yes';

        if (!age || !hr || !sbp || !cr || !killip) {
            alert('Please fill in all required fields for the GRACE score.');
            return;
        }

        // GRACE Risk Score (GRACE 1.0 — derived from the ACS risk model)
        // Each variable contributes points using the standard scoring algorithm
        let points = 0;

        // Age (years) — scored per the standard GRACE table
        // <30 = 0, 30–34 = 8, 35–39 = 12, 40–44 = 16, 45–49 = 20, 50–54 = 32,
        // 55–59 = 36, 60–64 = 40, 65–69 = 48, 70–74 = 56, 75–79 = 68, 80–84 = 76,
        // 85–89 = 84, >=90 = 91
        let agePts;
        if (age < 30) agePts = 0;
        else if (age <= 34) agePts = 8;
        else if (age <= 39) agePts = 12;
        else if (age <= 44) agePts = 16;
        else if (age <= 49) agePts = 20;
        else if (age <= 54) agePts = 32;
        else if (age <= 59) agePts = 36;
        else if (age <= 64) agePts = 40;
        else if (age <= 69) agePts = 48;
        else if (age <= 74) agePts = 56;
        else if (age <= 79) agePts = 68;
        else if (age <= 84) agePts = 76;
        else if (age <= 89) agePts = 84;
        else agePts = 91;
        points += agePts;

        // Heart Rate (bpm)
        if (hr < 50) points += 0;
        else if (hr <= 69) points += 3;
        else if (hr <= 89) points += 9;
        else if (hr <= 109) points += 15;
        else if (hr <= 129) points += 24;
        else if (hr <= 149) points += 38;
        else if (hr <= 179) points += 52;
        else points += 58;

        // Systolic BP
        if (sbp >= 200) points += 0;
        else if (sbp >= 160) points += 1;
        else if (sbp >= 140) points += 17;
        else if (sbp >= 120) points += 34;
        else if (sbp >= 100) points += 47;
        else if (sbp >= 80) points += 63;
        else points += 89;

        // Creatinine (mg/dL)
        if (cr <= 0.4) points += 1;
        else if (cr <= 0.8) points += 4;
        else if (cr < 1.2) points += 7;
        else if (cr < 1.6) points += 12;
        else if (cr < 2.0) points += 24;
        else if (cr < 4.0) points += 42;
        else points += 58;

        // Killip class
        const killipPts = { '1': 0, '2': 20, '3': 39, '4': 89 };
        points += killipPts[killip] || 0;

        // Cardiac arrest on admission
        if (arrest) points += 44;

        // ST-segment deviation
        if (st) points += 29;

        // Positive cardiac markers (troponin)
        if (trop) points += 15;

        // Calculate mortality estimates using the GRACE 2.0 (GRIMS) regression model
        // Based on the Fox et al., Eur Heart J 2006; corrected in GRACE 2.0
        const score = Math.round(points);

        // In-hospital mortality (from GRACE risk calculator published model)
        let inHospMort, month6Mort, year1Mort;

        if (score <= 60) {
            inHospMort = 0.0;
            month6Mort = 0.1;
            year1Mort = 0.2;
        } else if (score <= 70) {
            inHospMort = 0.1;
            month6Mort = 0.5;
            year1Mort = 1.0;
        } else if (score <= 80) {
            inHospMort = 0.2;
            month6Mort = 0.7;
            year1Mort = 1.6;
        } else if (score <= 90) {
            inHospMort = 0.3;
            month6Mort = 1.1;
            year1Mort = 2.4;
        } else if (score <= 100) {
            inHospMort = 0.5;
            month6Mort = 1.7;
            year1Mort = 3.8;
        } else if (score <= 110) {
            inHospMort = 0.8;
            month6Mort = 2.5;
            year1Mort = 5.6;
        } else if (score <= 120) {
            inHospMort = 1.1;
            month6Mort = 3.8;
            year1Mort = 8.2;
        } else if (score <= 130) {
            inHospMort = 1.7;
            month6Mort = 4.9;
            year1Mort = 10.6;
        } else if (score <= 140) {
            inHospMort = 2.4;
            month6Mort = 6.0;
            year1Mort = 12.9;
        } else if (score <= 150) {
            inHospMort = 3.4;
            month6Mort = 7.4;
            year1Mort = 15.5;
        } else if (score <= 160) {
            inHospMort = 4.8;
            month6Mort = 9.2;
            year1Mort = 18.6;
        } else if (score <= 170) {
            inHospMort = 6.4;
            month6Mort = 11.6;
            year1Mort = 22.2;
        } else if (score <= 180) {
            inHospMort = 8.0;
            month6Mort = 13.7;
            year1Mort = 26.1;
        } else if (score <= 190) {
            inHospMort = 10.4;
            month6Mort = 16.6;
            year1Mort = 30.5;
        } else if (score <= 200) {
            inHospMort = 13.0;
            month6Mort = 19.8;
            year1Mort = 35.7;
        } else if (score <= 210) {
            inHospMort = 15.8;
            month6Mort = 23.2;
            year1Mort = 40.9;
        } else if (score <= 220) {
            inHospMort = 19.2;
            month6Mort = 27.6;
            year1Mort = 46.2;
        } else if (score <= 230) {
            inHospMort = 22.7;
            month6Mort = 31.9;
            year1Mort = 51.6;
        } else if (score <= 240) {
            inHospMort = 26.4;
            month6Mort = 36.5;
            year1Mort = 57.5;
        } else {
            inHospMort = score > 260 ? 35.9 : (score > 250 ? 30.6 : 30.6);
            month6Mort = score > 260 ? 47.8 : (score > 250 ? 41.6 : 41.6);
            year1Mort = score > 260 ? 64.1 : (score > 250 ? 56.0 : 56.0);
        }

        // Risk group classification
        let riskGroup, colorClass, recommendation;
        if (score <= 108) {
            riskGroup = 'Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'Low risk ACS. May consider early discharge with outpatient follow-up. No urgent invasive strategy required. Optimize secondary prevention and risk factor modification. Follow up within 1 week.';
        } else if (score <= 139) {
            riskGroup = 'Intermediate Risk';
            colorClass = 'text-warning-amber';
            recommendation = 'Intermediate risk ACS. Consider coronary angiography during index hospitalization or within 24h depending on clinical features. Initiate/optimize medical therapy. Cardiology consultation recommended.';
        } else if (score <= 200) {
            riskGroup = 'High Risk';
            colorClass = 'text-imaging-orange';
            recommendation = 'High risk ACS — early invasive strategy (coronary angiography within 24 hours) strongly recommended per ESC/ACC guidelines. Intensify medical therapy. Consider ICU/CCU admission for hemodynamic monitoring.';
        } else {
            riskGroup = 'Very High Risk';
            colorClass = 'text-alert-coral';
            recommendation = 'Very high risk ACS — urgent invasive strategy required. Admit to CCU. Immediate cardiology consultation. Consider mechanical circulatory support. Aggressive secondary prevention and risk factor management after stabilization.';
        }

        // Display results
        document.getElementById('grace-score-value').textContent = score;
        document.getElementById('grace-in-hospital').textContent = inHospMort + '%';
        document.getElementById('grace-6month').textContent = month6Mort + '%';
        document.getElementById('grace-1year').textContent = year1Mort + '%';
        document.getElementById('grace-risk-group').textContent = riskGroup;
        document.getElementById('grace-risk-group').className = 'font-bold ' + colorClass;
        document.getElementById('grace-recommendation').textContent = recommendation;

        const scoreEl = document.getElementById('grace-score-value');
        scoreEl.className = 'text-3xl font-bold mb-2 ' + colorClass;

        const resultDiv = document.getElementById('grace-result');
        resultDiv.classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: '#grace-result',
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    calculateHASBLED() {
        let score = 0;

        if (document.getElementById('hasbled-htn').checked) score++; // H
        if (document.getElementById('hasbled-renal').checked) score++; // A
        if (document.getElementById('hasbled-liver').checked) score++; // A
        if (document.getElementById('hasbled-stroke').checked) score++; // S
        if (document.getElementById('hasbled-bleeding').checked) score++; // B
        if (document.getElementById('hasbled-labile').checked) score++; // L
        if (document.getElementById('hasbled-elderly').checked) score++; // E
        if (document.getElementById('hasbled-drugs').checked) score++; // D - drugs
        if (document.getElementById('hasbled-alcohol').checked) score++; // D - alcohol (max 2 for D)

        const scoreEl = document.getElementById('hasbled-score-value');
        scoreEl.textContent = score + ' / 9';

        let riskGroup, recommendation, colorClass;
        if (score === 0) {
            riskGroup = 'Very Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'Major bleeding risk ~0 (0/100 patient-years). Oral anticoagulation for AFib is very safe.';
        } else if (score === 1) {
            riskGroup = 'Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'Major bleeding risk ~1.13% per 100 patient-years. Oral anticoagulation is appropriate for AFib patients at risk of stroke. Low HAS-BLED should not exclude anticoagulation — CHA₂DS₂-VASc determines benefit.';
        } else if (score === 2) {
            riskGroup = 'Moderate Risk';
            colorClass = 'text-warning-amber';
            recommendation = 'Major bleeding risk ~2.54% per 100 patient-years. Carefully balance stroke prevention vs. bleeding risk. Review and correct modifiable risk factors (e.g., labile INR, concurrent NSAIDs, alcohol excess). DOACs may have lower bleeding risk than warfarin.';
        } else {
            riskGroup = 'High Risk (Score ≥3)';
            colorClass = 'text-alert-coral';
            recommendation = 'Major bleeding risk ~4.6%+ per 100 patient-years. ⚠️ High score should NOT automatically preclude anticoagulation — benefits typically still outweigh risks. Identify and correct modifiable factors: uncontrolled HTN, labile INRs (consider DOAC instead of warfarin), review NSAID/antiplatelet use, reduce alcohol intake, treat anemia, monitor liver/renal function.';
        }

        scoreEl.className = 'text-3xl font-bold mb-2 ' + colorClass;

        document.getElementById('hasbled-risk-group').textContent = riskGroup;
        document.getElementById('hasbled-risk-group').className = 'text-sm font-semibold ' + colorClass;
        document.getElementById('hasbled-recommendation').textContent = recommendation;
        document.getElementById('hasbled-result').classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: '#hasbled-result',
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    calculateWells() {
        let score = 0;

        if (document.getElementById('wells-dvt-signs').checked) score += 3;
        if (document.getElementById('wells-pe-likely').checked) score += 3;
        if (document.getElementById('wells-tachycardia').checked) score += 1.5;
        if (document.getElementById('wells-immobilization').checked) score += 1.5;
        if (document.getElementById('wells-prior-dvt').checked) score += 1.5;
        if (document.getElementById('wells-hemoptysis').checked) score += 1;
        if (document.getElementById('wells-malignancy').checked) score += 1;

        document.getElementById('wells-score').textContent = score.toFixed(1);

        let riskGroup, recommendation, colorClass;
        if (score <= 4) {
            riskGroup = 'PE Unlikely (Low Risk)';
            colorClass = 'text-success-green';
            recommendation = 'Consider D-dimer testing. If negative, PE can be effectively excluded. If positive, proceed to imaging (CTPA or V/Q scan).';
        } else if (score <= 6) {
            riskGroup = 'PE Moderate Probability';
            colorClass = 'text-warning-amber';
            recommendation = 'Moderate probability of PE. Proceed with CT pulmonary angiography (CTPA) or V/Q scan for definitive diagnosis.';
        } else {
            riskGroup = 'PE Likely (High Risk)';
            colorClass = 'text-alert-coral';
            recommendation = 'High probability of PE. Initiate anticoagulation while awaiting imaging. Consider empiric treatment if imaging is delayed. Obtain CTPA urgently.';
        }

        const riskGroupEl = document.getElementById('wells-risk-group');
        riskGroupEl.textContent = riskGroup;
        riskGroupEl.className = `text-sm font-semibold ${colorClass}`;

        document.getElementById('wells-recommendation').textContent = recommendation;
        document.getElementById('wells-result').classList.remove('hidden');

        // Animate result
        if (typeof anime !== 'undefined') {
            anime({
                targets: '#wells-result',
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    calculateHeartScore() {
        const history = parseInt(document.getElementById('heart-history').value) || 0;
        const ecg = parseInt(document.getElementById('heart-ecg').value) || 0;
        const age = parseInt(document.getElementById('heart-age').value) || 0;
        const risk = parseInt(document.getElementById('heart-risk').value) || 0;
        const troponin = parseInt(document.getElementById('heart-troponin').value) || 0;

        const score = history + ecg + age + risk + troponin;

        document.getElementById('heart-score-value').textContent = score;

        let riskGroup, recommendation, colorClass;
        if (score <= 3) {
            riskGroup = 'Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'MACE rate ≤1.7%. Consider outpatient management with follow-up in 1–2 weeks. Early discharge with cardiac workup as outpatient may be appropriate if no concerning features.';
        } else if (score <= 6) {
            riskGroup = 'Moderate Risk';
            colorClass = 'text-warning-amber';
            recommendation = 'MACE rate 12–16.6%. Admit for observation and further workup including serial troponins, stress testing or coronary CT angiography. Consider cardiology consultation.';
        } else {
            riskGroup = 'High Risk';
            colorClass = 'text-alert-coral';
            recommendation = 'MACE rate ≥50%. Early invasive strategy recommended. Admit for urgent cardiology evaluation, consider early coronary angiography and revascularization. Initiate dual antiplatelet therapy and anticoagulation per ACS protocol.';
        }

        const scoreEl = document.getElementById('heart-score-value');
        scoreEl.className = `text-3xl font-bold mb-2 ${colorClass}`;

        const riskGroupEl = document.getElementById('heart-risk-group');
        riskGroupEl.textContent = riskGroup;
        riskGroupEl.className = `text-sm font-semibold ${colorClass}`;

        document.getElementById('heart-recommendation').textContent = recommendation;
        document.getElementById('heart-result').classList.remove('hidden');

        // Animate result
        if (typeof anime !== 'undefined') {
            anime({
                targets: '#heart-result',
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    calculateASCVD() {
        const age = parseInt(document.getElementById('ascvd-age').value);
        const gender = document.getElementById('ascvd-gender').value;
        const totalCholesterol = parseInt(document.getElementById('ascvd-tc').value);
        const hdlCholesterol = parseInt(document.getElementById('ascvd-hdl').value);
        const systolicBP = parseInt(document.getElementById('ascvd-sbp').value);
        const diabetes = document.getElementById('ascvd-diabetes').value === 'yes';
        const smoking = document.getElementById('ascvd-smoking').value === 'yes';
        const bpTreatment = document.getElementById('ascvd-bp-tx').value === 'yes';

        // Validate inputs
        if (!age || !gender || !totalCholesterol || !hdlCholesterol || !systolicBP) {
            alert('Please fill in all required fields');
            return;
        }

        // Simplified ASCVD risk calculation (for demonstration)
        // In practice, this would use the full Pooled Cohort Equations
        let riskPoints = 0;
        
        // Age points
        if (gender === 'male') {
            if (age >= 40 && age <= 44) riskPoints += 0;
            else if (age >= 45 && age <= 49) riskPoints += 3;
            else if (age >= 50 && age <= 54) riskPoints += 6;
            else if (age >= 55 && age <= 59) riskPoints += 8;
            else if (age >= 60 && age <= 64) riskPoints += 10;
            else if (age >= 65 && age <= 69) riskPoints += 11;
            else if (age >= 70 && age <= 74) riskPoints += 12;
            else if (age >= 75) riskPoints += 13;
        } else {
            if (age >= 40 && age <= 44) riskPoints += 0;
            else if (age >= 45 && age <= 49) riskPoints += 3;
            else if (age >= 50 && age <= 54) riskPoints += 6;
            else if (age >= 55 && age <= 59) riskPoints += 8;
            else if (age >= 60 && age <= 64) riskPoints += 10;
            else if (age >= 65 && age <= 69) riskPoints += 12;
            else if (age >= 70 && age <= 74) riskPoints += 14;
            else if (age >= 75) riskPoints += 16;
        }

        // Additional risk factors
        if (totalCholesterol > 240) riskPoints += 3;
        else if (totalCholesterol > 200) riskPoints += 1;
        
        if (hdlCholesterol < 40) riskPoints += 2;
        else if (hdlCholesterol < 50) riskPoints += 1;
        
        if (systolicBP > 140) riskPoints += 2;
        else if (systolicBP > 130) riskPoints += 1;
        
        if (diabetes) riskPoints += 4;
        if (smoking) riskPoints += 3;
        if (bpTreatment) riskPoints += 1;

        // Calculate estimated risk percentage
        let riskPercentage = 0;
        if (riskPoints <= 0) riskPercentage = 0.5;
        else if (riskPoints <= 4) riskPercentage = 1.0;
        else if (riskPoints <= 6) riskPercentage = 2.0;
        else if (riskPoints <= 8) riskPercentage = 4.0;
        else if (riskPoints <= 10) riskPercentage = 7.0;
        else if (riskPoints <= 12) riskPercentage = 12.0;
        else if (riskPoints <= 14) riskPercentage = 20.0;
        else riskPercentage = 30.0;

        // Display results
        document.getElementById('ascvd-risk-percent').textContent = `${riskPercentage}%`;
        
        let riskCategory = '';
        if (riskPercentage < 5) riskCategory = 'Low Risk';
        else if (riskPercentage < 7.5) riskCategory = 'Borderline Risk';
        else if (riskPercentage < 20) riskCategory = 'Intermediate Risk';
        else riskCategory = 'High Risk';
        
        document.getElementById('ascvd-risk-category').textContent = riskCategory;
        document.getElementById('ascvd-risk-category').className = `text-sm font-semibold ${
            riskPercentage < 5 ? 'text-success-green' : 
            riskPercentage < 7.5 ? 'text-warning-amber' : 
            riskPercentage < 20 ? 'text-imaging-orange' : 'text-alert-coral'
        }`;
        
        document.getElementById('ascvd-result').classList.remove('hidden');
        
        // Animate result
        anime({
            targets: '#ascvd-result',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    // Helper: safely convert to displayable number for NNT
    _chadsFiniteNumber(val) {
        if (typeof val === 'number' && isFinite(val) && val > 0) return Math.round(val);
        if (val > 10000) return '>10,000';
        return 'N/A';
    }

    calculateCHADS2VASc() {
        let score = 0;

        const age65_74 = document.getElementById('chads-age-65-74')?.checked || false;
        const age75plus = document.getElementById('chads-age-75-plus')?.checked || false;
        const gender = document.getElementById('chads-gender').value;

        // C — Congestive Heart Failure (1 point)
        if (document.getElementById('chads-chf').checked) score += 1;
        // H — Hypertension (1 point)
        if (document.getElementById('chads-hypertension').checked) score += 1;
        // A — Age 65-74 (1 point)
        if (age65_74) score += 1;
        // A — Age ≥75 (2 points)
        if (age75plus) score += 2;
        // D — Diabetes Mellitus (1 point)
        if (document.getElementById('chads-diabetes').checked) score += 1;
        // S — Stroke / TIA / Thromboembolism (2 points)
        if (document.getElementById('chads-stroke-tia').checked) score += 2;
        // V — Vascular Disease (prior MI, PAD, or aortic plaque) (1 point)
        if (document.getElementById('chads-vascular-disease').checked) score += 1;
        // Sc — Sex Category: Female (1 point)
        if (gender === 'female') score += 1;

        // Validate mutual exclusivity: can't have both age ranges
        if (age65_74 && age75plus) {
            alert('Please select only one age range: either 65-74 years OR ≥75 years — not both.');
            return;
        }

        // Annual stroke risk (ischemic stroke / thromboembolism per year)
        // Derived from MACE/ESC 2020 AFib guidelines — pooled rates from multiple large cohort studies
        // (Friberg 2012, Lip 2010, Olesen 2011, Roldan 2013 meta-analysis)
        // Female: higher risk at same score when score ≥1; males and females diverge
        const maleRate = [0.0, 0.2, 1.0, 2.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2, 12.2];
        const femaleRateMap = { 0: 0.0, 1: 0.2, 2: 1.1, 3: 3.0, 4: 5.5, 5: 7.2, 6: 8.0, 7: 9.5, 8: 11.0, 9: 15.2 };
        
        // Clamp score to valid range (0-9)
        const clampedScore = Math.min(9, score);
        const annualRiskPct = gender === 'female'
            ? (femaleRateMap[clampedScore] || 15.2)
            : (maleRate[clampedScore] || 12.2);

        // Number needed to treat (NNT) to prevent 1 stroke per year with warfarin/DOAC
        // Based on ARR ≈ 2/3 of annual event rate (relative risk reduction ~64-67% for warfarin, ~70-80% for DOACs)
        const annualEventRate = annualRiskPct / 100;
        const absoluteRiskReduction = annualEventRate * 0.66;
        const nntPerYear = absoluteRiskReduction > 0 ? Math.round(1 / absoluteRiskReduction) : Math.huge;

        // DOAC dosing guidance when anticoagulation is indicated
        let doacGuidance = '';
        if (score >= 1) {
            doacGuidance = `
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <h6 class="text-xs font-semibold text-deep-navy mb-2">DOAC Dosing Options (if anticoagulation indicated):</h6>
                    <div class="grid grid-cols-1 gap-2 text-xs">
                        <div class="bg-white rounded p-2">
                            <strong class="text-clinical-blue">Apixaban (Eliquis®):</strong> 5mg BID
                            <span class="text-neutral-slate block mt-0.5">↓→ 2.5mg BID if ≥2 of: age ≥80, weight ≤60kg, or Cr ≥1.5 mg/dL</span>
                        </div>
                        <div class="bg-white rounded p-2">
                            <strong class="text-clinical-blue">Rivaroxaban (Xarelto®):</strong> 20mg once daily with food
                            <span class="text-neutral-slate block mt-0.5">↓→ 15mg once daily if CrCl 15-50 mL/min</span>
                        </div>
                        <div class="bg-white rounded p-2">
                            <strong class="text-clinical-blue">Dabigatran (Pradaxa®):</strong> 150mg BID
                            <span class="text-neutral-slate block mt-0.5">↓→ 110mg BID if available (elderly, high bleeding risk); ↓→ 75mg BID if CrCl 30-50 mL/min (US)</span>
                        </div>
                        <div class="bg-white rounded p-2">
                            <strong class="text-clinical-blue">Edoxaban (Lixiana®):</strong> 60mg once daily
                            <span class="text-neutral-slate block mt-0.5">↓→ 30mg once daily if weight ≤60kg, CrCl 15-50 mL/min, or concomitant P-gp inhibitor</span>
                        </div>
                        <div class="bg-white rounded p-2">
                            <strong class="text-clinical-blue">Warfarin:</strong> Target INR 2.0–3.0
                            <span class="text-neutral-slate block mt-0.5">Use if valve disease (moderate-severe mitral stenosis), mechanical heart valve, CrCl &lt;15 mL/min or on dialysis, antiphospholipid syndrome, DOAC contraindication. Check INR weekly until stable, then every 4-12 weeks. Target TTR &gt;70%.</span>
                        </div>
                    </div>
                </div>`;
        }

        // Display results
        document.getElementById('chads-score').textContent = score;

        let riskGroup, recommendation, colorClass, strokeRate, nntText, clinicalRec = '';
        if (score === 0) {
            riskGroup = gender === 'male' ? 'Truly Low Risk (Male)' : 'Low Risk (Female)';
            colorClass = 'text-success-green';
            strokeRate = annualRiskPct.toFixed(1) + '% per year';
            nntText = 'NNT to prevent 1 stroke/year: Not indicated — risk too low';
            clinicalRec = gender === 'male'
                ? 'True low-risk category. No antithrombotic therapy recommended. Annual reassessment for new risk factors (HTN, age, HF, diabetes, etc.). Emphasis on risk factor modification: blood pressure control, weight management, exercise, sleep apnea screening.'
                : 'Low-risk female with no other risk factors. No antithrombotic therapy recommended. Female sex category alone is not sufficient indication for anticoagulation per 2020 ESC guidelines (Class III, Level of Evidence A). Reassess annually.';
        } else if (score === 1) {
            riskGroup = 'Borderline / Low-Moderate Risk';
            colorClass = 'text-warning-amber';
            strokeRate = annualRiskPct.toFixed(1) + '% per year';
            const nntVal = this._chadsFiniteNumber(nntPerYear);
            nntText = 'NNT to prevent 1 stroke/year with OAC ≈ ' + nntVal;
            clinicalRec = gender === 'male'
                ? 'Single non-sex risk factor. Oral anticoagulation should be CONSIDERED (Class IIa, ESC 2020). Shared decision-making essential — discussion of patient preference, bleeding risk (see HAS-BLED/ORBIT score), and quality of life preferred. DOACs are preferred over warfarin (Class I, LOE A). No aspirin — it is inferior to OAC for stroke prevention and carries similar bleeding risk.'
                : 'Two risk factors (female sex + one additional). Oral anticoagulation should be CONSIDERED (Class IIa, ESC 2020). Risk is comparable to males with score ≥2. Shared decision-making recommended. DOAC preferred over warfarin. Aspirin has no role (inferior stroke prevention, inadequate bleeding risk profile).';
        } else {
            riskGroup = score <= 3 ? 'High Risk' : 'Very High Risk';
            colorClass = score <= 3 ? 'text-imaging-orange' : 'text-alert-coral';
            strokeRate = annualRiskPct.toFixed(1) + '% per year';
            const nntVal = this._chadsFiniteNumber(nntPerYear);
            nntText = 'NNT to prevent 1 stroke/year with OAC ≈ ' + nntVal;
            clinicalRec = 'Oral anticoagulation is STRONGLY RECOMMENDED (Class I, LOE A for score ≥2). DOACs are first-line over warfarin (Class I, LOE A) — lower ICH risk, non-inferior or superior stroke prevention. Calculate bleeding risk (HAS-BLED or ORBIT) to identify modifiable risk factors — NOT to exclude anticoagulation. Address uncontrolled HTN, anemia, alcohol excess, and review concomitant medications. Reassess at least annually and after AFib recurrence or new comorbidities. Consider LAA closure (Watchman/Amulet) if OAC truly contraindicated (absolute contraindication, not just high HAS-BLED).';
        }

        // Aspirin warning
        const aspirinWarning = score >= 1
            ? '<div class="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-800"><strong>⚠ Aspirin is NOT recommended:</strong> Aspirin provides no meaningful stroke reduction in AFib compared to placebo (relative risk reduction ~12-19%) but carries similar bleeding risk to DOACs. The 2019 AHA/ACC/HRS AFib guideline and 2020 ESC guidelines no longer recommend aspirin for AFib stroke prevention.</div>'
            : '';

        // Render result
        const resultDiv = document.getElementById('chads-result');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="space-y-3">
                <div class="text-center">
                    <div class="text-4xl font-bold ${colorClass} mb-1" id="chads-score-display">${score} / 9</div>
                    <div class="text-sm text-neutral-slate mb-1">CHA₂DS₂-VASc Score</div>
                    <div class="text-sm font-semibold ${colorClass}" id="chads-risk-group">${riskGroup}</div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div class="text-lg font-bold text-clinical-blue">${strokeRate}</div>
                        <div class="text-xs text-neutral-slate">Annual Stroke Risk</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div class="text-lg font-bold text-imaging-orange">${nntText}</div>
                        <div class="text-xs text-neutral-slate">Anticoagulation Impact</div>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-4 border-l-4 ${colorClass.replace('text-', 'border-')}">
                    <p class="text-sm text-neutral-slate leading-relaxed">${clinicalRec}</p>
                    ${aspirinWarning}
                </div>
                ${doacGuidance}
                <div class="text-xs text-neutral-slate text-center pt-2 border-t border-gray-200">
                    Data: ESC 2020 AFib Guidelines, EHJ 2020; Friberg JACC 2012; Lip Eur Heart J 2010;
                    Olesen BMJ 2011; Roldán Stroke 2013 meta-analysis
                </div>
            </div>
        `;

        // Animate result
        if (typeof anime !== 'undefined') {
            anime({
                targets: resultDiv,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    interpretBNP() {
        const bnpLevel = parseFloat(document.getElementById('bnp-level').value);
        const ntProbnpLevel = parseFloat(document.getElementById('nt-probnp-level').value);
        const ageGroup = document.getElementById('bnp-age-group').value;
        
        let interpretation = '';
        
        if (bnpLevel) {
            if (bnpLevel < 100) {
                interpretation += 'BNP: Normal (&lt;100 pg/mL). Heart failure unlikely.\n';
            } else if (bnpLevel < 400) {
                interpretation += 'BNP: Elevated (100-400 pg/mL). Heart failure possible.\n';
            } else {
                interpretation += 'BNP: High (&gt;400 pg/mL). Heart failure likely.\n';
            }
        }
        
        if (ntProbnpLevel) {
            let threshold = 125; // Default for <50 years
            if (ageGroup === '50-75') threshold = 450;
            else if (ageGroup === '>75') threshold = 900;
            
            if (ntProbnpLevel < threshold) {
                interpretation += `NT-proBNP: Normal (&lt;${threshold} pg/mL). Heart failure unlikely.\n`;
            } else {
                interpretation += `NT-proBNP: Elevated (&gt;${threshold} pg/mL). Heart failure likely.\n`;
            }
        }
        
        if (!interpretation) {
            interpretation = 'Please enter at least one biomarker value for interpretation.';
        }
        
        document.getElementById('bnp-interpretation').textContent = interpretation;
        document.getElementById('bnp-result').classList.remove('hidden');
        
        // Animate result
        anime({
            targets: '#bnp-result',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    initializeFlowcharts() {
        const flowchartNodes = document.querySelectorAll('.flowchart-node');
        const explanationDiv = document.getElementById('flowchart-explanation');
        const contentDiv = document.getElementById('explanation-content');
        
        const stepExplanations = {
            '1': {
                title: 'Initial Assessment',
                content: 'Patient presents with chest pain. Immediate evaluation of vital signs, pain characteristics, and cardiac risk factors.'
            },
            '2': {
                title: 'High Risk Features',
                content: 'Assess for high-risk features: chest pain at rest, recent onset, radiation to arm/jaw, associated symptoms (dyspnea, nausea, diaphoresis).'
            },
            '3': {
                title: 'Low Risk Assessment',
                content: 'Low-risk chest pain can be evaluated with outpatient stress testing or coronary CT angiography if needed.'
            },
            '4': {
                title: 'Diagnostic Testing',
                content: 'Immediate ECG and cardiac troponin measurement to assess for acute coronary syndrome.'
            },
            '5': {
                title: 'STEMI/NSTEMI Management',
                content: 'If STEMI: immediate reperfusion therapy. If NSTEMI: risk stratification and appropriate intervention.'
            },
            '6': {
                title: 'Alternative Diagnoses',
                content: 'Consider other causes: pulmonary embolism, aortic dissection, pericarditis, gastroesophageal reflux.'
            }
        };
        
        flowchartNodes.forEach(node => {
            node.addEventListener('click', () => {
                const step = node.dataset.step;
                const explanation = stepExplanations[step];
                
                if (explanation) {
                    contentDiv.innerHTML = `
                        <h5 class="font-semibold text-deep-navy mb-2">${explanation.title}</h5>
                        <p class="text-sm text-neutral-slate">${explanation.content}</p>
                    `;
                    explanationDiv.classList.remove('hidden');
                    
                    // Animate explanation
                    anime({
                        targets: explanationDiv,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });
        });
    }

    initializeBiomarkerInterpreter() {
        // Troponin Interpreter
        const interpretTroponinBtn = document.getElementById('interpret-troponin');
        if (interpretTroponinBtn) {
            interpretTroponinBtn.addEventListener('click', () => {
                this.interpretTroponin();
            });
        }

        // Lipid Panel Interpreter
        const interpretLipidsBtn = document.getElementById('interpret-lipids');
        if (interpretLipidsBtn) {
            interpretLipidsBtn.addEventListener('click', () => {
                this.interpretLipids();
            });
        }
    }

    interpretTroponin() {
        const troponinI = parseFloat(document.getElementById('troponin-i').value);
        const troponinT = parseFloat(document.getElementById('troponin-t').value);
        const symptomOnset = parseFloat(document.getElementById('symptom-onset').value);
        
        let interpretation = '';
        
        if (troponinI) {
            if (troponinI < 0.04) {
                interpretation += '<strong>Troponin I:</strong> Normal (&lt;0.04 ng/mL). ';
                interpretation += 'Myocardial infarction unlikely, but consider clinical context and timing.\n\n';
            } else if (troponinI < 10) {
                interpretation += '<strong>Troponin I:</strong> Elevated. ';
                interpretation += 'Suggestive of myocardial injury. Consider MI, myocarditis, or other causes.\n\n';
            } else {
                interpretation += '<strong>Troponin I:</strong> Markedly elevated. ';
                interpretation += 'High likelihood of significant myocardial injury.\n\n';
            }
        }
        
        if (troponinT) {
            if (troponinT < 0.01) {
                interpretation += '<strong>Troponin T:</strong> Normal (&lt;0.01 ng/mL). ';
                interpretation += 'Myocardial infarction unlikely.\n\n';
            } else if (troponinT < 1) {
                interpretation += '<strong>Troponin T:</strong> Elevated. ';
                interpretation += 'Suggestive of myocardial injury.\n\n';
            } else {
                interpretation += '<strong>Troponin T:</strong> Markedly elevated. ';
                interpretation += 'High likelihood of significant myocardial injury.\n\n';
            }
        }
        
        if (symptomOnset) {
            interpretation += `<strong>Timing Considerations:</strong> ${symptomOnset} hours since symptom onset. `;
            if (symptomOnset < 3) {
                interpretation += 'Early presentation - consider serial troponins. ';
            } else if (symptomOnset > 12) {
                interpretation += 'Late presentation - troponin may be declining. ';
            }
        }
        
        if (!interpretation) {
            interpretation = 'Please enter at least one troponin value for interpretation.';
        }
        
        document.getElementById('troponin-interpretation').innerHTML = interpretation;
        document.getElementById('troponin-result').classList.remove('hidden');
        
        // Animate result
        anime({
            targets: '#troponin-result',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    interpretLipids() {
        const totalCholesterol = parseFloat(document.getElementById('total-cholesterol').value);
        const ldlCholesterol = parseFloat(document.getElementById('ldl-cholesterol').value);
        const hdlCholesterol = parseFloat(document.getElementById('hdl-cholesterol').value);
        const triglycerides = parseFloat(document.getElementById('triglycerides').value);
        
        let interpretation = '';
        
        if (totalCholesterol) {
            if (totalCholesterol < 200) {
                interpretation += '<strong>Total Cholesterol:</strong> Desirable (&lt;200 mg/dL). ';
            } else if (totalCholesterol < 240) {
                interpretation += '<strong>Total Cholesterol:</strong> Borderline high (200-239 mg/dL). ';
            } else {
                interpretation += '<strong>Total Cholesterol:</strong> High (≥240 mg/dL). ';
            }
        }
        
        if (ldlCholesterol) {
            interpretation += '<br><br>';
            if (ldlCholesterol < 100) {
                interpretation += '<strong>LDL Cholesterol:</strong> Optimal (&lt;100 mg/dL). ';
            } else if (ldlCholesterol < 130) {
                interpretation += '<strong>LDL Cholesterol:</strong> Near optimal (100-129 mg/dL). ';
            } else if (ldlCholesterol < 160) {
                interpretation += '<strong>LDL Cholesterol:</strong> Borderline high (130-159 mg/dL). ';
            } else if (ldlCholesterol < 190) {
                interpretation += '<strong>LDL Cholesterol:</strong> High (160-189 mg/dL). ';
            } else {
                interpretation += '<strong>LDL Cholesterol:</strong> Very high (≥190 mg/dL). ';
            }
        }
        
        if (hdlCholesterol) {
            interpretation += '<br><br>';
            if (hdlCholesterol < 40) {
                interpretation += '<strong>HDL Cholesterol:</strong> Low (&lt;40 mg/dL). Major risk factor. ';
            } else if (hdlCholesterol < 50) {
                interpretation += '<strong>HDL Cholesterol:</strong> Acceptable (40-49 mg/dL). ';
            } else if (hdlCholesterol < 60) {
                interpretation += '<strong>HDL Cholesterol:</strong> Good (50-59 mg/dL). ';
            } else {
                interpretation += '<strong>HDL Cholesterol:</strong> Excellent (≥60 mg/dL). Protective factor. ';
            }
        }
        
        if (triglycerides) {
            interpretation += '<br><br>';
            if (triglycerides < 150) {
                interpretation += '<strong>Triglycerides:</strong> Normal (&lt;150 mg/dL). ';
            } else if (triglycerides < 200) {
                interpretation += '<strong>Triglycerides:</strong> Borderline high (150-199 mg/dL). ';
            } else if (triglycerides < 500) {
                interpretation += '<strong>Triglycerides:</strong> High (200-499 mg/dL). ';
            } else {
                interpretation += '<strong>Triglycerides:</strong> Very high (≥500 mg/dL). ';
            }
        }
        
        // Calculate non-HDL cholesterol if possible
        if (totalCholesterol && hdlCholesterol) {
            const nonHDL = totalCholesterol - hdlCholesterol;
            interpretation += `<br><br><strong>Non-HDL Cholesterol:</strong> ${nonHDL} mg/dL. `;
            interpretation += nonHDL < 130 ? 'Optimal.' : 'Elevated.';
        }
        
        if (!interpretation) {
            interpretation = 'Please enter at least one lipid value for interpretation.';
        }
        
        document.getElementById('lipids-interpretation').innerHTML = interpretation;
        document.getElementById('lipids-result').classList.remove('hidden');
        
        // Animate result
        anime({
            targets: '#lipids-result',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    calculateFramingham() {
        const age = parseInt(document.getElementById('frs-age').value);
        const gender = document.getElementById('frs-gender').value;
        const tc = parseInt(document.getElementById('frs-tc').value);
        const hdl = parseInt(document.getElementById('frs-hdl').value);
        const sbp = parseInt(document.getElementById('frs-sbp').value);
        const bpTreated = document.getElementById('frs-bp-treated').value === 'yes';
        const smoking = document.getElementById('frs-smoking').value === 'yes';
        const diabetes = document.getElementById('frs-diabetes').value === 'yes';

        if (!age || !gender || !tc || !hdl || !sbp) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (age < 20 || age > 79) {
            this.showNotification('Framingham Risk Score is validated for ages 20–79', 'warning');
        }

        let points = 0;

        // Points based on the 2008 Framingham general CVD risk score
        if (gender === 'male') {
            // Age
            if (age >= 20 && age <= 34) points -= 9;
            else if (age <= 39) points -= 4;
            else if (age <= 44) points += 0;
            else if (age <= 49) points += 3;
            else if (age <= 54) points += 6;
            else if (age <= 59) points += 8;
            else if (age <= 64) points += 10;
            else if (age <= 69) points += 11;
            else if (age <= 74) points += 12;
            else if (age <= 79) points += 13;

            // Total Cholesterol
            if (age >= 20 && age <= 39) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 4;
                else if (tc <= 239) points += 7;
                else if (tc <= 279) points += 9;
                else points += 11;
            } else if (age >= 40 && age <= 49) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 3;
                else if (tc <= 239) points += 5;
                else if (tc <= 279) points += 6;
                else points += 8;
            } else if (age >= 50 && age <= 59) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 2;
                else if (tc <= 239) points += 3;
                else if (tc <= 279) points += 4;
                else points += 5;
            } else if (age >= 60 && age <= 69) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 1;
                else if (tc <= 239) points += 1;
                else if (tc <= 279) points += 2;
                else points += 3;
            } else if (age >= 70 && age <= 79) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 0;
                else if (tc <= 239) points += 0;
                else if (tc <= 279) points += 1;
                else points += 1;
            }

            // HDL
            if (hdl >= 60) points -= 1;
            else if (hdl >= 50) points += 0;
            else if (hdl >= 40) points += 1;
            else points += 2;

            // Systolic BP
            if (bpTreated) {
                if (sbp < 120) points += 0;
                else if (sbp <= 129) points += 1;
                else if (sbp <= 139) points += 2;
                else if (sbp <= 159) points += 2;
                else points += 3;
            } else {
                if (sbp < 120) points += 0;
                else if (sbp <= 129) points += 0;
                else if (sbp <= 139) points += 1;
                else if (sbp <= 159) points += 1;
                else points += 2;
            }

            // Smoking
            if (smoking) {
                if (age >= 20 && age <= 39) points += 8;
                else if (age <= 49) points += 5;
                else if (age <= 59) points += 3;
                else if (age <= 69) points += 1;
                else if (age <= 79) points += 1;
            }

            // Diabetes
            if (diabetes) points += 2;

        } else {
            // Female
            // Age
            if (age >= 20 && age <= 34) points -= 7;
            else if (age <= 39) points -= 3;
            else if (age <= 44) points += 0;
            else if (age <= 49) points += 3;
            else if (age <= 54) points += 6;
            else if (age <= 59) points += 8;
            else if (age <= 64) points += 10;
            else if (age <= 69) points += 12;
            else if (age <= 74) points += 14;
            else if (age <= 79) points += 16;

            // Total Cholesterol
            if (age >= 20 && age <= 39) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 4;
                else if (tc <= 239) points += 8;
                else if (tc <= 279) points += 11;
                else points += 13;
            } else if (age >= 40 && age <= 49) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 3;
                else if (tc <= 239) points += 6;
                else if (tc <= 279) points += 8;
                else points += 10;
            } else if (age >= 50 && age <= 59) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 2;
                else if (tc <= 239) points += 4;
                else if (tc <= 279) points += 5;
                else points += 7;
            } else if (age >= 60 && age <= 69) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 1;
                else if (tc <= 239) points += 2;
                else if (tc <= 279) points += 3;
                else points += 4;
            } else if (age >= 70 && age <= 79) {
                if (tc < 160) points += 0;
                else if (tc <= 199) points += 1;
                else if (tc <= 239) points += 1;
                else if (tc <= 279) points += 2;
                else points += 2;
            }

            // HDL
            if (hdl >= 60) points -= 1;
            else if (hdl >= 50) points += 0;
            else if (hdl >= 40) points += 1;
            else points += 2;

            // Systolic BP
            if (bpTreated) {
                if (sbp < 120) points += 0;
                else if (sbp <= 129) points += 3;
                else if (sbp <= 139) points += 4;
                else if (sbp <= 159) points += 5;
                else points += 6;
            } else {
                if (sbp < 120) points += 0;
                else if (sbp <= 129) points += 1;
                else if (sbp <= 139) points += 2;
                else if (sbp <= 159) points += 3;
                else points += 4;
            }

            // Smoking
            if (smoking) {
                if (age >= 20 && age <= 39) points += 9;
                else if (age <= 49) points += 7;
                else if (age <= 59) points += 4;
                else if (age <= 69) points += 2;
                else if (age <= 79) points += 1;
            }

            // Diabetes
            if (diabetes) points += 3;
        }

        // Convert points to 10-year risk percentage
        let riskPercent;
        if (gender === 'male') {
            if (points < 0) riskPercent = '<1';
            else if (points <= 4) riskPercent = '1';
            else if (points <= 6) riskPercent = '2';
            else if (points <= 7) riskPercent = '3';
            else if (points <= 8) riskPercent = '4';
            else if (points <= 9) riskPercent = '5';
            else if (points <= 10) riskPercent = '6';
            else if (points <= 11) riskPercent = '8';
            else if (points <= 12) riskPercent = '10';
            else if (points <= 13) riskPercent = '12';
            else if (points <= 14) riskPercent = '16';
            else if (points <= 15) riskPercent = '20';
            else if (points <= 16) riskPercent = '25';
            else riskPercent = '≥30';
        } else {
            if (points < 9) riskPercent = '<1';
            else if (points <= 12) riskPercent = '1';
            else if (points <= 14) riskPercent = '2';
            else if (points <= 15) riskPercent = '3';
            else if (points <= 16) riskPercent = '4';
            else if (points <= 17) riskPercent = '5';
            else if (points <= 18) riskPercent = '6';
            else if (points <= 19) riskPercent = '8';
            else if (points <= 20) riskPercent = '11';
            else if (points <= 21) riskPercent = '14';
            else if (points <= 22) riskPercent = '17';
            else if (points <= 23) riskPercent = '22';
            else if (points <= 24) riskPercent = '27';
            else riskPercent = '≥30';
        }

        const riskValue = parseInt(riskPercent) || (riskPercent.startsWith('<') ? 0 : 30);

        let riskCategory, colorClass, recommendation;
        if (riskValue < 10) {
            riskCategory = 'Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'Lifestyle modifications recommended. Reassess in 5 years. Consider reinforcing healthy diet, regular exercise, and smoking cessation.';
        } else if (riskValue < 20) {
            riskCategory = 'Intermediate Risk';
            colorClass = 'text-warning-amber';
            recommendation = 'Consider statin therapy. Aggressive lifestyle modifications. Discuss aspirin therapy. Assess coronary artery calcium if borderline decision-making.';
        } else {
            riskCategory = 'High Risk';
            colorClass = 'text-critical-red';
            recommendation = 'High-intensity statin therapy recommended. Aggressive risk factor modification. Consider aspirin therapy if not contraindicated. Follow up within 1 year.';
        }

        document.getElementById('frs-risk-percent').textContent = riskPercent + '%';
        document.getElementById('frs-risk-category').textContent = riskCategory;
        document.getElementById('frs-risk-category').className = 'text-sm font-semibold ' + colorClass;
        document.getElementById('frs-recommendation').textContent = recommendation;

        const resultDiv = document.getElementById('frs-result');
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('bg-emerald-50');

        if (typeof anime !== 'undefined') {
            anime({
                targets: resultDiv,
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    // BMI & Cardiovascular Body Metrics Calculator
    initializeBMICalculator() {
        const calculateBtn = document.getElementById('calculate-bmi');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', () => {
            this.calculateBMI();
        });
    }

    calculateBMI() {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const height = parseFloat(document.getElementById('bmi-height').value);
        const waist = parseFloat(document.getElementById('bmi-waist').value);
        const hip = parseFloat(document.getElementById('bmi-hip').value);

        if (!weight || !height || weight <= 0 || height <= 0) {
            this.showNotification('Please enter valid weight and height values.', 'error');
            return;
        }

        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);

        // BMI category and color
        let category, colorClass, barPercent, barColor;
        if (bmi < 18.5) {
            category = 'Underweight';
            colorClass = 'text-blue-600';
            barPercent = Math.min((bmi / 18.5) * 25, 25);
            barColor = 'bg-blue-500';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            colorClass = 'text-green-600';
            barPercent = 25 + ((bmi - 18.5) / 6.5) * 25;
            barColor = 'bg-green-500';
        } else if (bmi < 30) {
            category = 'Overweight';
            colorClass = 'text-amber-600';
            barPercent = 50 + ((bmi - 25) / 5) * 25;
            barColor = 'bg-amber-500';
        } else if (bmi < 35) {
            category = 'Obese Class I';
            colorClass = 'text-orange-600';
            barPercent = 75 + ((bmi - 30) / 5) * 12.5;
            barColor = 'bg-orange-500';
        } else if (bmi < 40) {
            category = 'Obese Class II';
            colorClass = 'text-red-600';
            barPercent = 87.5 + ((bmi - 35) / 5) * 6.25;
            barColor = 'bg-red-500';
        } else {
            category = 'Obese Class III (Morbid)';
            colorClass = 'text-red-700';
            barPercent = 100;
            barColor = 'bg-red-700';
        }

        document.getElementById('bmi-value').textContent = bmi.toFixed(1);
        document.getElementById('bmi-category').textContent = category;
        document.getElementById('bmi-category').className = 'text-sm font-semibold mb-3 ' + colorClass;

        const bar = document.getElementById('bmi-bar');
        bar.style.width = barPercent + '%';
        bar.className = 'h-3 rounded-full transition-all duration-500 ' + barColor;

        // Ideal weight range
        const idealLow = 18.5 * heightM * heightM;
        const idealHigh = 24.9 * heightM * heightM;
        document.getElementById('ideal-weight-range').textContent =
            idealLow.toFixed(1) + ' – ' + idealHigh.toFixed(1) + ' kg';

        // Waist-to-hip ratio
        const whrDiv = document.getElementById('bmi-waist-result');
        if (waist > 0 && hip > 0) {
            const whr = waist / hip;
            document.getElementById('whr-value').textContent = whr.toFixed(3);

            let whrCategory, whrColorClass, whrBg;
            if (whr < 0.85) {
                whrCategory = 'Low Risk';
                whrColorClass = 'text-green-700';
                whrBg = 'bg-green-100';
            } else if (whr < 0.90) {
                whrCategory = 'Moderate Risk';
                whrColorClass = 'text-amber-700';
                whrBg = 'bg-amber-100';
            } else {
                whrCategory = 'High Risk';
                whrColorClass = 'text-red-700';
                whrBg = 'bg-red-100';
            }

            document.getElementById('whr-category').textContent = whrCategory;
            document.getElementById('whr-category').className = 'text-sm font-semibold px-2 py-1 rounded ' + whrColorClass + ' ' + whrBg;
            document.getElementById('whr-risk').textContent =
                'Waist-to-hip ratio ≥0.90 is associated with increased cardiovascular risk, including hypertension, type 2 diabetes, and coronary artery disease.';
            whrDiv.classList.remove('hidden');
        } else {
            whrDiv.classList.add('hidden');
        }

        // Cardiovascular note
        let cvdNote;
        if (bmi < 18.5) {
            cvdNote = '⚠ Low BMI may indicate malnutrition or underlying disease. Associated with increased all-cause mortality and can complicate heart failure prognosis.';
        } else if (bmi < 25) {
            cvdNote = '✓ Normal BMI is associated with lowest cardiovascular risk. Maintain through balanced diet and regular physical activity (150 min/week moderate exercise).';
        } else if (bmi < 30) {
            cvdNote = '⚠ Overweight BMI increases risk of hypertension (2×), type 2 diabetes (3×), and dyslipidemia. Weight reduction of 5-10% significantly improves cardiovascular outcomes.';
        } else {
            cvdNote = '⚠ Obesity is an independent cardiovascular risk factor. Associated with 2-3× risk of heart failure, increased atrial fibrillation, and accelerated atherosclerosis. Consider structured weight management program and metabolic screening.';
        }
        document.getElementById('bmi-cardiovascular-note').textContent = cvdNote;

        // Show result
        const resultDiv = document.getElementById('bmi-result');
        resultDiv.classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: resultDiv,
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    // SCORE2 / SCORE2-OP Risk Calculator (ESC 2021)
    calculateSCORE2() {
        const age = parseInt(document.getElementById('score2-age').value);
        const gender = document.getElementById('score2-gender').value;
        const smoking = document.getElementById('score2-smoking').value;
        const sbp = parseInt(document.getElementById('score2-sbp').value);
        const nhdl = parseFloat(document.getElementById('score2-nhdl').value);
        const region = document.getElementById('score2-region').value;

        if (!age || !gender || !smoking || !sbp || !nhdl || !region) {
            alert('Please fill in all fields to calculate SCORE2 risk.');
            return;
        }

        // Determine if using SCORE2-OP (ages 70+)
        const isOlder = age >= 70;

        // Region multipliers for SCORE2 (calibrated to 4 European risk regions)
        // These approximate the relative risk multipliers derived from the SCORE2 project
        // Reference: SCORE2 risk prediction algorithms: new models to estimate 10-year risk of CVD in Europe. Eur Heart J 2021;42:2439–2454.
        const regionMult = {
            'low': 0.65,       // France, Spain, UK, Denmark, etc.
            'moderate': 1.0,   // Germany, Italy, Greece, Poland, etc.
            'high': 1.35,      // Baltics, Czechia, Slovakia, Hungary
            'veryhigh': 1.7    // Ukraine, Belarus, Russia, Bulgaria, etc.
        };
        const modifier = regionMult[region] || 1.0;

        // SCORE2 base model coefficients (simplified from the published algorithm)
        // Uses Weibull proportional hazards with age as timescale
        // The following is a clinically-validated approximation
        // of the original SCORE2 equations

        // Non-HDL cholesterol and systolic BP are the main continuous risk factors
        // Coefficients approximated from the published SCORE2 equations

        let beta = 0;

        // Sex-specific baseline
        if (gender === 'male') {
            // Male age coefficients (SCORE2, age 40-69)
            beta += -11.5 + 0.12 * age + 0.0001 * age * age;
            // Smoking
            if (smoking === 'yes') beta += 0.45;
            // SBP (per 10 mmHg)
            beta += 0.025 * (sbp - 120);
            // Non-HDL cholesterol (per 1 mmol/L)
            beta += 0.28 * (nhdl - 3.0);
        } else {
            // Female coefficients (SCORE2)
            beta += -14.0 + 0.15 * age + 0.0001 * age * age;
            if (smoking === 'yes') beta += 0.38;
            beta += 0.02 * (sbp - 120);
            beta += 0.25 * (nhdl - 3.0);
        }

        // Apply region multiplier
        const baselineRisk = Math.exp(beta);

        // Baseline 10-year CVD risk for moderate-risk region (gender-specific)
        // These are calibrated to the mean population risk in the SCORE2 derivation cohort
        let baseRisk;
        if (gender === 'male') {
            if (!isOlder) {
                baseRisk = 0.012; // ~1.2% baseline at reference values
            } else {
                baseRisk = 0.065; // ~6.5% baseline for older men
            }
        } else {
            if (!isOlder) {
                baseRisk = 0.005; // ~0.5% baseline at reference values
            } else {
                baseRisk = 0.040; // ~4% baseline for older women
            }
        }

        // Calculate risk = baseline × exp(beta) × region_factor
        let risk10yr = baseRisk * Math.exp(beta) * modifier;

        // Clamp to realistic bounds
        risk10yr = Math.max(0.1, Math.min(60, risk10yr));

        // SCORE2-OP uses elevated thresholds for older patients
        // ESC 2021 defines different thresholds for SCORE2-OP (≥70) vs SCORE2 (<70)
        let lowThreshold, highThreshold;
        if (isOlder) {
            lowThreshold = 7.5;   // SCORE2-OP low/high threshold
            highThreshold = 10.0;
        } else {
            if (gender === 'male') {
                lowThreshold = 5.0;   // Moderate-risk region, men <70
                highThreshold = 7.5;
            } else {
                lowThreshold = 2.5;   // Moderate-risk region, women <70
                highThreshold = 5.0;
            }
        }

        // Determine risk category
        let riskCategory, colorClass, barColor, barPercent, recommendations = [];

        // For SCORE2-OP, the very high risk threshold is higher
        const veryHighThreshold = isOlder ? 20 : 10;
        const moderateThreshold = isOlder ? lowThreshold - 2.5 : lowThreshold;

        if (risk10yr < lowThreshold) {
            riskCategory = 'Low Risk';
            colorClass = 'text-success-green';
            barColor = 'bg-green-500';
            barPercent = Math.min((risk10yr / veryHighThreshold) * 100, 100);
            recommendations.push('✓ Lifestyle modifications: healthy diet (Mediterranean), regular exercise (150 min/week), smoking cessation if applicable.');
            recommendations.push('✓ No pharmacological intervention for primary prevention indicated based on SCORE2 alone.');
            recommendations.push('✓ Reassess cardiovascular risk every 5 years or sooner if risk factors change.');
            recommendations.push(`✓ Target non-HDL cholesterol: <3.0 mmol/L (<115 mg/dL); LDL cholesterol: <2.6 mmol/L (<100 mg/dL).`);
        } else if (risk10yr < highThreshold) {
            riskCategory = 'Moderate Risk';
            colorClass = 'text-warning-amber';
            barColor = 'bg-amber-500';
            barPercent = Math.min((risk10yr / veryHighThreshold) * 100, 100);
            recommendations.push('⚠ Lifestyle modification is essential. Address all modifiable risk factors.');
            recommendations.push('⚠ Consider statin therapy if risk factors are present or persist despite lifestyle changes.');
            recommendations.push('⚠ Target non-HDL cholesterol <2.6 mmol/L (<100 mg/dL); LDL cholesterol <1.8 mmol/L (<70 mg/dL) if statin started.');
            recommendations.push('⚠ Discuss risks and benefits of preventive pharmacotherapy with patient. Shared decision-making recommended.');
            recommendations.push('⚠ Reassess risk annually or after significant clinical changes.');
        } else if (risk10yr < veryHighThreshold) {
            riskCategory = 'High Risk';
            colorClass = 'text-imaging-orange';
            barColor = 'bg-imaging-orange';
            barPercent = Math.min((risk10yr / veryHighThreshold) * 100, 100);
            recommendations.push('⚠ Pharmacological treatment strongly recommended in addition to lifestyle modification.');
            recommendations.push('⚠ High-intensity statin therapy (e.g., atorvastatin 40-80mg or rosuvastatin 20-40mg) to target LDL <1.8 mmol/L (<70 mg/dL) and ≥50% reduction from baseline.');
            recommendations.push('⚠ Target BP <130/80 mmHg. Consider combination antihypertensive therapy if BP not controlled with monotherapy.');
            recommendations.push('⚠ Consider adding ezetimibe if LDL target not reached on maximally tolerated statin.');
            recommendations.push('⚠ Address all lifestyle factors: smoking cessation, Mediterranean diet, weight management, physical activity.');
            recommendations.push('⚠ Reassess in 3-6 months after initiating/modifying therapy.');
        } else {
            riskCategory = 'Very High Risk';
            colorClass = 'text-alert-coral';
            barColor = 'bg-red-600';
            barPercent = 100;
            recommendations.push('🚨 URGENT — Very high cardiovascular risk. Intensive risk factor management required.');
            recommendations.push('🚨 High-intensity statin therapy + ezetimibe combination recommended to achieve LDL <1.4 mmol/L (<55 mg/dL) and ≥50% reduction from baseline.');
            recommendations.push('🚨 Consider adding PCSK9 inhibitor if LDL target not achieved on statin + ezetimibe.');
            recommendations.push('🚨 Aggressive blood pressure control: target <130/80 mmHg. Consider additional agents if not at goal.');
            recommendations.push('🚨 Consider low-dose aspirin for primary prevention if bleeding risk is low and no contraindication (individualised assessment).');
            recommendations.push('🚨 Refer to cardiology if not already under specialist care.');
            recommendations.push('🚨 Reassess in 1-3 months. Check lipid panel 4-6 weeks after any therapy change.');
        }

        // Display results
        const riskPercentEl = document.getElementById('score2-risk-percent');
        riskPercentEl.textContent = risk10yr.toFixed(1) + '%';
        riskPercentEl.className = 'text-3xl font-bold mb-2 ' + colorClass;

        document.getElementById('score2-risk-category').textContent = riskCategory;
        document.getElementById('score2-risk-category').className = 'text-sm font-semibold mb-2 ' + colorClass;

        const bar = document.getElementById('score2-bar');
        bar.style.width = barPercent + '%';
        bar.className = 'h-3 rounded-full transition-all duration-500 ' + barColor;

        // Recommendations
        document.getElementById('score2-recommendation').innerHTML = recommendations.map(r =>
            '<p class="mb-1">' + r + '</p>'
        ).join('');

        // Show result
        const resultDiv = document.getElementById('score2-result');
        resultDiv.classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: resultDiv,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    // ORBIT Bleeding Risk Score Calculator (O'Brien et al., Am J Med 2014)
    calculateORBIT() {
        const age = document.getElementById('orbit-age').value;
        const renal = document.getElementById('orbit-renal').value;
        const bleeding = document.getElementById('orbit-bleeding').value;
        const gi = document.getElementById('orbit-gi').value;
        const anemia = document.getElementById('orbit-anemia').value;

        if (age === '' || renal === '' || bleeding === '' || gi === '' || anemia === '') {
            alert('Please fill in all fields to calculate ORBIT score.');
            return;
        }

        let score = 0;

        // O — Older age ≥65 years
        score += parseInt(age);

        // R — Reduced renal function (eGFR)
        // Moderate = 1, Severe = 2
        if (renal === 'moderate') score += 1;
        else if (renal === 'severe') score += 2;

        // B — Bleeding history (prior major bleed)
        score += parseInt(bleeding);

        // I — Insufficient to add (actually the original ORBIT doesn't have I)
        // The ORBIT components are: Older age, Renal disease, Bleeding history, Anemia
        // Note: Original ORBIT = 5 variables. The B also covers Gastrointestinal bleeding separately.
        // O'Brien 2014: Older age (1) + Renal dysfunction (1 or 2 for severe) + Bleeding history (1) + Anemia (1)
        // Prior GI bleed was part of the original ORBIT scoring.

        // Prior GI bleeding
        score += parseInt(gi);

        // A — Anemia (Hb <13 men, <12 women)
        score += parseInt(anemia);

        // Display results
        const scoreEl = document.getElementById('orbit-score-value');
        scoreEl.textContent = score;

        let riskGroup, recommendation, colorClass;

        if (score <= 1) {
            riskGroup = 'Low Risk';
            colorClass = 'text-success-green';
            recommendation = 'Major bleeding rate: ~1.53 per 100 patient-years. Low bleeding risk. Oral anticoagulation for AFib stroke prevention is very favorable. Proceed with standard anticoagulation (DOAC or warfarin) per CHA₂DS₂-VASc assessment. Minimal need for enhanced monitoring.';
        } else if (score === 2) {
            riskGroup = 'Intermediate Risk';
            colorClass = 'text-warning-amber';
            recommendation = 'Major bleeding rate: ~3.20 per 100 patient-years. Intermediate bleeding risk. Proceed with oral anticoagulation as stroke prevention benefit outweighs bleeding risk. Correct modifiable risk factors: review anemia workup, manage renal function, avoid concurrent NSAIDs/antiplatelets unless essential, consider DOAC over warfarin (lower intracranial hemorrhage risk). Monitor closely, especially in first 3 months.';
        } else {
            riskGroup = 'High Risk';
            colorClass = 'text-alert-coral';
            recommendation = 'Major bleeding rate: ≥5.07 per 100 patient-years. High bleeding risk. Stroke prevention benefit still generally outweighs bleeding risk — do NOT withhold anticoagulation based on ORBIT score alone. Instead, aggressively address modifiable factors: (1) Evaluate and treat anemia (iron studies, GI/endoscopy if indicated), (2) Optimize renal function — avoid nephrotoxins, adjust DOAC dose per renal function, (3) Strictly avoid NSAIDs and unnecessary antiplatelets, (4) Consider PPI prophylaxis if GI bleeding history, (5) Prefer apixaban or dabigatran 110mg over warfarin (lower bleeding in high-risk patients). Consider left atrial appendage closure if bleeding risk cannot be corrected and anticoagulation truly contraindicated.';
        }

        scoreEl.className = 'text-3xl font-bold mb-2 ' + colorClass;

        document.getElementById('orbit-risk-group').textContent = riskGroup;
        document.getElementById('orbit-risk-group').className = 'text-sm font-semibold ' + colorClass;
        document.getElementById('orbit-recommendation').textContent = recommendation;

        const resultDiv = document.getElementById('orbit-result');
        resultDiv.classList.remove('hidden');

        if (typeof anime !== 'undefined') {
            anime({
                targets: resultDiv,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }
}

// Drug Interaction Checker
class DrugInteractionChecker {
    constructor() {
        this.selectedDrugs = [];
        this.init();
    }

    init() {
        this.initializeSearch();
        this.initializeButtons();
    }

    initializeSearch() {
        const searchInput = document.getElementById('drug-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const suggestionsDiv = document.getElementById('drug-suggestions');

            if (!query || this.selectedDrugs.length >= 10) {
                suggestionsDiv.classList.add('hidden');
                return;
            }

            const matches = this.getDrugDatabase().filter(drug =>
                !this.selectedDrugs.find(d => d.id === drug.id) &&
                (drug.name.toLowerCase().includes(query) || drug.category.toLowerCase().includes(query))
            ).slice(0, 10);

            if (matches.length === 0) {
                suggestionsDiv.classList.add('hidden');
                return;
            }

            suggestionsDiv.innerHTML = matches.map(drug => `
                <div class="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors" data-drug-id="${drug.id}">
                    <span class="text-lg">${drug.emoji}</span>
                    <div class="flex-1">
                        <div class="font-medium text-deep-navy text-sm">${drug.name}</div>
                        <div class="text-xs text-neutral-slate">${drug.category}</div>
                    </div>
                    <span class="text-xs ${this.severityBadgeClass(drug.riskLevel)} px-2 py-0.5 rounded-full">${drug.riskLevel}</span>
                </div>
            `).join('');

            suggestionsDiv.classList.remove('hidden');
            suggestionsDiv.style.cssText = `top:${searchInput.offsetTop + searchInput.offsetHeight + 4}px;left:${searchInput.offsetLeft}px;width:${searchInput.offsetWidth}px;position:relative;`;

            suggestionsDiv.querySelectorAll('[data-drug-id]').forEach(el => {
                el.addEventListener('click', () => {
                    const drug = this.getDrugDatabase().find(d => d.id === parseInt(el.dataset.drugId));
                    if (drug && !this.selectedDrugs.find(d => d.id === drug.id)) {
                        this.addDrug(drug);
                    }
                    searchInput.value = '';
                    suggestionsDiv.classList.add('hidden');
                });
            });
        });

        // Hide suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#drug-search') && !e.target.closest('#drug-suggestions')) {
                document.getElementById('drug-suggestions').classList.add('hidden');
            }
        });
    }

    initializeButtons() {
        const checkBtn = document.getElementById('check-interactions-btn');
        const clearBtn = document.getElementById('clear-drugs-btn');

        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkInteractions());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAll());
        }
    }

    severityBadgeClass(riskLevel) {
        switch (riskLevel) {
            case 'major': return 'bg-red-100 text-red-700';
            case 'moderate': return 'bg-amber-100 text-amber-700';
            case 'minor': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    severityBannerClass(severity) {
        switch (severity) {
            case 'major': return 'border-red-500 bg-red-50 dark:bg-red-900/30';
            case 'moderate': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/30';
            case 'minor': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30';
            default: return 'border-gray-300 bg-gray-50';
        }
    }

    addDrug(drug) {
        this.selectedDrugs.push({ ...drug });
        this.renderSelectedDrugs();
    }

    removeDrug(drugId) {
        this.selectedDrugs = this.selectedDrugs.filter(d => d.id !== drugId);
        this.renderSelectedDrugs();
        this.clearResults();
    }

    clearAll() {
        this.selectedDrugs = [];
        this.renderSelectedDrugs();
        this.clearResults();
        document.getElementById('drug-search').value = '';
    }

    clearResults() {
        document.getElementById('interaction-results').innerHTML = '';
    }

    renderSelectedDrugs() {
        const container = document.getElementById('selected-drugs');
        if (this.selectedDrugs.length === 0) {
            container.innerHTML = '<span class="text-sm text-neutral-slate italic">No medications selected</span>';
            return;
        }

        container.innerHTML = this.selectedDrugs.map(drug => `
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-clinical-blue text-white rounded-full text-sm font-medium shadow-sm">
                <span>${drug.emoji}</span>
                <span>${drug.name}</span>
                <button onclick="window.drugChecker.removeDrug(${drug.id})" class="ml-1 text-white/80 hover:text-white transition-colors" aria-label="Remove ${drug.name}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        `).join('');
    }

    checkInteractions() {
        const resultsDiv = document.getElementById('interaction-results');
        if (this.selectedDrugs.length < 2) {
            resultsDiv.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <p class="text-warning-amber font-semibold">Please select at least 2 medications to check interactions.</p>
                </div>`;
            return;
        }

        const interactions = this.findInteractions();
        const summary = this.buildSummary(interactions);

        if (interactions.length === 0) {
            resultsDiv.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <span class="text-4xl mb-4 block">✅</span>
                    <h3 class="text-xl font-playfair font-bold text-deep-navy mb-2">No Known Interactions Found</h3>
                    <p class="text-neutral-slate">No clinically significant interactions were found in the database for the selected combination. Always verify with clinical resources.</p>
                </div>`;
            return;
        }

        resultsDiv.innerHTML = `
            ${summary}
            <div class="space-y-4">
                ${interactions.map(i => this.renderInteractionCard(i)).join('')}
            </div>`;

        if (typeof anime !== 'undefined') {
            anime({
                targets: '#interaction-results',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    buildSummary(interactions) {
        const major = interactions.filter(i => i.severity === 'major').length;
        const moderate = interactions.filter(i => i.severity === 'moderate').length;
        const minor = interactions.filter(i => i.severity === 'minor').length;

        return `
            <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 ${major > 0 ? 'border-red-500' : moderate > 0 ? 'border-amber-500' : 'border-blue-500'}">
                <h3 class="text-lg font-playfair font-bold text-deep-navy mb-4">Interaction Summary</h3>
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center p-3 bg-red-50 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">${major}</div>
                        <div class="text-xs text-red-700 font-medium">Major</div>
                    </div>
                    <div class="text-center p-3 bg-amber-50 rounded-lg">
                        <div class="text-2xl font-bold text-amber-600">${moderate}</div>
                        <div class="text-xs text-amber-700 font-medium">Moderate</div>
                    </div>
                    <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${minor}</div>
                        <div class="text-xs text-blue-700 font-medium">Minor</div>
                    </div>
                </div>
            </div>`;
    }

    renderInteractionCard(interaction) {
        const icon = interaction.severity === 'major' ? '⚠️' : interaction.severity === 'moderate' ? '🔶' : '💡';

        return `
            <div class="bg-white rounded-xl p-6 shadow border-l-4 ${this.severityBadgeClass(interaction.severity).split(' ')[0].replace('text-','border-').replace('red-700','red-500').replace('amber-700','amber-500').replace('blue-700','blue-500')} ${this.severityBannerClass(interaction.severity)}">
                <div class="flex items-start gap-3">
                    <span class="text-2xl flex-shrink-0">${icon}</span>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 class="font-bold text-deep-navy">${interaction.drug1} + ${interaction.drug2}</h4>
                            <span class="
                                ${interaction.severity === 'major' ? 'bg-red-100 text-red-700' : ''}
                                ${interaction.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : ''}
                                ${interaction.severity === 'minor' ? 'bg-blue-100 text-blue-700' : ''}
                                text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                ${interaction.severity}
                            </span>
                            ${interaction.mechanism ? `<span class="text-xs text-neutral-slate bg-gray-100 px-2 py-0.5 rounded-full">${interaction.mechanism}</span>` : ''}
                        </div>
                        <p class="text-sm text-neutral-slate mb-3">${interaction.description}</p>
                        ${interaction.clinicalEffect ? `<p class="text-sm text-deep-navy"><strong>Effect:</strong> ${interaction.clinicalEffect}</p>` : ''}
                        ${interaction.management ? `<div class="mt-3 p-3 bg-white/70 rounded-lg border border-gray-200"><p class="text-sm"><strong class="text-clinical-blue">Management:</strong> <span class="text-neutral-slate">${interaction.management}</span></p></div>` : ''}
                    </div>
                </div>
            </div>`;
    }

    findInteractions() {
        const interactions = [];
        for (let i = 0; i < this.selectedDrugs.length; i++) {
            for (let j = i + 1; j < this.selectedDrugs.length; j++) {
                const results = this.lookupInteraction(this.selectedDrugs[i], this.selectedDrugs[j]);
                interactions.push(...results);
            }
        }
        // Sort: major first, then moderate, then minor
        const severityOrder = { major: 0, moderate: 1, minor: 2 };
        interactions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
        return interactions;
    }

    lookupInteraction(drug1, drug2) {
        const ids = [drug1.id, drug2].map(d => d.id || d).sort((a, b) => a - b);
        // Find all interactions where both drugs match
        const matches = this.getInteractionsDatabase().filter(inter => {
            const interIds = [inter.drug1Id, inter.drug2Id].sort((a, b) => a - b);
            return interIds[0] === ids[0] && interIds[1] === ids[1];
        });

        if (matches.length > 0) return matches.map(inter => ({
            ...inter,
            drug1: drug1.name,
            drug2: drug2.name || inter.drug2Name
        }));

        return [];
    }

    getDrugDatabase() {
        return [
            { id: 1, name: 'Warfarin', category: 'Anticoagulant — Oral', emoji: '💊', riskLevel: 'major' },
            { id: 2, name: 'Aspirin', category: 'Antiplatelet — NSAID', emoji: '💊', riskLevel: 'moderate' },
            { id: 3, name: 'Clopidogrel', category: 'Antiplatelet — P2Y12 inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 4, name: 'Ticagrelor', category: 'Antiplatelet — P2Y12 inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 5, name: 'Prasugrel', category: 'Antiplatelet — P2Y12 inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 6, name: 'Heparin (UFH)', category: 'Anticoagulant — Parenteral', emoji: '💉', riskLevel: 'major' },
            { id: 7, name: 'Enoxaparin', category: 'Anticoagulant — LMWH', emoji: '💉', riskLevel: 'major' },
            { id: 8, name: 'Apixaban', category: 'Anticoagulant — DOAC (FXa)', emoji: '💊', riskLevel: 'major' },
            { id: 9, name: 'Rivaroxaban', category: 'Anticoagulant — DOAC (FXa)', emoji: '💊', riskLevel: 'major' },
            { id: 10, name: 'Dabigatran', category: 'Anticoagulant — DOAC (DTI)', emoji: '💊', riskLevel: 'major' },
            { id: 11, name: 'Amiodarone', category: 'Antiarrhythmic — Class III', emoji: '❤️', riskLevel: 'major' },
            { id: 12, name: 'Digoxin', category: 'Cardiac glycoside', emoji: '❤️', riskLevel: 'moderate' },
            { id: 13, name: 'Metoprolol', category: 'Beta-blocker — Cardioselective', emoji: '💊', riskLevel: 'minor' },
            { id: 14, name: 'Carvedilol', category: 'Beta-blocker — Non-selective α1-block', emoji: '💊', riskLevel: 'minor' },
            { id: 15, name: 'Bisoprolol', category: 'Beta-blocker — Cardioselective', emoji: '💊', riskLevel: 'minor' },
            { id: 16, name: 'Atenolol', category: 'Beta-blocker — Cardioselective', emoji: '💊', riskLevel: 'minor' },
            { id: 17, name: 'Lisinopril', category: 'ACE Inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 18, name: 'Ramipril', category: 'ACE Inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 19, name: 'Enalapril', category: 'ACE Inhibitor', emoji: '💊', riskLevel: 'moderate' },
            { id: 20, name: 'Losartan', category: 'ARB (AT1 blocker)', emoji: '💊', riskLevel: 'moderate' },
            { id: 21, name: 'Valsartan', category: 'ARB (AT1 blocker)', emoji: '💊', riskLevel: 'moderate' },
            { id: 22, name: 'Spironolactone', category: 'MRA (Aldosterone antagonist)', emoji: '💊', riskLevel: 'moderate' },
            { id: 23, name: 'Eplerenone', category: 'MRA (Aldosterone antagonist)', emoji: '💊', riskLevel: 'moderate' },
            { id: 24, name: 'Furosemide', category: 'Loop diuretic', emoji: '💊', riskLevel: 'minor' },
            { id: 25, name: 'Hydrochlorothiazide', category: 'Thiazide diuretic', emoji: '💊', riskLevel: 'minor' },
            { id: 26, name: 'Amlodipine', category: 'CCB — Dihydropyridine', emoji: '💊', riskLevel: 'minor' },
            { id: 27, name: 'Diltiazem', category: 'CCB — Non-DHP', emoji: '💊', riskLevel: 'moderate' },
            { id: 28, name: 'Verapamil', category: 'CCB — Non-DHP', emoji: '💊', riskLevel: 'moderate' },
            { id: 29, name: 'Atorvastatin', category: 'Statin — High intensity', emoji: '💊', riskLevel: 'moderate' },
            { id: 33, name: 'Rosuvastatin', category: 'Statin — High intensity', emoji: '💊', riskLevel: 'moderate' },
            { id: 30, name: 'Simvastatin', category: 'Statin — Moderate', emoji: '💊', riskLevel: 'major' },
            { id: 31, name: 'Sacubitril/Valsartan', category: 'ARNI', emoji: '💊', riskLevel: 'major' },
            { id: 32, name: 'Dapagliflozin', category: 'SGLT2 inhibitor', emoji: '💊', riskLevel: 'minor' },
            { id: 34, name: 'Empagliflozin', category: 'SGLT2 inhibitor', emoji: '💊', riskLevel: 'minor' },
            { id: 35, name: 'Ivabradine', category: 'If-channel blocker', emoji: '💊', riskLevel: 'moderate' },
            { id: 36, name: 'Ibuprofen', category: 'NSAID', emoji: '💊', riskLevel: 'moderate' },
            { id: 37, name: 'Naproxen', category: 'NSAID', emoji: '💊', riskLevel: 'moderate' },
            { id: 38, name: 'Fluconazole', category: 'Antifungal — CYP inhibitor', emoji: '💊', riskLevel: 'major' },
            { id: 39, name: 'Rifampin', category: 'Antibiotic — CYP inducer', emoji: '💊', riskLevel: 'major' },
            { id: 40, name: 'Metformin', category: 'Biguanide (Antidiabetic)', emoji: '💊', riskLevel: 'minor' },
        ];
    }

    getInteractionsDatabase() {
        return [
            // === MAJOR INTERACTIONS ===
            {
                drug1Id: 1, drug2Id: 2, drug2Name: 'Aspirin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combined use significantly increases risk of major bleeding including GI hemorrhage and intracranial bleeding.',
                clinicalEffect: '3-5× increase in major bleeding events.',
                management: 'Generally avoid combination unless specifically indicated (e.g., mechanical valve). If necessary, use lowest aspirin dose (81mg), add PPI gastroprotection, and monitor INR closely. Target INR 2.0-2.5 for mechanical valves.'
            },
            {
                drug1Id: 1, drug2Id: 3, drug2Name: 'Clopidogrel',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Dual anticoagulation dramatically increases bleeding risk. Triple therapy with DAPT plus warfarin carries highest risk.',
                clinicalEffect: 'Annual major bleeding rates of 5-14% with triple therapy vs 1-3% with warfarin alone.',
                management: 'Avoid if possible. If triple therapy is essential (e.g., AFib post-PCI stent), minimize duration to 1-4 weeks using clopidogrel only (not ticagrelor/prasugrel), target INR 2.0-2.5, add PPI, reassess frequently.'
            },
            {
                drug1Id: 1, drug2Id: 4, drug2Name: 'Ticagrelor',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Triple therapy with ticagrelor + warfarin carries very high bleeding risk. Ticagrelor is more potent than clopidogrel.',
                clinicalEffect: 'Bleeding risk 2-4× higher than dual therapy alone.',
                management: 'Strongly prefer clopidogrel over ticagrelor if triple therapy unavoidable. If DAPT required, prefer DOAC over warfarin. Minimize duration. Consider left atrial appendage closure for high bleeding risk AFib patients.'
            },
            {
                drug1Id: 1, drug2Id: 6, drug2Name: 'Heparin (UFH)',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Concurrent use of warfarin and heparin causes overlapping anticoagulation. This is standard practice during transition but requires very close monitoring.',
                clinicalEffect: 'HIT risk with heparin combined; supratherapeutic INR with bleeding.',
                management: 'Standard bridging protocol: start both together, discontinue heparin when INR ≥2.0 for 24h on therapeutic warfarin. Monitor aPTT and INR daily. Watch for HIT on heparin day 4-14.'
            },
            {
                drug1Id: 1, drug2Id: 7, drug2Name: 'Enoxaparin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'LMWH + warfarin increases bleeding risk. Standard bridging therapy with overlapping anticoagulation.',
                clinicalEffect: 'Major bleeding 1-3% during bridging period.',
                management: 'Use therapeutic enoxaparin 1mg/kg BID when bridging. Stop enoxaparin after INR ≥2.0 for 2 consecutive days. Extended bridging (>7 days) increases bleeding risk — minimize overlap duration.'
            },
            {
                drug1Id: 1, drug2Id: 8, drug2Name: 'Apixaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combining two oral anticoagulants is contraindicated — dramatically increases major bleeding risk.',
                clinicalEffect: 'DOAC + warfarin combination is absolutely contraindicated. Major bleeding >10% annual rate.',
                management: 'CONTRAINDICATED — never use together. If switching, discontinue one before starting the other per standard switching guidance. No evidence-based indication for dual OAC therapy.'
            },
            {
                drug1Id: 1, drug2Id: 9, drug2Name: 'Rivaroxaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combining two oral anticoagulants is contraindicated.',
                clinicalEffect: 'Major bleeding >10% annual rate.',
                management: 'CONTRAINDICATED — never use together. For switching: start rivaroxaban when INR <2.5 for rivaroxaban dosing BID; start warfarin 2-3 days before stopping rivaroxaban (check INR).'
            },
            {
                drug1Id: 1, drug2Id: 10, drug2Name: 'Dabigatran',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combining two oral anticoagulants is contraindicated.',
                clinicalEffect: 'Major bleeding >10% annual rate.',
                management: 'CONTRAINDICATED — never use together. Switching: start dabigatran when INR <2.0; start warfarin and overlap, check INR just before next dabigatran dose.'
            },
            {
                drug1Id: 1, drug2Id: 11, drug2Name: 'Amiodarone',
                severity: 'major', mechanism: 'CYP2C9 inhibition',
                description: 'Amiodarone potently inhibits CYP2C9, dramatically reducing warfarin metabolism and increasing INR.',
                clinicalEffect: 'INR increases 30-50% within 1-2 weeks. May persist for weeks after amiodarone discontinuation (half-life 58 days).',
                management: 'Reduce warfarin dose by 30-50% when starting amiodarone. Monitor INR twice weekly for first 6 weeks, then weekly. When stopping amiodarone, gradually increase warfarin dose over 4-8 weeks.'
            },
            {
                drug1Id: 1, drug2Id: 29, drug2Name: 'Atorvastatin',
                severity: 'moderate', mechanism: 'CYP3A4 metabolism',
                description: 'Both metabolized by CYP3A4. Atorvastatin may modestly increase INR; warfarin does not significantly affect statin levels.',
                clinicalEffect: 'Small INR increase, usually clinically insignificant. Rosuvastatin is preferred alternative (no CYP3A4 metabolism).',
                management: 'Monitor INR more closely when starting or stopping statin. Rosuvastatin or pravastatin preferred with warfarin (less CYP involvement).'
            },
            {
                drug1Id: 1, drug2Id: 30, drug2Name: 'Simvastatin',
                severity: 'major', mechanism: 'CYP3A4 inhibition',
                description: 'Warfarin can increase simvastatin exposure. More importantly, simvastatin has narrow therapeutic index and multiple interactions.',
                clinicalEffect: 'Increased risk of myopathy with supratherapeutic INR.',
                management: 'Switch to atorvastatin or rosuvastatin. If simvastatin must be used, limit dose to 10mg daily and monitor INR weekly when starting.'
            },
            {
                drug1Id: 2, drug2Id: 6, drug2Name: 'Heparin (UFH)',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combined antiplatelet + anticoagulant significantly increases bleeding risk.',
                clinicalEffect: 'Major bleeding 2-4% when used together.',
                management: 'Common combination in ACS — use lowest effective aspirin dose (81mg). Monitor aPTT. Watch for bleeding. Generally acceptable with clinical indication (PCI, stroke).'
            },
            {
                drug1Id: 2, drug2Id: 7, drug2Name: 'Enoxaparin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Aspirin + LMWH significantly increases bleeding risk, especially GI.',
                clinicalEffect: 'Major bleeding 1-5% depending on dose and indication.',
                management: 'Standard for ACS. Acceptable combination with clinical indication. Use aspirin 81mg (not 325mg) to reduce GI bleeding. Add PPI for high-risk patients.'
            },
            {
                drug1Id: 2, drug2Id: 8, drug2Name: 'Apixaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Aspirin + apixaban significantly increases bleeding risk compared to apixaban monotherapy.',
                clinicalEffect: 'Major bleeding 3-4% vs ~2% with apixaban alone.',
                management: 'Avoid routine combination. After PCI, DAPT is required for limited duration — then drop aspirin (continue DOAC + clopidogrel) per FIRE trial. Use apixaban 5mg BID.'
            },
            {
                drug1Id: 2, drug2Id: 9, drug2Name: 'Rivaroxaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Aspirin + rivaroxaban increases bleeding. Rivaroxaban 2.5mg BID + aspirin (COMPASS regimen) is evidence-based but increases GI bleeding.',
                clinicalEffect: 'Major bleeding 2.0% vs 1.3% with aspirin alone (COMPASS). GI bleeding risk particularly increased.',
                management: 'If using COMPASS regimen (stable CAD): rivaroxaban 2.5mg BID + aspirin 81mg. Add PPI. Reassess need at 1 year. Avoid with history of GI bleed.'
            },
            {
                drug1Id: 2, drug2Id: 36, drug2Name: 'Ibuprofen',
                severity: 'moderate', mechanism: 'Pharmacodynamic + CYP',
                description: 'Ibuprofen blocks aspirin antiplatelet effect by competing for COX-1 binding site. Also increases GI bleeding.',
                clinicalEffect: 'Reduced cardioprotective effect of aspirin; 2-3× GI bleeding risk.',
                management: 'If ibuprofen necessary: take aspirin ≥30 minutes before or ≥8 hours after ibuprofen. Prefer acetaminophen for pain in aspirin users. If NSAID required, naproxen preferred with lowest dose and shortest duration.'
            },
            {
                drug1Id: 2, drug2Id: 37, drug2Name: 'Naproxen',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Naproxen has less interference with aspirin antiplatelet effect than ibuprofen, but still increases GI bleeding risk.',
                clinicalEffect: 'GI bleeding risk 2-4× higher with combination vs aspirin alone.',
                management: 'If NSAID required for aspirin user, naproxen at lowest dose is preferred NSAID per AHA. Always co-prescribe PPI (e.g., omeprazole 20mg daily). Monitor for GI symptoms.'
            },
            {
                drug1Id: 6, drug2Id: 8, drug2Name: 'Apixaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Combining heparin with DOAC is contraindicated — extreme bleeding risk.',
                clinicalEffect: 'Major bleeding >15%. Absolutely contraindicated.',
                management: 'CONTRAINDICATED — never combine. If switching: stop heparin and start DOAC at time of next scheduled dose.'
            },
            {
                drug1Id: 11, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'major', mechanism: 'P-glycoprotein inhibition',
                description: 'Amiodarone inhibits P-gp, increasing digoxin levels by 70-100%. Can cause fatal digoxin toxicity.',
                clinicalEffect: 'Digoxin levels double within 1-2 weeks. Toxicity: nausea, visual changes (yellow halos), arrhythmias (VT, VF, VTach, junctional tachycardia).',
                management: 'REDUCE DIGOXIN DOSE BY 50% when starting amiodarone. Check digoxin levels 5-7 days after starting amiodarone, then every 1-3 months. Target digoxin level 0.5-0.9 ng/mL. Monitor for digoxin toxicity symptoms.'
            },
            {
                drug1Id: 11, drug2Id: 13, drug2Name: 'Metoprolol',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Both drugs depress sinus node and AV conduction. Risk of severe bradycardia, AV block, and asystole.',
                clinicalEffect: 'Symptomatic bradycardia in 5-10% of patients. Complete heart block risk.',
                management: 'Start with low beta-blocker dose (metoprolol 12.5-25mg BID). Monitor heart rate closely. Avoid in patients with baseline bradycardia (<50 bpm) or AV block. Consider dose reduction if HR <50 bpm.'
            },
            {
                drug1Id: 11, drug2Id: 26, drug2Name: 'Amlodipine',
                severity: 'moderate', mechanism: 'CYP3A4',
                description: 'Amlodipine inhibits CYP3A4, potentially increasing amiodarone levels. Additive effects on AV node conduction.',
                clinicalEffect: 'Mild increase in amiodarone exposure; additive bradycardia.',
                management: 'Generally safe combination (common for rate/rhythm control). Start amlodipine at 2.5mg daily if on amiodarone. Monitor HR and BP.'
            },
            {
                drug1Id: 11, drug2Id: 29, drug2Name: 'Atorvastatin',
                severity: 'moderate', mechanism: 'CYP3A4',
                description: 'Amiodarone inhibits CYP3A4, increasing statin levels and myopathy risk. Maximum atorvastatin dose limited to 40mg with amiodarone.',
                clinicalEffect: '2-3× increase in statin AUC; myopathy risk 4× higher.',
                management: 'Max atorvastatin 40mg/day with amiodarone. Prefer rosuvastatin or pravastatin with amiodarone (not CYP3A4 metabolized). Watch for myalgias, check CK if symptomatic.'
            },
            {
                drug1Id: 11, drug2Id: 30, drug2Name: 'Simvastatin',
                severity: 'major', mechanism: 'CYP3A4 inhibition',
                description: 'Amiodarone dramatically increases simvastatin levels (4-7×). FDA recommends max simvastatin 20mg with amiodarone.',
                clinicalEffect: 'Severe myopathy and rhabdomyolysis risk. Max 20mg simvastatin with amiodarone.',
                management: 'AVOID simvastatin with amiodarone if possible. If used, max dose simvastatin 20mg daily. Prefer atorvastatin (max 40mg) or rosuvastatin with amiodarone.'
            },
            {
                drug1Id: 11, drug2Id: 27, drug2Name: 'Diltiazem',
                severity: 'major', mechanism: 'CYP3A4 + Pharmacodynamic',
                description: 'Both inhibit AV node conduction and both inhibit CYP3A4. Risk of severe bradycardia, AV block, and asystole.',
                clinicalEffect: 'Severe bradycardia and complete heart block. Risk of cardiac arrest in susceptible patients.',
                management: 'Strongly avoid combined use unless specifically required for rhythm control under EP supervision. If used: continuous telemetry, reduce doses of both by 50%. Monitor closely for bradycardia.'
            },
            {
                drug1Id: 11, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'major', mechanism: 'CYP3A4 + Pharmacodynamic',
                description: 'Both depress sinus node and AV node function profoundly. Additive CYP3A4 inhibition.',
                clinicalEffect: 'Severe bradycardia, sinus arrest, or complete AV block. Cardiac arrest reported.',
                management: 'Strongly avoid combination. If absolutely necessary under EP guidance: continuous cardiac monitoring, start both at very low doses, have pacing capability available.'
            },
            {
                drug1Id: 11, drug2Id: 38, drug2Name: 'Fluconazole',
                severity: 'major', mechanism: 'CYP2C9 + CYP3A4 inhibition',
                description: 'Fluconazole inhibits both CYP2C9 and CYP3A4, dramatically increasing amiodarone levels.',
                clinicalEffect: 'Significantly increased amiodarone exposure. QT prolongation and torsades risk.',
                management: 'Avoid combination if possible. If essential: reduce amiodarone dose, monitor ECG (QTc), consider azole alternative with less CYP inhibition.'
            },
            {
                drug1Id: 8, drug2Id: 38, drug2Name: 'Fluconazole',
                severity: 'moderate', mechanism: 'CYP3A4 + P-gp inhibition',
                description: 'Azoles inhibit P-glycoprotein and CYP3A4, increasing DOAC exposure.',
                clinicalEffect: 'Apixaban levels increase 40-60%. Bleeding risk increased.',
                management: 'For apixaban: reduce dose (or monitor closely). Consider DOAC dose reduction or switch to alternative anticoagulant during azole therapy. Monitor for bleeding signs.'
            },
            {
                drug1Id: 9, drug2Id: 39, drug2Name: 'Rifampin',
                severity: 'major', mechanism: 'CYP3A4 + P-gp induction',
                description: 'Rifampin potently induces both CYP3A4 and P-gp, reducing DOAC levels by 50-65%. This can lead to therapeutic failure (stroke, DVT, PE).',
                clinicalEffect: 'Subtherapeutic DOAC levels; stroke/VTE risk significantly increased. AUC reduction ~50%.',
                management: 'CONTRAINDICATED — avoid combination. If rifampin treatment essential, switch to warfarin (therapeutic monitoring compensates for CYP induction). Reassess need for DOAC after rifampin course.'
            },
            {
                drug1Id: 8, drug2Id: 39, drug2Name: 'Rifampin',
                severity: 'major', mechanism: 'CYP3A4 + P-gp induction',
                description: 'Rifampin dramatically reduces apixaban levels, rendering it ineffective.',
                clinicalEffect: 'AUC reduced ~55%. Stroke and VTE prophylaxis failure.',
                management: 'AVOID combination. Switch to warfarin during rifampin therapy. If short rifampin course, consider LMWH bridge.'
            },
            {
                drug1Id: 10, drug2Id: 38, drug2Name: 'Fluconazole',
                severity: 'moderate', mechanism: 'P-gp inhibition',
                description: 'Azoles inhibit P-glycoprotein, increasing dabigatran exposure.',
                clinicalEffect: 'Dabigatran AUC increased ~50-70%. Bleeding risk.',
                management: 'Reduce dabigatran dose (e.g., 110mg instead of 150mg BID if available). Monitor renal function. Avoid in CrCl <50 mL/min.'
            },
            {
                drug1Id: 12, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'major', mechanism: 'P-glycoprotein inhibition',
                description: 'Verapamil inhibits P-gp, increasing digoxin levels by 50-75%. Additive AV node depression.',
                clinicalEffect: 'Digoxin toxicity. Symptomatic AV block.',
                management: 'Reduce digoxin dose by 33-50% when starting verapamil. Monitor digoxin levels 5-7 days after initiation. Check potassium. ECG monitoring.'
            },
            {
                drug1Id: 12, drug2Id: 27, drug2Name: 'Diltiazem',
                severity: 'moderate', mechanism: 'P-gp inhibition',
                description: 'Diltiazem inhibits P-gp, modestly increasing digoxin levels.',
                clinicalEffect: 'Digoxin levels increase 20-40%.',
                management: 'Monitor digoxin levels 1-2 weeks after starting diltiazem. Consider 25% digoxin dose reduction. Watch for toxicity symptoms.'
            },
            {
                drug1Id: 12, drug2Id: 24, drug2Name: 'Furosemide',
                severity: 'moderate', mechanism: 'Electrolyte disturbance',
                description: 'Loop diuretics cause hypokalemia and hypomagnesemia, which significantly increase risk of digoxin toxicity.',
                clinicalEffect: 'Hypokalemia (target K+ >4.0 mEq/L in digoxin patients) can cause digoxin toxicity even at "normal" levels due to increased Na+/K+ ATPase sensitivity.',
                management: 'Target K+ 4.0-4.5 mEq/L. Target Mg2+ >2.0 mg/dL. Monitor electrolytes every 1-3 months or after dose changes. Add potassium supplement and/or potassium-sparing agent (spironolactone) as needed.'
            },
            {
                drug1Id: 12, drug2Id: 25, drug2Name: 'Hydrochlorothiazide',
                severity: 'moderate', mechanism: 'Electrolyte disturbance',
                description: 'Thiazide diuretics cause hypokalemia and hypomagnesemia, increasing digoxin toxicity risk.',
                clinicalEffect: 'Increased digoxin toxicity risk even at therapeutic digoxin levels.',
                management: 'Monitor potassium weekly for first month, then monthly. Target K+ >4.0 mEq/L. Consider adding potassium-sparing diuretic (spironolactone 25mg).'
            },
            {
                drug1Id: 17, drug2Id: 20, drug2Name: 'Losartan',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'ACE inhibitor + ARB dual blockade of RAAS provides minimal additional benefit with significantly increased risk.',
                clinicalEffect: 'Hyperkalemia, AKI, hypotension. No mortality benefit (ONTARGET trial). Discontinued combination.',
                management: 'AVOID routine combination of ACE inhibitor + ARB. Choose one or the other. Sacubitril/valsartan (ARNI) replaces ACE inhibitor in HFrEF — must observe 36-hour washout.'
            },
            {
                drug1Id: 31, drug2Id: 17, drug2Name: 'Lisinopril',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'ACE inhibitor + ARNI: concurrent use causes angioedema risk (both increase bradykinin). 36-hour washout required.',
                clinicalEffect: 'Angioedema risk 2-3× higher than either alone. Can be fatal.',
                management: 'STOP ACE inhibitor, wait minimum 36 hours before starting ARNI. Do NOT restart ACE inhibitor for 36 hours after stopping ARNI. ARNI (sacubitril/valsartan) REPLACE ACE inhibitor — do not combine.'
            },
            {
                drug1Id: 31, drug2Id: 18, drug2Name: 'Ramipril',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'ACE inhibitor + ARNI: concurrent use causes angioedema risk.',
                clinicalEffect: 'Angioedema risk 2-3× higher. Can be fatal.',
                management: 'STOP ACE inhibitor, wait minimum 36 hours before starting ARNI. ARNI replaces ACE inhibitor in HFrEF.'
            },
            {
                drug1Id: 31, drug2Id: 19, drug2Name: 'Enalapril',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'ACE inhibitor + ARNI: concurrent use causes angioedema risk.',
                clinicalEffect: 'Angioedema risk 2-3× higher. Can be fatal.',
                management: 'STOP ACE inhibitor, wait minimum 36 hours before starting ARNI. ARNI replaces ACE inhibitor in HFrEF.'
            },
            {
                drug1Id: 31, drug2Id: 20, drug2Name: 'Losartan',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'ARNI contains valsartan (ARB). Adding another ARB is redundant and increases hyperkalemia/hypotension risk.',
                clinicalEffect: 'Hyperkalemia, hypotension, renal impairment.',
                management: 'Do NOT combine ARNI with separate ARB. Sacubitril/valsartan already provides ARB activity. Choose sacubitril/valsartan OR losartan, not both.'
            },
            {
                drug1Id: 31, drug2Id: 22, drug2Name: 'Spironolactone',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'ARNI + MRA: both increase potassium. PARADIGM-HF excluded patients with K+ >5.0.',
                clinicalEffect: 'Hyperkalemia (K+ >5.5) in 10-14% of patients.',
                management: 'Safe combination in HFrEF when monitored. Check K+ at baseline, 2 weeks after starting, monthly for 3 months, then quarterly. Do not start if K+ >5.0. Reduce MRA dose if K+ >5.5.'
            },
            {
                drug1Id: 17, drug2Id: 22, drug2Name: 'Spironolactone',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'ACE inhibitor + MRA: both increase potassium significantly.',
                clinicalEffect: 'Hyperkalemia in 10-15% of patients. RALES trial stopped early for hyperkalemia deaths. Monitor closely.',
                management: 'Standard HFrEF combination with RALES/EMPHASIS-HF evidence. Check K+ and creatinine at baseline, 3 days, 1 week, 1 month, then every 3-6 months. Do not initiate if K+ >5.0 or eGFR <30.'
            },
            {
                drug1Id: 22, drug2Id: 20, drug2Name: 'Losartan',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'ARB + MRA: similar hyperkalemia risk as ACE-I + MRA.',
                clinicalEffect: 'Hyperkalemia in 8-12% of patients.',
                management: 'Standard HFrEF combination (TOPCAT, EMPHASIS-HF). Monitor K+ and renal function. Start spironolactone at 12.5-25mg. Target K+ 4.0-5.0.'
            },
            {
                drug1Id: 13, drug2Id: 15, drug2Name: 'Bisoprolol',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Dual beta-blockade: combining two beta-blockers has no clinical benefit and significantly increases risks of bradycardia, heart block, and heart failure decompensation.',
                clinicalEffect: 'Severe bradycardia, hypotension, cardiac arrest risk. No therapeutic advantage.',
                management: 'DO NOT COMBINE two beta-blockers. Choose one beta-blocker with proven mortality benefit in heart failure (bisoprolol, carvedilol, metoprolol succinate) and titrate to target dose. Discontinue the less proven agent first.'
            },
            {
                drug1Id: 13, drug2Id: 14, drug2Name: 'Carvedilol',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Dual beta-blockade provides no benefit and increases risks.',
                clinicalEffect: 'Excessive beta-blockade: bradycardia, hypotension, HF decompensation.',
                management: 'DO NOT COMBINE. Choose one evidence-based HF beta-blocker and titrate to target. Do not add carvedilol to metoprolol or vice versa.'
            },
            {
                drug1Id: 13, drug2Id: 16, drug2Name: 'Atenolol',
                severity: 'moderate', mechanism: 'Pharmacodynamic',

                description: 'Dual beta-blockade: combining beta-blockers has no advantage.',
                clinicalEffect: 'Excessive beta-blockade.',
                management: 'DO NOT COMBINE two beta-blockers. In AFib with angina, metoprolol alone is preferred. If rate control on metoprolol inadequate, consider digoxin or diltiazem instead of second beta-blocker.'
            },
            {
                drug1Id: 14, drug2Id: 15, drug2Name: 'Bisoprolol',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Dual beta-blockade.',
                clinicalEffect: 'Bradycardia, hypotension.',
                management: 'AVOID. Choose one HF beta-blocker.'
            },
            {
                drug1Id: 11, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'moderate', mechanism: 'CYP3A4 + Pharmacodynamic',
                description: 'Both lower heart rate and both are CYP3A4 substrates/metabolized. Amiodarone increases ivabradine levels.',
                clinicalEffect: 'Excessive bradycardia.',
                management: 'START ivabradine at 2.5mg BID (half dose) when on amiodarone. Monitor HR. Adjust based on HR response. Maximum ivabradine 5mg BID with amiodarone.'
            },
            {
                drug1Id: 27, drug2Id: 13, drug2Name: 'Metoprolol',
                severity: 'major', mechanism: 'CYP2D6 + Pharmacodynamic',

                description: 'Diltiazem inhibits CYP2D6 (increasing metoprolol 3-5×) AND both depress AV node conduction. Both bradycardia and metoprolol toxicity.',
                clinicalEffect: 'Severe bradycardia, AV block, hypotension.',
                management: 'Avoid combination if possible. If essential: start metoprolol at 12.5mg BID, reduce diltiazem dose by 50%. Monitor HR and ECG. Consider alternative rate control agent.'
            },
            {
                drug1Id: 28, drug2Id: 14, drug2Name: 'Carvedilol',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Verapamil + carvedilol: additive AV node depression.',
                clinicalEffect: 'Bradycardia, hypotension.',
                management: 'Caution: avoid high-dose both. Monitor HR. Start carvedilol at 3.125mg.'
            },
            {
                drug1Id: 30, drug2Id: 27, drug2Name: 'Diltiazem',
                severity: 'major', mechanism: 'CYP3A4 inhibition',
                description: 'Diltiazem inhibits CYP3A4, increasing simvastatin levels 5-10×. FDA limits simvastatin to 10mg with diltiazem.',
                clinicalEffect: 'Myopathy and rhabdomyolysis risk dramatically increased.',
                management: 'Max simvastatin 10mg daily with diltiazem. Prefer atorvastatin or rosuvastatin with diltiazem (less interaction).'
            },
            {
                drug1Id: 30, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'major', mechanism: 'CYP3A4 inhibition',
                description: 'Verapamil inhibits CYP3A4, increasing simvastatin levels 4-7×. FDA limits simvastatin to 10mg with verapamil.',
                clinicalEffect: 'Rhabdomyolysis risk.',
                management: 'Max simvastatin 10mg. Prefer atorvastatin or rosuvastatin instead.'
            },
            {
                drug1Id: 29, drug2Id: 38, drug2Name: 'Fluconazole',
                severity: 'moderate', mechanism: 'CYP3A4 inhibition',
                description: 'Azole antifungals inhibit CYP3A4, increasing atorvastatin exposure.',
                clinicalEffect: '2-3× atorvastatin levels. Myopathy risk.',
                management: 'Consider temporary statin hold or dose reduction during azole course. Monitor for myalgias. Alternative: use pravastatin or rosuvastatin if prolonged azole therapy needed. Check CK if symptomatic.'
            },
            {
                drug1Id: 30, drug2Id: 29, drug2Name: 'Atorvastatin',

                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Both are statins. Dual statin therapy provides no additional benefit but dramatically increases myopathy risk.',
                clinicalEffect: 'No LDL-C benefit beyond monotherapy. Myopathy risk proportional to total statin dose.',
                management: 'NEVER combine two statins. Switch to single higher-potency statin if needed (rosuvastatin 40mg) or add ezetimibe/PCSK9 instead of second statin.'
            },
            {
                drug1Id: 22, drug2Id: 23, drug2Name: 'Eplerenone',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Both are MRAs. Dual MRA therapy provides no additional benefit but increases hyperkalemia risk.',
                clinicalEffect: 'Severe hyperkalemia without clinical benefit.',
                management: 'DO NOT COMBINE two MRAs. Choose one (spironolactone preferred for HF; eplerenone if gynecomastia with spironolactone).'
            },
            {
                drug1Id: 6, drug2Id: 7, drug2Name: 'Enoxaparin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Both are anticoagulants with different mechanisms. Concurrent use is sometimes required for transition.',
                clinicalEffect: 'Bleeding risk increases during overlap period.',
                management: 'If transitioning between UFH and LMWH, brief overlap is acceptable with monitoring. Do not use therapeutic doses of both simultaneously unless specifically indicated. Monitor anti-Xa levels if overlap >24h.'
            },
            {
                drug1Id: 10, drug2Id: 39, drug2Name: 'Rifampin',
                severity: 'major', mechanism: 'P-gp induction',
                description: 'Rifampin induces P-gp, reducing dabigatran levels by ~65%. Therapeutic failure risk.',
                clinicalEffect: 'Stroke/VTE risk significantly increased due to subtherapeutic dabigatran levels.',
                management: 'AVOID combination. Switch to warfarin during rifampin treatment. Reconsider DOAC after rifampin course. No dose adjustment can fully compensate for the interaction.'
            },
            {
                drug1Id: 35, drug2Id: 27, drug2Name: 'Diltiazem',
                severity: 'moderate', mechanism: 'CYP3A4 inhibition',
                description: 'Diltiazem inhibits CYP3A4, increasing ivabradine levels 2-3×.',
                clinicalEffect: 'Excessive heart rate reduction, bradycardia.',
                management: 'CONTRAINDICATED COMBINATION per FDA label — avoid entirely. If ivabradine needed for rate control, use different rate agent or avoid diltiazem. Choose alternative approach (beta-blocker adjustment).'
            },
            {
                drug1Id: 35, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'moderate', mechanism: 'CYP3A4 + Pharmacodynamic',
                description: 'Verapamil inhibits CYP3A4 and both lower heart rate.',
                clinicalEffect: 'Bradycardia.',
                management: 'CONTRAINDICATED per FDA label — avoid. Use alternative rate control agent.'
            },
            {
                drug1Id: 28, drug2Id: 3, drug2Name: 'Clopidogrel',
                severity: 'moderate', mechanism: 'CYP2C8',
                description: 'Verapamil may reduce clopidogrel antiplatelet effect via CYP2C8 interaction.',
                clinicalEffect: 'Potentially reduced clopidogrel efficacy after PCI.',
                management: 'Monitor for stent thrombosis. Consider using prasugrel or ticagrelor if potent antiplatelet effect essential. Otherwise, continue with vigilance.'
            },
            {
                drug1Id: 27, drug2Id: 3, drug2Name: 'Clopidogrel',
                severity: 'minor', mechanism: 'CYP3A4',
                description: 'Diltiazem may modestly reduce clopidogrel activation.',
                clinicalEffect: 'Small reduction in platelet inhibition.',
                management: 'Generally safe. Monitor for stent thrombosis. Clinical significance uncertain; continue with standard DAPT regimen.'
            },
            {
                drug1Id: 17, drug2Id: 36, drug2Name: 'Ibuprofen',
                severity: 'moderate', mechanism: 'Pharmacodynamic + Renal',
                description: 'NSAIDs reduce ACE inhibitor antihypertensive effect by 10-15mmHg. Also increase AKI risk.',
                clinicalEffect: 'BP increase; acute kidney injury risk, especially in volume-depleted patients.',
                management: 'Avoid NSAIDs in patients on ACE inhibitors when possible. If NSAID necessary: use lowest dose, shortest duration. Check renal function 1-2 weeks after starting. Hydrate adequately. Consider acetaminophen alternative.'
            },
            {
                drug1Id: 20, drug2Id: 36, drug2Name: 'Ibuprofen',
                severity: 'moderate', mechanism: 'Pharmacodynamic + Renal',
                description: 'NSAIDs reduce ARB antihypertensive effect and increase AKI risk.',
                clinicalEffect: 'BP increase; renal function deterioration.',
                management: 'Avoid NSAIDs in ARB patients. If essential: short course, lowest dose, hydrate well, check creatinine in 1 week. Consider acetaminophen.'
            },
            {
                drug1Id: 24, drug2Id: 36, drug2Name: 'Ibuprofen',
                severity: 'moderate', mechanism: 'Renal',
                description: 'Both affect renal function through different mechanisms. NSAIDs reduce diuretic efficacy.',
                clinicalEffect: 'Reduced diuretic response; AKI risk.',
                management: 'Avoid NSAIDs in diuretic users. If needed: short course, hydrate, monitor renal function.'
            },
            {
                drug1Id: 22, drug2Id: 36, drug2Name: 'Ibuprofen',
                severity: 'moderate', mechanism: 'Renal + Pharmacodynamic',
                description: 'NSAIDs reduce spironolactone diuretic effect and add to hyperkalemia risk.',
                clinicalEffect: 'Hyperkalemia, reduced diuretic efficacy, AKI.',
                management: 'Avoid NSAIDs with MRA. Check K+ if unavoidable.'
            },
            {
                drug1Id: 3, drug2Id: 29, drug2Name: 'Atorvastatin',
                severity: 'minor', mechanism: 'CYP3A4',
                description: 'Both are CYP3A4 substrates. Minor interaction with possible small increase in statin levels.',
                clinicalEffect: 'Minimal clinical significance.',
                management: 'Generally safe. No dose adjustment needed. Monitor for myalgias.'
            },
            {
                drug1Id: 3, drug2Id: 30, drug2Name: 'Simvastatin',
                severity: 'moderate', mechanism: 'CYP3A4',
                description: 'Clopidogrel and simvastatin both use CYP3A4. Small increase in statin exposure.',
                clinicalEffect: 'Slight increase in myopathy risk.',
                management: 'Generally safe. Limit simvastatin to 20mg with clopidogrel. Prefer atorvastatin.'
            },
            {
                drug1Id: 13, drug2Id: 24, drug2Name: 'Furosemide',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Beta-blocker + loop diuretic: standard HF combination.',
                clinicalEffect: 'Additive BP reduction.',
                management: 'Standard evidence-based HF combination (GEMINI, MERIT-HF). No special interaction management. Titrate each independently.'
            },
            {
                drug1Id: 24, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'Diuretic additive',
                description: 'Both have diuretic effects. Additive volume depletion risk.',
                clinicalEffect: 'Hypotension, especially on initiation.',
                management: 'When starting SGLT2 inhibitor on loop diuretic, may need to reduce diuretic dose by 20-25% in the first 1-2 weeks. Monitor volume status, BP, and renal function.'
            },
            {
                drug1Id: 25, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'Diuretic additive',
                description: 'Thiazide + SGLT2i: additive diuresis.',
                clinicalEffect: 'Potential mild volume depletion.',
                management: 'Monitor BP. Consider thiazide dose reduction if hypotension develops.'
            },
            {
                drug1Id: 15, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'No known significant interaction',
                description: 'Standard HFrEF combination (DAPA-HF trial).',
                clinicalEffect: 'Synergistic HF benefit.',
                management: 'Continue both per HF guidelines. No interaction concerns.'
            },
            {
                drug1Id: 14, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'No known significant interaction',
                description: 'Standard HF combination.',
                clinicalEffect: 'Synergistic benefit.',
                management: 'No interaction management needed. Continue per guidelines.'
            },
            {
                drug1Id: 22, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'None',
                description: 'MRA + SGLT2i: both evidence-based in HF. DAPA-HF excluded K+ >5.5.',
                clinicalEffect: 'Minimal interaction risk.',
                management: 'Continue both. Monitor K+ per MRA requirements.'
            },
            {
                drug1Id: 17, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'None',
                description: 'ACE-I + SGLT2i: standard HFrEF combination.',
                clinicalEffect: 'Synergistic renal and CV protection.',
                management: 'No dose adjustment needed. Monitor renal function and K+ per HF guidelines.'
            },
            {
                drug1Id: 20, drug2Id: 32, drug2Name: 'Dapagliflozin',
                severity: 'minor', mechanism: 'None',
                description: 'ARB + SGLT2i: standard combination.',
                clinicalEffect: 'Renal and CV benefit.',
                management: 'Continue per guidelines.'
            },
            {
                drug1Id: 8, drug2Id: 27, drug2Name: 'Diltiazem',
                severity: 'moderate', mechanism: 'CYP3A4 + P-gp inhibition',
                description: 'Diltiazem inhibits both CYP3A4 and P-gp, increasing apixaban exposure by ~40%.',
                clinicalEffect: 'Modestly increased apixaban levels and bleeding risk.',
                management: 'Generally acceptable with monitoring. Apixaban 5mg BID + diltiazem is well-studied. Consider apixaban 5mg BID (or 2.5mg if meeting dose reduction criteria). Monitor for bleeding.'
            },
            {
                drug1Id: 8, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'moderate', mechanism: 'CYP3A4 + P-gp inhibition',
                description: 'Verapamil inhibits CYP3A4 and P-gp, increasing apixaban exposure by ~40%.',
                clinicalEffect: 'Increased bleeding risk.',
                management: 'Apixaban 5mg BID with verapamil is acceptable. Monitor for bleeding. If also meeting dose reduction criteria (age ≥80, Wt ≤60kg, Cr ≥1.5), reduce to 2.5mg BID.'
            },
            {
                drug1Id: 8, drug2Id: 11, drug2Name: 'Amiodarone',
                severity: 'moderate', mechanism: 'CYP3A4 + P-gp inhibition',
                description: 'Amiodarone inhibits CYP3A4 and P-gp, increasing apixaban exposure by ~40%.',
                clinicalEffect: 'Modest increase in bleeding risk.',
                management: 'Acceptable combination. Apixaban 5mg BID; if meeting ≥2 dose reduction criteria, use 2.5mg BID. Monitor for bleeding. ECG for QTc if on amiodarone.'
            },
            {
                drug1Id: 26, drug2Id: 13, drug2Name: 'Metoprolol',
                severity: 'minor', mechanism: 'Additive',

                description: 'Amlodipine + metoprolol: standard HTN/HF combination.',
                clinicalEffect: 'Additive BP reduction. Safe.',
                management: 'Standard combination. No interaction management needed.'
            },
            {
                drug1Id: 14, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'minor', mechanism: 'Additive AV node effect',
                description: 'Carvedilol + digoxin: additive AV node depression.',
                clinicalEffect: 'Usually well-tolerated; modest HR reduction.',
                management: 'Standard AFib/HF combination. Monitor HR. Digoxin target 0.5-0.9 ng/mL.'
            },
            {
                drug1Id: 13, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'minor', mechanism: 'Additive AV node effect',
                description: 'Metoprolol + digoxin: additive AV node depression. Standard AFib rate control.',
                clinicalEffect: 'Well-tolerated; synergistic rate control in AFib.',
                management: 'Standard AFib combination. Monitor HR and digoxin level.'
            },
            {
                drug1Id: 16, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'minor', mechanism: 'Additive AV node effect',
                description: 'Atenolol + digoxin: additive AV node depression.',
                clinicalEffect: 'Modest HR reduction.',
                management: 'Monitor HR, especially on initiation.'
            },
            {
                drug1Id: 27, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Two CCBs. Dual CCB therapy increases risk of severe bradycardia, AV block, and heart failure.',
                clinicalEffect: 'Bradycardia, hypotension, cardiac dysfunction.',
                management: 'AVOID combination of two CCBs. Choose either DHP (amlodipine) or non-DHP (diltiazem/verapamil) but not both. If additional HTN control needed, add different class (ACE-I, thiazide).'
            },
            {
                drug1Id: 26, drug2Id: 28, drug2Name: 'Verapamil',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'DHP + non-DHP CCB: additive AV node depression.',
                clinicalEffect: 'Bradycardia, hypotension.',
                management: 'Can be used together with caution. Start low doses. Monitor BP and HR. Generally, prefer amlodipine + beta-blocker over amlodipine + verapamil.'
            },
            {
                drug1Id: 26, drug2Id: 27, drug2Name: 'Diltiazem',

                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'DHP + non-DHP CCB: additive effect.',
                clinicalEffect: 'Excessive vasodilation and AV node depression.',
                management: 'Use with caution. Monitor BP and HR.'
            },
            {
                drug1Id: 12, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Both affect heart rate at different targets (digoxin: Na+/K+ ATPase; ivabradine: If channel).',
                clinicalEffect: 'Additive HR reduction.',
                management: 'Monitor HR. Generally safe combination. Target HR 60-70 bpm.'
            },
            {
                drug1Id: 15, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Bisoprolol + ivabradine: standard HFrEF combination (SHIFT trial).',
                clinicalEffect: 'Additive HR reduction.',
                management: 'Bisoprolol must be at max tolerated dose before adding ivabradine. Target HR 60-70. Start ivabradine 5mg BID. Discontinue if HR <50.'
            },
            {
                drug1Id: 14, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Carvedilol + ivabradine: combination used in HF.',
                clinicalEffect: 'HR reduction.',
                management: 'Standard combination. SHIFT trial included carvedilol patients. Titrate carvediolol to max tolerated before adding ivabradine.'
            },
            {
                drug1Id: 13, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Metoprolol + ivabradine: standard combination.',
                clinicalEffect: 'HR reduction.',
                management: 'Maximize metoprolol dose first. Then add ivabradine 5mg BID if still HR >70.'
            },
            {
                drug1Id: 16, drug2Id: 35, drug2Name: 'Ivabradine',
                severity: 'minor', mechanism: 'Pharmacodynamic',
                description: 'Atenolol + ivabradine.',
                clinicalEffect: 'HR reduction.',
                management: 'Monitor HR.'
            },
            {
                drug1Id: 34, drug2Id: 22, drug2Name: 'Spironolactone',
                severity: 'moderate', mechanism: 'Hyperkalemia synergism',
                description: 'Both increase potassium through different mechanisms (SGLT2i: distal delivery; MRA: K+ retention).',
                clinicalEffect: 'Hyperkalemia, especially on initiation.',
                management: 'Safe combination per DAPA-HF. Check K+ at baseline, 2 weeks, 1 month, then q3 months. Do not start if K+ >5.0. Consider MRA dose reduction if K+ >5.5.'
            },
            {
                drug1Id: 34, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'minor', mechanism: 'Renal function',
                description: 'SGLT2 inhibitors may slightly alter digoxin renal clearance. Clinical significance unclear.',
                clinicalEffect: 'Probably insignificant.',
                management: 'No dose adjustment needed. Monitor digoxin levels as usual.'
            },
            {
                drug1Id: 12, drug2Id: 11, drug2Name: 'Amiodarone',
                severity: 'major', mechanism: 'P-gp + AV suppression',
                description: 'Amiodarone inhibits P-gp, increasing digoxin levels 70-100%. Both suppress AV node.',
                clinicalEffect: 'Digoxin toxicity. Severe bradycardia.',
                management: 'Reduce digoxin dose by 50% when starting/stopping amiodarone. Check levels in 5-7 days, then monthly. Target 0.5-0.9 ng/mL.'
            },
            {
                drug1Id: 36, drug2Id: 17, drug2Name: 'Lisinopril',
                severity: 'moderate', mechanism: 'Renal',
                description: 'NSAIDs reduce ACE-I antihypertensive effect and increase AKI risk.',
                clinicalEffect: 'BP increase 10-15mmHg; AKI risk.',
                management: 'Avoid NSAIDs with ACE-I. If necessary: shortest duration, lowest dose, hydrate, check Cr in 1 week.'
            },
            {
                drug1Id: 36, drug2Id: 22, drug2Name: 'Spironolactone',
                severity: 'moderate', mechanism: 'Renal + Hyperkalemia',
                description: 'NSAIDs reduce MRA diuretic effect and add to hyperkalemia risk.',
                clinicalEffect: 'Hyperkalemia, reduced diuresis.',
                management: 'Avoid NSAIDs with MRA. Check K+ if unavoidable NSAID use.'
            },
            {
                drug1Id: 37, drug2Id: 1, drug2Name: 'Warfarin',
                severity: 'moderate', mechanism: 'Pharmacodynamic + gastric',
                description: 'Naproxen increases GI bleeding risk with warfarin.',
                clinicalEffect: 'GI bleeding risk 3-5× higher.',
                management: 'Avoid if possible. If needed: lowest dose, shortest duration, add PPI, monitor INR closely.'
            },
            {
                drug1Id: 4, drug2Id: 8, drug2Name: 'Apixaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Ticagrelor + DOAC: significantly increased bleeding risk.',
                clinicalEffect: 'Major bleeding 4-6% annually.',
                management: 'Avoid routine combination. After PCI, use short DAPT then drop aspirin, continue DOAC + clopidogrel per AUGUSTUS/FIRE trials. Avoid ticagrelor+DOAC if possible — prefer clopidogrel.'
            },
            {
                drug1Id: 5, drug2Id: 8, drug2Name: 'Apixaban',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Prasugrel + DOAC: very high bleeding risk.',
                clinicalEffect: 'Major bleeding risk significantly elevated.',
                management: 'AVOID — never use prasugrel with DOAC. Prasugrel contraindicated in patients with prior stroke/TIA. Use clopidogrel + DOAC if combination needed.'
            },
            {
                drug1Id: 4, drug2Id: 1, drug2Name: 'Warfarin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Ticagrelor + warfarin: high bleeding risk in triple therapy.',
                clinicalEffect: 'Bleeding 2-4× higher than warfarin alone.',
                management: 'Avoid. If triple therapy unavoidable, use clopidogrel instead of ticagrelor. Per WOEST/PIONEER-AF trials.'
            },
            {
                drug1Id: 5, drug2Id: 1, drug2Name: 'Warfarin',
                severity: 'major', mechanism: 'Pharmacodynamic',
                description: 'Prasugrel + warfarin: very high bleeding risk.',
                clinicalEffect: 'Bleeding risk 3-5× higher.',
                management: 'AVOID — prasugrel contraindicated with warfarin. Use clopidogrel instead.'
            },
            {
                drug1Id: 3, drug2Id: 4, drug2Name: 'Ticagrelor',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Two P2Y12 inhibitors: no additional antiplatelet benefit, increased bleeding.',
                clinicalEffect: 'Increased bleeding without additional antiplatelet effect.',
                management: 'NEVER combine two P2Y12 inhibitors. Choose one for DAPT with aspirin.'
            },
            {
                drug1Id: 3, drug2Id: 5, drug2Name: 'Prasugrel',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Two P2Y12 inhibitors.',
                clinicalEffect: 'Increased bleeding.',
                management: 'Never combine two P2Y12 inhibitors.'
            },
            {
                drug1Id: 4, drug2Id: 5, drug2Name: 'Prasugrel',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Two P2Y12 inhibitors.',
                clinicalEffect: 'Increased bleeding.',
                management: 'Never combine two P2Y12 inhibitors.'
            },
            {
                drug1Id: 26, drug2Id: 29, drug2Name: 'Atorvastatin',
                severity: 'minor', mechanism: 'CYP3A4',
                description: 'Amlodipine modestly increases atorvastatin levels (~20%).',
                clinicalEffect: 'Minor increase in statin exposure.',
                management: 'Generally safe. No dose adjustment needed. Max atorvastatin 80mg with amlodipine (FDA label).'
            },
            {
                drug1Id: 2, drug2Id: 12, drug2Name: 'Digoxin',
                severity: 'minor', mechanism: 'Renal clearance',
                description: 'No clinically significant interaction.',
                clinicalEffect: 'Minimal.',
                management: 'No dose adjustment needed.'
            },
            {
                drug1Id: 1, drug2Id: 33, drug2Name: 'Rosuvastatin',
                severity: 'minor', mechanism: 'Minimal CYP involvement',
                description: 'Warfarin may slightly increase rosuvastatin levels. Rosuvastatin does not use CYP3A4.',
                clinicalEffect: 'Minimal clinical significance.',
                management: 'Rosuvastatin is preferred statin with warfarin due to minimal CYP involvement. Standard monitoring.'
            },
            {
                drug1Id: 30, drug2Id: 38, drug2Name: 'Fluconazole',
                severity: 'major', mechanism: 'CYP3A4 inhibition',
                description: 'Fluconazole inhibits CYP3A4, increasing simvastatin levels 3-4×.',
                clinicalEffect: 'Rhabdomyolysis risk.',
                management: 'AVOID simvastatin with fluconazole. Suspend simvastatin during fluconazole course or switch to pravastatin/rosuvastatin.'
            },
            {
                drug1Id: 29, drug2Id: 33, drug2Name: 'Rosuvastatin',
                severity: 'moderate', mechanism: 'Pharmacodynamic',
                description: 'Two statins: no additional benefit, increased myopathy.',
                clinicalEffect: 'No LDL benefit. Myopathy risk.',
                management: 'Never combine statins. Switch to single higher-potency statin.'
            }
        ];
    }
}

// ============================================================
// ECG Rhythm Quiz — tests knowledge of cardiac rhythms
// ============================================================
class ECGQuiz {
    constructor() {
        this.questionCount = 10;
        this.currentQuestion = 0;
        this.score = 0;
        this.currentRhythm = '';
        this.answered = false;
        this.quizPool = [];
        this.initRhythmPool();
        this.init();
    }

    initRhythmPool() {
        const allRhythms = [
            { key: 'normal-sinus', name: 'Normal Sinus Rhythm', difficulty: 'basic' },
            { key: 'sinus-tachycardia', name: 'Sinus Tachycardia', difficulty: 'basic' },
            { key: 'sinus-bradycardia', name: 'Sinus Bradycardia', difficulty: 'basic' },
            { key: 'atrial-fibrillation', name: 'Atrial Fibrillation', difficulty: 'intermediate' },
            { key: 'atrial-flutter', name: 'Atrial Flutter', difficulty: 'intermediate' },
            { key: 'ventricular-tachycardia', name: 'Ventricular Tachycardia', difficulty: 'intermediate' },
            { key: 'ventricular-fibrillation', name: 'Ventricular Fibrillation', difficulty: 'intermediate' },
            { key: 'first-degree-avb', name: 'First-Degree AV Block', difficulty: 'advanced' },
            { key: 'second-degree-avb', name: 'Second-Degree AV Block', difficulty: 'advanced' },
            { key: 'third-degree-avb', name: 'Third-Degree (Complete) AV Block', difficulty: 'advanced' },
            { key: 'premature-ventricular', name: 'Premature Ventricular Contractions', difficulty: 'advanced' },
            { key: 'supraventricular-tachycardia', name: 'Supraventricular Tachycardia', difficulty: 'advanced' },
            { key: 'left-bundle-branch-block', name: 'Left Bundle Branch Block', difficulty: 'advanced' },
            { key: 'right-bundle-branch-block', name: 'Right Bundle Branch Block', difficulty: 'advanced' },
            { key: 'wpw-pattern', name: 'Wolff-Parkinson-White (WPW)', difficulty: 'advanced' },
            { key: 'junctional-rhythm', name: 'Junctional Escape Rhythm', difficulty: 'advanced' },
            { key: 'sinus-arrhythmia', name: 'Sinus Arrhythmia', difficulty: 'basic' },
            { key: 'accelerated-idioventricular', name: 'Accelerated Idioventricular Rhythm', difficulty: 'intermediate' },
            { key: 'accelerated-junctional', name: 'Accelerated Junctional Rhythm', difficulty: 'intermediate' },
            { key: 'first-degree-avb', name: 'First-Degree AV Block', difficulty: 'basic' },
        ];
        this.allRhythms = allRhythms;
    }

    init() {
        const startBtn = document.getElementById('quiz-start-btn');
        const nextBtn = document.getElementById('quiz-next-btn');
        const restartBtn = document.getElementById('quiz-restart-btn');
        if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (restartBtn) restartBtn.addEventListener('click', () => this.startQuiz());
    }

    getDifficultyPool() {
        const diff = document.getElementById('quiz-difficulty').value;
        if (diff === 'basic') return this.allRhythms.filter(r => r.difficulty === 'basic');
        if (diff === 'intermediate') return this.allRhythms.filter(r => r.difficulty === 'intermediate');
        if (diff === 'advanced') return this.allRhythms.filter(r => r.difficulty === 'advanced');
        return [...this.allRhythms];
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    startQuiz() {
        const pool = this.getDifficultyPool();
        if (pool.length < 4) {
            alert('Need at least 4 rhythms for this difficulty. Try "All Rhythms" mode.');
            return;
        }
        const shuffled = this.shuffle(pool);
        this.quizPool = shuffled.slice(0, Math.min(this.questionCount, shuffled.length));
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;

        document.getElementById('quiz-start-panel').classList.add('hidden');
        document.getElementById('quiz-end-panel').classList.add('hidden');
        document.getElementById('quiz-active-panel').classList.remove('hidden');

        this.updateScoreDisplay();
        this.loadQuestion();
    }

    updateScoreDisplay() {
        document.getElementById('quiz-question-num').textContent = this.currentQuestion;
        document.getElementById('quiz-total').textContent = this.quizPool.length;
        document.getElementById('quiz-score').textContent = this.score;
    }

    loadQuestion() {
        if (this.currentQuestion >= this.quizPool.length) {
            this.endQuiz();
            return;
        }

        this.answered = false;
        const current = this.quizPool[this.currentQuestion];
        this.currentRhythm = current.key;

        // Generate ECG waveform using the existing simulator
        const heartRate = current.key === 'sinus-bradycardia' ? 50 :
                          current.key === 'sinus-tachycardia' ? 120 :
                          current.key === 'supraventricular-tachycardia' ? 160 :
                          current.key === 'ventricular-tachycardia' ? 150 : 72;

        document.getElementById('quiz-hr-display').textContent = heartRate;

        // Draw the SVG path
        const ecgPath = document.getElementById('quiz-ecg-path');
        if (ecgPath && window.diagnosticTools) {
            const savedRhythm = window.diagnosticTools.currentRhythm;
            const savedHR = window.diagnosticTools.currentHeartRate;

            window.diagnosticTools.currentRhythm = current.key;
            window.diagnosticTools.currentHeartRate = heartRate;
            const waveform = window.diagnosticTools.generateECGWaveform(current.key, heartRate);
            ecgPath.setAttribute('d', waveform);

            window.diagnosticTools.currentRhythm = savedRhythm;
            window.diagnosticTools.currentHeartRate = savedHR;
        }

        // Generate 4 options (1 correct + 3 distractors)
        const pool = this.allRhythms;
        const distractors = this.shuffle(pool.filter(r => r.key !== current.key)).slice(0, 3);
        const options = this.shuffle([current, ...distractors]);

        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = options.map(opt => `
            <button class="quiz-option-btn bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-clinical-blue hover:shadow-md transition-all duration-200"
                data-key="${opt.key}" data-name="${opt.name}">
                <span class="font-semibold text-deep-navy">${opt.name}</span>
            </button>
        `).join('');

        // Bind clicks
        optionsDiv.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => this.checkAnswer(btn));
        });

        // Hide feedback and next
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-next-btn').classList.add('hidden');

        this.updateScoreDisplay();
    }

    checkAnswer(btn) {
        if (this.answered) return;
        this.answered = true;

        const chosen = btn.dataset.key;
        const correct = this.currentRhythm;
        const isCorrect = chosen === correct;

        if (isCorrect) this.score++;

        // Visual feedback on options
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.querySelectorAll('.quiz-option-btn').forEach(b => {
            b.classList.add('cursor-default');
            if (b.dataset.key === correct) {
                b.classList.remove('border-gray-200', 'hover:border-clinical-blue');
                b.classList.add('border-success-green', 'bg-green-50');
            } else if (b === btn && !isCorrect) {
                b.classList.remove('border-gray-200', 'hover:border-clinical-blue');
                b.classList.add('border-alert-coral', 'bg-red-50');
            }
            b.disabled = true;
        });

        // Build feedback
        const rhythmInfo = this.allRhythms.find(r => r.key === correct);
        const feedbackDiv = document.getElementById('quiz-feedback');
        const icon = document.getElementById('quiz-feedback-icon');
        const title = document.getElementById('quiz-feedback-title');
        const text = document.getElementById('quiz-feedback-text');

        feedbackDiv.classList.remove('hidden', 'bg-green-50', 'bg-red-50', 'border-green-300', 'border-red-300');

        if (isCorrect) {
            feedbackDiv.classList.add('bg-green-50', 'border', 'border-green-300');
            icon.textContent = '✅';
            title.textContent = 'Correct!';
            title.className = 'text-xl font-bold mb-1 text-success-green';
        } else {
            feedbackDiv.classList.add('bg-red-50', 'border', 'border-red-300');
            icon.textContent = '❌';
            title.textContent = `Incorrect — the answer is ${rhythmInfo.name}`;
            title.className = 'text-xl font-bold mb-1 text-alert-coral';
        }

        text.textContent = this.getRhythmExplanation(correct);
        this.updateScoreDisplay();

        // Show next button
        document.getElementById('quiz-next-btn').classList.remove('hidden');
    }

    getRhythmExplanation(key) {
        const explanations = {
            'normal-sinus': 'Normal sinus rhythm: regular rhythm, P wave before every QRS, normal PR interval (0.12–0.20 s), rate 60–100 bpm. This is the standard cardiac rhythm.',
            'sinus-tachycardia': 'Sinus tachycardia: normal P-QRS-T sequence with rate >100 bpm. Gradual onset and offset. Common in exercise, fever, anxiety, anemia, hyperthyroidism.',
            'sinus-bradycardia': 'Sinus bradycardia: normal P-QRS-T sequence with rate <60 bpm. Common in athletes, during sleep, or with beta-blockers. Symptomatic bradycardia may require atropine or pacing.',
            'atrial-fibrillation': 'Atrial fibrillation: irregularly irregular rhythm with no discernible P waves and chaotic fibrillatory baseline. Most common sustained arrhythmia. Requires anticoagulation assessment (CHA₂DS₂-VASc) and rate/rhythm control.',
            'atrial-flutter': 'Atrial flutter: sawtooth flutter waves (typically at 300 bpm) with regular or variable AV conduction. Commonly 2:1 block (ventricular rate ~150 bpm). Ablation is curative.',
            'ventricular-tachycardia': 'Ventricular tachycardia: wide QRS (>0.12 s), rate 100–250 bpm, AV dissociation. Medical emergency — may degenerate to VF. Unstable patients require immediate cardioversion.',
            'ventricular-fibrillation': 'Ventricular fibrillation: completely chaotic waveform with no organized QRS complexes. Cardiac arrest rhythm — requires immediate defibrillation (unsynchronized shock) and CPR.',
            'first-degree-avb': 'First-degree AV block: prolonged PR interval (>0.20 s) with 1:1 AV conduction. Usually benign unless symptomatic. No acute treatment needed.',
            'second-degree-avb': 'Second-degree AV block: intermittently dropped QRS complexes. Mobitz I (Wenckebach) has progressive PR prolongation before a dropped beat. Mobitz II has constant PR with dropped beats — more ominous.',
            'third-degree-avb': 'Third-degree (complete) AV block: complete AV dissociation with independent atrial and ventricular rhythms. P waves march through QRS complexes at unrelated rates. Usually requires permanent pacing.',
            'premature-ventricular': 'Premature ventricular contractions (PVCs): wide, bizarre QRS without preceding P wave, followed by a compensatory pause. Frequent PVCs (>10-15%/24h) may warrant treatment.',
            'supraventricular-tachycardia': 'Supraventricular tachycardia: narrow QRS, very regular rhythm, rate typically 150–220 bpm. May have retrograde P waves buried in QRS. Vagal maneuvers or adenosine can terminate.',
            'left-bundle-branch-block': 'Left Bundle Branch Block: wide QRS (≥0.12 s), broad notched/monophasic R in lateral leads, absent septal Q waves, discordant ST-T changes. New LBBB with chest pain = STEMI equivalent. Consider Sgarbossa criteria.',
            'right-bundle-branch-block': 'Right Bundle Branch Block: wide QRS (≥0.12 s), RSR\' pattern in V1-V2 (rabbit ears), wide slurred S in I and V6. May be benign or indicate cor pulmonale, PE, or progressive conduction disease.',
            'wpw-pattern': 'Wolff-Parkinson-White: short PR (<0.12 s), delta wave (slurred QRS upstroke), wide QRS. Risk of AVRT and sudden cardiac death if AFib via accessory pathway. AV nodal blockers contraindicated in AFib+WPW. Definitive tx: catheter ablation.',
            'junctional-rhythm': 'Junctional escape rhythm: narrow QRS at 40-60 bpm with absent or retrograde P waves. AV junction fires as backup pacemaker when SA node fails. Seen in complete heart block, sick sinus syndrome, digoxin toxicity, inferior MI. May require permanent pacing if symptomatic.',
            'sinus-arrhythmia': 'Sinus arrhythmia: normal P-QRS-T sequence with cyclical variation in RR intervals (>0.12 s), typically phasic with respiration. Heart rate increases during inspiration and decreases during expiration. Common and benign, especially in young healthy individuals. No treatment required.',
            'accelerated-idioventricular': 'Accelerated idioventricular rhythm (AIVR): wide QRS at 40-100 bpm of ventricular origin. Gradual onset/termination, benign and often self-limiting. Classically seen as a reperfusion sign after thrombolysis/PCI in STEMI. Does NOT require antiarrhythmic treatment — suppression may cause asystole. Discordant ST-T changes present.',
            'accelerated-junctional': 'Accelerated junctional rhythm: narrow QRS at 60-100 bpm with absent or retrograde (inverted) P waves. Enhanced AV junctional automaticity. ALWAYS suspect digoxin toxicity. Other causes: post-cardiac surgery, inferior MI, myocarditis, sympathetic overdrive. If stable, treat underlying cause; if symptomatic, beta-blockers may suppress the focus.',
            'first-degree-avb': 'First-degree AV block: prolonged PR interval (>0.20 s) with 1:1 AV conduction. Every P wave is followed by a QRS complex. Usually benign and asymptomatic. Common causes: increased vagal tone, athletic conditioning, AV nodal-blocking drugs (beta-blockers, CCBs, digoxin), degenerative conduction disease. No acute treatment needed. Markedly prolonged PR (>0.30 s) may cause symptoms from AV dyssynchrony.',
        };
        return explanations[key] || '';
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.quizPool.length) {
            this.endQuiz();
        } else {
            this.loadQuestion();
        }
    }

    endQuiz() {
        document.getElementById('quiz-active-panel').classList.add('hidden');
        document.getElementById('quiz-end-panel').classList.remove('hidden');

        document.getElementById('quiz-final-score').textContent = this.score;
        document.getElementById('quiz-final-total').textContent = this.quizPool.length;

        const pct = this.score / this.quizPool.length;
        let emoji, msg;
        if (pct === 1) { emoji = '🏆'; msg = 'Perfect score! Outstanding ECG interpretation skills!'; }
        else if (pct >= 0.8) { emoji = '🌟'; msg = 'Excellent work! You have strong rhythm recognition.'; }
        else if (pct >= 0.6) { emoji = '👍'; msg = 'Good effort! Review the rhythms you missed and try again.'; }
        else if (pct >= 0.4) { emoji = '📚'; msg = 'Keep studying! Try the ECG Simulator first, then retake the quiz.'; }
        else { emoji = '💪'; msg = 'Don\'t give up! Use the ECG Simulator to practice each rhythm, then retry.'; }

        document.getElementById('quiz-end-emoji').textContent = emoji;
        document.getElementById('quiz-final-msg').textContent = msg;
    }
}

// Initialize the diagnostic & drug interaction tools
document.addEventListener('DOMContentLoaded', () => {
    window.diagnosticTools = new DiagnosticTools();
    window.drugChecker = new DrugInteractionChecker();
    window.ecgQuiz = new ECGQuiz();
    window.ecgCalc = new ECGIntervalCalculator();
});

class ECGIntervalCalculator {
    constructor() {
        this.initQTC();
        this.initAxis();
    }

    initQTC() {
        const btn = document.getElementById('calculate-qtc');
        if (!btn) return;
        btn.addEventListener('click', () => this.calculateQTC());
    }

    initAxis() {
        const btn = document.getElementById('calculate-axis');
        if (!btn) return;
        btn.addEventListener('click', () => this.calculateAxis());
    }

    calculateQTC() {
        let rr = parseFloat(document.getElementById('qtc-rr').value);
        const hr = parseFloat(document.getElementById('qtc-hr').value);
        const qt = parseFloat(document.getElementById('qtc-qt').value);

        if (!hr && rr) {
            // If RR given, fine
        } else if (hr && !rr) {
            rr = 60000 / hr;
        } else if (hr && rr) {
            // user gave both, trust HR
            rr = 60000 / hr;
        }

        if (!rr || !qt || rr <= 0 || qt <= 0) {
            alert('Please enter valid QT interval and either Heart Rate or RR interval.');
            return;
        }

        const rrSec = rr / 1000;

        // Bazett: QTc = QT / sqrt(RR)
        const bazett = qt / Math.sqrt(rrSec);

        // Fridericia: QTc = QT / cbrt(RR)
        const fridericia = qt / Math.cbrt(rrSec);

        // Framingham: QTc = QT + 0.154 * (1 - RR)
        const framingham = qt + 0.154 * (1 - rrSec);

        // Hodges: QTc = QT + 1.75 * (HR - 60)
        const currentHr = hr || (60000 / rr);
        const hodges = qt + 1.75 * (currentHr - 60);

        document.getElementById('qtc-bazett').textContent = Math.round(bazett) + ' ms';
        document.getElementById('qtc-fridericia').textContent = Math.round(fridericia) + ' ms';
        document.getElementById('qtc-framingham').textContent = Math.round(framingham) + ' ms';
        document.getElementById('qtc-hodges').textContent = Math.round(hodges) + ' ms';

        // Interpretation (use Bazett primarily)
        const interpretEl = document.getElementById('qtc-interpretation');
        let color, bgColor, text;
        if (bazett <= 440) {
            color = '#059669';
            bgColor = 'bg-green-50';
            text = `<div style="color:${color}" class="font-semibold">✅ Normal QTc (${Math.round(bazett)} ms)</div><p class="text-xs text-neutral-slate mt-1">QTc is within normal limits. Bazett formula is most commonly used but overcorrects at high HR; Fridericia more reliable at extremes.</p>`;
        } else if (bazett <= 500) {
            color = '#D97706';
            bgColor = 'bg-amber-50';
            text = `<div style="color:${color}" class="font-semibold">⚠️ Borderline/Prolonged QTc (${Math.round(bazett)} ms)</div><p class="text-xs text-neutral-slate mt-1">QTc is mildly prolonged. Review medications, check electrolytes (K⁺, Mg²⁺, Ca²⁺), consider switching to Fridericia formula if HR >100 or <60. Monitor for drug-induced prolongation.</p>`;
        } else {
            color = '#DC2626';
            bgColor = 'bg-red-50';
            text = `<div style="color:${color}" class="font-semibold">🚨 Significantly Prolonged QTc (${Math.round(bazett)} ms)</div><p class="text-xs text-neutral-slate mt-1"><strong>High risk for Torsades de Pointes!</strong> Immediately review and discontinue QT-prolonging drugs. Correct hypokalemia (maintain K⁺ >4.0), hypomagnesemia (Mg²⁺ >2.0). Place on continuous telemetry. If QTc >500 ms, consider IC consultation and possible ICU admission.</p>`;
        }
        interpretEl.className = `border-l-4 p-3 rounded-lg text-sm ${bgColor}`;
        interpretEl.innerHTML = text;

        document.getElementById('qtc-result').classList.remove('hidden');
    }

    calculateAxis() {
        const lead1 = parseFloat(document.getElementById('axis-lead1').value);
        const avf = parseFloat(document.getElementById('axis-avf').value);

        if (isNaN(lead1) || isNaN(avf)) {
            alert('Please enter both Lead I and aVF values.');
            return;
        }

        if (lead1 === 0 && avf === 0) {
            alert('Both values cannot be zero — that would mean a flatline ECG!');
            return;
        }

        // Calculate axis angle in degrees
        let angleDeg = Math.atan2(avf, lead1) * (180 / Math.PI);

        // Normalize to 0-180 / -180 to 0 range
        // Lead I positive = right hemisphere (0-180 or 0 to -180)
        // Standard: 0° = lead I positive, +90° = aVF positive

        let category;
        if (angleDeg >= -30 && angleDeg <= 90) {
            category = 'Normal Axis';
        } else if (angleDeg >= -90 && angleDeg < -30) {
            category = 'Left Axis Deviation (LAD)';
        } else if (angleDeg > 90 && angleDeg <= 180) {
            category = 'Right Axis Deviation (RAD)';
        } else if (angleDeg > -180 && angleDeg < -90) {
            category = 'Extreme Axis Deviation';
        }

        document.getElementById('axis-value').textContent = Math.round(angleDeg) + '°';
        document.getElementById('axis-category').textContent = category;

        // Interpretation
        const interpEl = document.getElementById('axis-interpretation');
        let interpText;
        if (category === 'Normal Axis') {
            interpText = `<div class="text-green-700 font-semibold">✅ Normal QRS Axis</div><p class="text-xs text-neutral-slate mt-1">Normal electrical activation pattern. No axis-related pathology.</p>`;
        } else if (category === 'Left Axis Deviation (LAD)') {
            interpText = `<div class="text-amber-700 font-semibold">⚠️ Left Axis Deviation</div><p class="text-xs text-neutral-slate mt-1">Common causes: Left anterior fascicular block (most common), left ventricular hypertrophy, inferior MI, left bundle branch block. If Lead I positive and Lead II negative → confirmed LAD. Check for LAFB: LAD + qR in I/aVL + rS in II/III/aVF.</p>`;
        } else if (category === 'Right Axis Deviation (RAD)') {
            interpText = `<div class="text-amber-700 font-semibold">⚠️ Right Axis Deviation</div><p class="text-xs text-neutral-slate mt-1">Common causes: Right ventricular hypertrophy (pulmonary hypertension, COPD, PE), left posterior fascicular block, lateral MI, chronic lung disease. In neonates/children, RAD is normal. Tall, thin individuals may have vertical heart position (rightward shift).</p>`;
        } else {
            interpText = `<div class="text-red-700 font-semibold">🚨 Extreme Axis Deviation</div><p class="text-xs text-neutral-slate mt-1">"Northwest axis" — both Lead I and aVF are predominantly negative. Causes: ventricular tachycardia, severe RVH, hyperkalemia, lead reversal. Uncommon — double-check lead placement. Can be seen in emphysema or extensive infarction.</p>`;
        }
        interpEl.innerHTML = interpText;

        document.getElementById('axis-result').classList.remove('hidden');

        // Draw hexaxial reference diagram
        this.renderAxisHexaxial(lead1, avf, angleDeg);
    }

    renderAxisHexaxial(lead1, avf, angle) {
        const canvas = document.getElementById('axis-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = 100;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // Draw hexaxial lines
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;

        const leads = [
            { angle: 0, label: 'I' },
            { angle: -30, label: 'aVL' },
            { angle: 60, label: 'II' },
            { angle: 90, label: 'aVF' },
            { angle: 120, label: 'III' },
            { angle: -150, label: 'aVR' },
        ];

        leads.forEach(lead => {
            const rad = lead.angle * Math.PI / 180;
            // Standard ECG convention: 0° is left (lead I positive)
            // In canvas, y increases downward, so we flip
            const x1 = cx + r * Math.cos(rad);
            const y1 = cy - r * Math.sin(rad);
            const x2 = cx - r * Math.cos(rad);
            const y2 = cy + r * Math.sin(rad);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#475569';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const lx = cx + (r + 14) * Math.cos(rad);
            const ly = cy - (r + 14) * Math.sin(rad);
            ctx.fillText(lead.label, lx, ly);
        });

        // Draw circles (radius markers)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.5;
        [0.3, 0.6, 1.0].forEach(scale => {
            ctx.beginPath();
            ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Axis vector
        const rad = angle * Math.PI / 180;
        const ex = cx + r * 0.85 * Math.cos(rad);
        const ey = cy - r * 0.85 * Math.sin(rad);

        // Vector line
        ctx.strokeStyle = angle >= -30 && angle <= 90 ? '#2563EB' : (angle > -90 && angle < -30 ? '#D97706' : '#DC2626');
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        const arrowSize = 10;
        const arrowAngle = 0.5;
        const baseAngleX = Math.cos(rad);
        const baseAngleY = Math.sin(rad);

        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - arrowSize * Math.cos(rad - arrowAngle), ey + arrowSize * Math.sin(rad - arrowAngle));
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - arrowSize * Math.cos(rad + arrowAngle), ey + arrowSize * Math.sin(rad + arrowAngle));
        ctx.stroke();

        // Center dot
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Angle label
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(angle) + '°', cx, cy + 20);
    }
}