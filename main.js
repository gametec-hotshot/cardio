// Comprehensive Cardiology Resource - Main JavaScript
// Professional medical reference with interactive features

class CardiologyResource {
    constructor() {
        this.disorders = [];
        this.filteredDisorders = [];
        this.searchIndex = {};
        this.init();
    }

    init() {
        this.loadDisorders();
        this.initializeSearch();
        this.initializeFilters();
        this.initializeAnimations();
        this.renderDisorders();
        this.setupEventListeners();
    }

    loadDisorders() {
        // Comprehensive cardiac disorders database - expanded from All Diseases folder
        this.disorders = [
            // Ischemic Heart Disease
            {
                id: 'coronary-artery-disease',
                name: 'Coronary Artery Disease',
                category: 'Ischemic Heart Disease',
                prevalence: 'Very Common',
                severity: 'High',
                symptoms: ['chest-pain', 'dyspnea', 'fatigue', 'palpitations', 'myocardial-infarction'],
                riskFactors: ['age', 'hypertension', 'diabetes', 'smoking', 'family-history', 'dyslipidemia', 'obesity'],
                diagnostics: ['ecg', 'stress-test', 'cardiac-cath', 'ct-angiogram', 'echocardiogram', 'coronary-calcium-scan'],
                treatments: ['medications', 'intervention', 'surgery', 'lifestyle', 'statins', 'antiplatelet-agents', 'beta-blockers'],
                description: 'Atherosclerotic narrowing of coronary arteries leading to myocardial ischemia. Includes stable angina, acute coronary syndromes (STEMI, NSTEMI), and silent ischemia. Most common form of heart disease.',
                incidence: '6.2% of adults (18.2 million in US)',
                mortality: '365,000 deaths annually in US',
                image: 'resources/coronary_disease.png',
                color: 'clinical-blue'
            },
            {
                id: 'acute-myocardial-infarction',
                name: 'Acute Myocardial Infarction',
                category: 'Ischemic Heart Disease',
                prevalence: 'Common',
                severity: 'High',
                symptoms: ['chest-pain', 'dyspnea', 'diaphoresis', 'nausea', 'syncope', 'palpitations'],
                riskFactors: ['age', 'hypertension', 'diabetes', 'smoking', 'family-history', 'dyslipidemia', 'male', 'previous-mi'],
                diagnostics: ['ecg', 'troponin', 'cardiac-biomarkers', 'echocardiogram', 'cardiac-mri', 'cardiac-cath'],
                treatments: ['pci', 'thrombolysis', 'antiplatelet-agents', 'anticoagulation', 'beta-blockers', 'ace-inhibitors', 'statins'],
                description: 'Acute necrosis of myocardial tissue due to acute coronary occlusion. Presents with ST-elevation (STEMI) or non-ST elevation (NSTEMI). Medical emergency requiring immediate intervention.',
                incidence: '605,000 new MIs per year in US',
                mortality: 'In-hospital mortality 5-6%, highly variable by presentation',
                image: 'resources/ami.png',
                color: 'alert-coral'
            },
            
            // Cardiomyopathies
            {
                id: 'dilated-cardiomyopathy',
                name: 'Dilated Cardiomyopathy',
                category: 'Cardiomyopathy',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['dyspnea', 'fatigue', 'edema', 'palpitations', 'orthopnea', 'paroxysmal-nocturnal-dyspnea'],
                riskFactors: ['genetic', 'viral-infection', 'alcohol', 'hypertension', 'chemotherapy', 'myocarditis'],
                diagnostics: ['echocardiogram', 'ecg', 'cardiac-mri', 'cardiac-biomarkers', 'genetic-testing', 'biopsy'],
                treatments: ['ace-inhibitors', 'beta-blockers', 'mra', 'sglt2-inhibitors', 'icd', 'lvad', 'heart-transplant'],
                description: 'Disease of heart muscle with chamber enlargement and impaired systolic function. Characterized by increased ventricular volumes and reduced ejection fraction (<40%). Major cause of heart failure.',
                incidence: '1 in 2,500 adults',
                mortality: 'Variable, 5-10% annual mortality without treatment',
                image: 'resources/dcm.png',
                color: 'cardiac-purple'
            },
            {
                id: 'hypertrophic-cardiomyopathy',
                name: 'Hypertrophic Cardiomyopathy',
                category: 'Cardiomyopathy',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['dyspnea', 'chest-pain', 'syncope', 'palpitations', 'fatigue'],
                riskFactors: ['genetic', 'family-history', 'male'],
                diagnostics: ['echocardiogram', 'cardiac-mri', 'ecg', 'genetic-testing', 'exercise-stress-test', 'cardiac-mri'],
                treatments: ['beta-blockers', 'calcium-channel-blockers', 'disopyramide', 'icd', 'surgical-myectomy', 'alcohol-septal-ablation'],
                description: 'Genetic heart disease with myocardial hypertrophy, most common in left ventricle. Can cause LVOT obstruction, diastolic dysfunction, and sudden cardiac death. Most common inherited cardiovascular disease.',
                incidence: '1 in 500 people',
                mortality: 'Annual mortality 0.5-5% depending on risk factors',
                image: 'resources/hcm.png',
                color: 'cardiac-purple'
            },
            {
                id: 'restrictive-cardiomyopathy',
                name: 'Restrictive Cardiomyopathy',
                category: 'Cardiomyopathy',
                prevalence: 'Rare',
                severity: 'High',
                symptoms: ['dyspnea', 'fatigue', 'edema', 'syncope'],
                riskFactors: ['amyloidosis', 'hemochromatosis', 'sarcoidosis', 'infiltrative-diseases'],
                diagnostics: ['echocardiogram', 'cardiac-catheterization', 'cardiac-mri', 'biopsy', 'ecg'],
                treatments: ['diuretics', 'pacemaker', 'heart-transplant', 'disease-specific-therapy'],
                description: 'Myocardial disease causing diastolic dysfunction with restrictive physiology. Normal systolic function but severely impaired diastolic filling. Often due to infiltrative or storage diseases.',
                incidence: 'Rare, <5% of cardiomyopathies',
                mortality: 'High, often requiring transplantation',
                image: 'resources/rcm.png',
                color: 'cardiac-purple'
            },
            {
                id: 'takotsubo-cardiomyopathy',
                name: 'Takotsubo Cardiomyopathy',
                category: 'Cardiomyopathy',
                prevalence: 'Uncommon',
                severity: 'Moderate',
                symptoms: ['chest-pain', 'dyspnea', 'syncope', 'palpitations', 'st-segment-changes'],
                riskFactors: ['emotional-stress', 'physical-stress', 'female', 'postmenopausal', 'pheochromocytoma'],
                diagnostics: ['echocardiogram', 'cardiac-cath', 'cardiac-mri', 'troponin', 'ecg'],
                treatments: ['supportive-care', 'beta-blockers', 'ace-inhibitors', 'antiplatelet-agents', 'avoid-catecholamines'],
                description: 'Transient left ventricular dysfunction triggered by acute emotional or physical stress. Characterized by apical ballooning and basal hyperkinesis. Also known as "broken heart syndrome". Predominantly affects postmenopausal women.',
                incidence: '2% of suspected ACS cases',
                mortality: 'Low, generally recovers in days to weeks',
                image: 'resources/takotsubo.png',
                color: 'biomarker-rose'
            },
            
            // Heart Failure
            {
                id: 'heart-failure-reduced-ef',
                name: 'Heart Failure with Reduced Ejection Fraction',
                category: 'Heart Failure',
                prevalence: 'Common',
                severity: 'High',
                symptoms: ['dyspnea', 'fatigue', 'edema', 'orthopnea', 'paroxysmal-nocturnal-dyspnea', 'exercise-intolerance'],
                riskFactors: ['hypertension', 'diabetes', 'coronary-disease', 'myocarditis', 'cardiomyopathy'],
                diagnostics: ['echocardiogram', 'ecg', 'bnp', 'troponin', 'cardiac-biomarkers', 'chest-xray', 'cardiac-mri'],
                treatments: ['ace-inhibitors', 'beta-blockers', 'mra', 'sglt2-inhibitors', 'icd', 'crt', 'diuretics'],
                description: 'Heart failure with ejection fraction ≤40%. Caused by systolic dysfunction from various etiologies. Most common form of heart failure. Major cause of hospitalization.',
                incidence: '6.5 million adults (2.7% US population)',
                mortality: '86,000 deaths annually in US',
                image: 'resources/hf_reduced.png',
                color: 'alert-coral'
            },
            {
                id: 'heart-failure-preserved-ef',
                name: 'Heart Failure with Preserved Ejection Fraction',
                category: 'Heart Failure',
                prevalence: 'Common',
                severity: 'Moderate',
                symptoms: ['dyspnea', 'fatigue', 'edema', 'orthopnea', 'exercise-intolerance'],
                riskFactors: ['hypertension', 'diabetes', 'age', 'female', 'obesity', 'atrial-fibrillation'],
                diagnostics: ['echocardiogram', 'bnp', 'cardiac-biomarkers', 'ecg', 'cardiac-mri', 'stress-testing'],
                treatments: ['diuretics', 'blood-pressure-control', 'sglt2-inhibitors', 'arni', 'lifestyle-modification'],
                description: 'Heart failure with ejection fraction ≥50%. Caused by diastolic dysfunction. More common in women and elderly. Increasing prevalence with aging population.',
                incidence: '1.5-2 million adults in US',
                mortality: 'Lower than HFrEF but still significant',
                image: 'resources/hf_preserved.png',
                color: 'alert-coral'
            },
            
            // Arrhythmias
            {
                id: 'atrial-fibrillation',
                name: 'Atrial Fibrillation',
                category: 'Arrhythmia',
                prevalence: 'Common',
                severity: 'Moderate',
                symptoms: ['palpitations', 'dyspnea', 'fatigue', 'syncope', 'chest-discomfort'],
                riskFactors: ['age', 'hypertension', 'heart-disease', 'thyroid-disease', 'sleep-apnea', 'diabetes'],
                diagnostics: ['ecg', 'holter-monitor', 'event-monitor', 'echocardiogram', 'electrophysiology-study'],
                treatments: ['rate-control', 'anticoagulation', 'rhythm-control', 'ablation', 'cardioversion', 'pacemaker'],
                description: 'Most common sustained cardiac arrhythmia with disorganized atrial electrical activity and irregular ventricular response. Major risk factor for stroke. Increasing prevalence worldwide.',
                incidence: '2.7-6.1 million adults in US',
                mortality: 'Increased stroke risk (5x higher), heart failure risk',
                image: 'resources/afib.png',
                color: 'warning-amber'
            },
            {
                id: 'ventricular-tachycardia',
                name: 'Ventricular Tachycardia',
                category: 'Arrhythmia',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['palpitations', 'syncope', 'dyspnea', 'chest-pain', 'sudden-cardiac-death'],
                riskFactors: ['coronary-disease', 'cardiomyopathy', 'myocardial-scar', 'electrolyte-abnormalities', 'long-qt-syndrome'],
                diagnostics: ['ecg', 'holter-monitor', 'electrophysiology-study', 'cardiac-mri', 'genetic-testing'],
                treatments: ['icd', 'amiodarone', 'beta-blockers', 'catheter-ablation', 'electrolyte-correction'],
                description: 'Life-threatening arrhythmia originating in ventricles. Can cause hemodynamic collapse and sudden cardiac death. Requires urgent intervention.',
                incidence: 'Rare in general population, common in structural heart disease',
                mortality: 'Very high if untreated',
                image: 'resources/vt.png',
                color: 'alert-coral'
            },
            
            // Pericardial Disease
            {
                id: 'pericarditis',
                name: 'Pericarditis',
                category: 'Pericardial Disease',
                prevalence: 'Uncommon',
                severity: 'Low-Moderate',
                symptoms: ['chest-pain', 'dyspnea', 'fever', 'fatigue', 'pericardial-rub'],
                riskFactors: ['viral-infection', 'bacterial-infection', 'autoimmune', 'malignancy', 'uremia', 'recent-mi'],
                diagnostics: ['ecg', 'echocardiogram', 'chest-xray', 'ct-chest', 'troponin', 'esr', 'crp'],
                treatments: ['nsaids', 'colchicine', 'corticosteroids', 'pericardiocentesis', 'surgical-pericardectomy'],
                description: 'Inflammation of the pericardium, the sac surrounding the heart. Can be acute or chronic, infectious or noninfectious. Most common cause is viral infection. Classic symptom is sharp, pleuritic chest pain that improves when leaning forward.',
                incidence: '0.1-0.2% of hospitalized patients',
                mortality: 'Low, but can lead to cardiac tamponade',
                image: 'resources/pericarditis.png',
                color: 'warning-amber'
            },

            // Valvular Heart Disease
            {
                id: 'mitral-stenosis',
                name: 'Mitral Stenosis',
                category: 'Valvular Disease',
                prevalence: 'Uncommon',
                severity: 'Moderate-High',
                symptoms: ['dyspnea', 'orthopnea', 'palpitations', 'fatigue', 'syncope'],
                riskFactors: ['rheumatic-fever', 'rheumatic-heart-disease', 'congenital'],
                diagnostics: ['echocardiogram', 'cardiac-catheterization', 'ecg', 'chest-xray', 'cardiac-mri'],
                treatments: ['diuretics', 'beta-blockers', 'anticoagulation', 'balloon-mitral-valvotomy', 'valve-replacement'],
                description: 'Narrowing of mitral valve opening due to rheumatic heart disease or congenital abnormality. Impairs left atrial emptying and increases risk of atrial fibrillation and thromboembolism.',
                incidence: '2.5% of population has valvular disease',
                mortality: 'Variable depending on severity',
                image: 'resources/mitral_stenosis.png',
                color: 'diagnostic-teal'
            },
            {
                id: 'mitral-regurgitation',
                name: 'Mitral Regurgitation',
                category: 'Valvular Disease',
                prevalence: 'Common',
                severity: 'Low-Moderate',
                symptoms: ['dyspnea', 'fatigue', 'palpitations', 'syncope'],
                riskFactors: ['rheumatic-heart-disease', 'dilated-cardiomyopathy', 'endocarditis', 'mitral-prolapse'],
                diagnostics: ['echocardiogram', 'doppler-ultrasound', 'cardiac-catheterization', 'cardiac-mri'],
                treatments: ['vasodilators', 'diuretics', 'beta-blockers', 'ace-inhibitors', 'valve-repair', 'valve-replacement'],
                description: 'Backward flow of blood through incompetent mitral valve during ventricular systole. Can be primary (valve pathology) or secondary (ventricular dilation). Most common valvular lesion.',
                incidence: 'Most common valvular heart disease',
                mortality: 'Variable, depends on severity and left ventricular function',
                image: 'resources/mitral_regurgitation.png',
                color: 'diagnostic-teal'
            },
            {
                id: 'aortic-stenosis',
                name: 'Aortic Stenosis',
                category: 'Valvular Disease',
                prevalence: 'Common in elderly',
                severity: 'Moderate-High',
                symptoms: ['chest-pain', 'syncope', 'dyspnea', 'heart-murmur'],
                riskFactors: ['age', 'bicuspid-aortic-valve', 'congenital', 'rheumatic-heart-disease'],
                diagnostics: ['echocardiogram', 'doppler-ultrasound', 'cardiac-catheterization', 'ecg', 'chest-xray'],
                treatments: ['ace-inhibitors', 'beta-blockers', 'diuretics', 'aortic-valve-replacement', 'tavi'],
                description: 'Narrowing of aortic valve opening with obstruction to left ventricular outflow. Results in increased afterload and left ventricular hypertrophy. Progressive disease with poor prognosis if untreated.',
                incidence: 'Increases with age, 2-7% in adults >65',
                mortality: 'High if symptomatic without treatment',
                image: 'resources/aortic_stenosis.png',
                color: 'diagnostic-teal'
            },
            {
                id: 'aortic-regurgitation',
                name: 'Aortic Regurgitation',
                category: 'Valvular Disease',
                prevalence: 'Uncommon',
                severity: 'Low-High',
                symptoms: ['dyspnea', 'palpitations', 'syncope', 'chest-pain'],
                riskFactors: ['endocarditis', 'aortic-dissection', 'hypertension', 'aortic-root-dilation', 'rheumatic-disease'],
                diagnostics: ['echocardiogram', 'doppler-ultrasound', 'cardiac-catheterization', 'cardiac-mri'],
                treatments: ['vasodilators', 'ace-inhibitors', 'beta-blockers', 'diuretics', 'aortic-valve-replacement'],
                description: 'Backward flow of blood into left ventricle during diastole due to incompetent aortic valve. Can be acute (endocarditis, dissection) or chronic (progressive). Progressive disease.',
                incidence: 'Less common than aortic stenosis',
                mortality: 'Variable, high if acute severe regurgitation',
                image: 'resources/aortic_regurgitation.png',
                color: 'diagnostic-teal'
            },
            
            // Pericardial Disease
            {
                id: 'pericarditis',
                name: 'Pericarditis',
                category: 'Pericardial Disease',
                prevalence: 'Uncommon',
                severity: 'Low-Moderate',
                symptoms: ['chest-pain', 'pericardial-friction-rub', 'fever', 'dyspnea', 'orthopnea'],
                riskFactors: ['viral-infection', 'autoimmune', 'renal-failure', 'post-myocardial-infarction', 'malignancy'],
                diagnostics: ['ecg', 'echocardiogram', 'chest-xray', 'inflammatory-markers', 'cardiac-biomarkers'],
                treatments: ['nsaids', 'colchicine', 'corticosteroids', 'pericardiocentesis', 'surgery'],
                description: 'Inflammation of pericardium characterized by chest pain and pericardial friction rub. Can be acute, recurrent, or chronic. Often self-limited but requires management.',
                incidence: '1 per 1,000 hospital admissions',
                mortality: 'Generally low with appropriate treatment',
                image: 'resources/pericarditis.png',
                color: 'biomarker-rose'
            },
            {
                id: 'pericardial-effusion',
                name: 'Pericardial Effusion',
                category: 'Pericardial Disease',
                prevalence: 'Uncommon',
                severity: 'Low-High',
                symptoms: ['dyspnea', 'chest-discomfort', 'orthopnea', 'syncope'],
                riskFactors: ['pericarditis', 'malignancy', 'heart-failure', 'renal-failure', 'hypothyroidism', 'hemorrhage'],
                diagnostics: ['echocardiogram', 'chest-xray', 'cardiac-mri', 'pericardiocentesis'],
                treatments: ['diuretics', 'treatment-of-underlying-cause', 'pericardiocentesis', 'pericardial-window', 'pericardiectomy'],
                description: 'Abnormal accumulation of fluid in pericardial space. Can be serous, fibrinous, hemorrhagic, or purulent. May lead to cardiac tamponade if large.',
                incidence: 'Variable depending on underlying cause',
                mortality: 'Depends on cause and degree of tamponade',
                image: 'resources/pericardial_effusion.png',
                color: 'biomarker-rose'
            },
            {
                id: 'cardiac-tamponade',
                name: 'Cardiac Tamponade',
                category: 'Pericardial Disease',
                prevalence: 'Rare (Medical Emergency)',
                severity: 'Very High',
                symptoms: ['severe-dyspnea', 'chest-pain', 'syncope', 'hypotension', 'shock'],
                riskFactors: ['pericardial-effusion', 'trauma', 'myocardial-rupture', 'malignancy', 'hemopericardium'],
                diagnostics: ['echocardiogram', 'chest-xray', 'ecg', 'hemodynamic-monitoring', 'cardiac-catheterization'],
                treatments: ['emergency-pericardiocentesis', 'fluid-resuscitation', 'pericardial-drainage', 'surgical-drainage'],
                description: 'Life-threatening condition with impaired cardiac filling due to increased pericardial pressure from fluid accumulation. Medical emergency requiring urgent drainage.',
                incidence: 'Rare, depends on cause',
                mortality: 'Very high if untreated',
                image: 'resources/cardiac_tamponade.png',
                color: 'alert-coral'
            },
            
            // Congenital Heart Disease
            {
                id: 'atrial-septal-defect',
                name: 'Atrial Septal Defect',
                category: 'Congenital Heart Disease',
                prevalence: 'Uncommon',
                severity: 'Low-Moderate',
                symptoms: ['dyspnea', 'palpitations', 'fatigue', 'exercise-intolerance'],
                riskFactors: ['genetic', 'maternal-exposure', 'family-history'],
                diagnostics: ['echocardiogram', 'cardiac-catheterization', 'ct', 'mri'],
                treatments: ['observation', 'percutaneous-closure', 'surgical-closure'],
                description: 'Abnormal opening in the atrial septum allowing left-to-right shunting. Most common form of congenital heart disease in adults. Can lead to atrial fibrillation and heart failure if untreated.',
                incidence: '40% of congenital heart disease',
                mortality: 'Low with appropriate management',
                image: 'resources/asd.png',
                color: 'success-green'
            },
            {
                id: 'ventricular-septal-defect',
                name: 'Ventricular Septal Defect',
                category: 'Congenital Heart Disease',
                prevalence: 'Uncommon',
                severity: 'Variable',
                symptoms: ['poor-growth', 'dyspnea', 'heart-murmur', 'exercise-intolerance'],
                riskFactors: ['genetic', 'maternal-diabetes', 'maternal-infection', 'teratogens'],
                diagnostics: ['echocardiogram', 'cardiac-catheterization', 'chest-xray', 'ecg'],
                treatments: ['observation', 'surgical-repair', 'percutaneous-closure'],
                description: 'Abnormal opening in the ventricular septum. Most common congenital heart defect. Can be small (restrictive) or large (non-restrictive).',
                incidence: '2-3 per 1,000 live births',
                mortality: 'Depends on size and location of defect',
                image: 'resources/vsd.png',
                color: 'success-green'
            },
            {
                id: 'patent-ductus-arteriosus',
                name: 'Patent Ductus Arteriosus',
                category: 'Congenital Heart Disease',
                prevalence: 'Rare (in term infants)',
                severity: 'Low-Moderate',
                symptoms: ['dyspnea', 'poor-feeding', 'poor-growth', 'murmur'],
                riskFactors: ['prematurity', 'maternal-rubella', 'maternal-infection'],
                diagnostics: ['echocardiogram', 'chest-xray', 'ecg'],
                treatments: ['indomethacin', 'ibuprofen', 'acetaminophen', 'surgical-ligation', 'catheter-based-closure'],
                description: 'Failure of ductus arteriosus to close after birth, allowing left-to-right shunting from aorta to pulmonary artery. Common in premature infants.',
                incidence: '1 in 2,000 term births, more common in preterm infants',
                mortality: 'Low with appropriate management',
                image: 'resources/pda.png',
                color: 'success-green'
            },
            
            // Aortic & Vascular Disease
            {
                id: 'aortic-aneurysm',
                name: 'Aortic Aneurysm',
                category: 'Aortic & Vascular Disease',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['back-pain', 'chest-pain', 'abdominal-pain', 'syncope'],
                riskFactors: ['hypertension', 'smoking', 'age', 'atherosclerosis', 'family-history', 'connective-tissue-disorder'],
                diagnostics: ['ct-angiogram', 'mri', 'abdominal-ultrasound', 'transesophageal-echo'],
                treatments: ['blood-pressure-control', 'beta-blockers', 'surgical-repair', 'endovascular-repair'],
                description: 'Abnormal dilatation of aorta. Can be thoracic or abdominal. Risk of rupture increases with size. Medical emergency if rupture occurs.',
                incidence: '9% in men >65 years who smoke',
                mortality: 'Very high if rupture occurs',
                image: 'resources/aortic_aneurysm.png',
                color: 'imaging-orange'
            },
            {
                id: 'aortic-dissection',
                name: 'Aortic Dissection',
                category: 'Aortic & Vascular Disease',
                prevalence: 'Rare (Medical Emergency)',
                severity: 'Very High',
                symptoms: ['severe-chest-pain', 'severe-back-pain', 'syncope', 'dyspnea', 'neurologic-deficits'],
                riskFactors: ['hypertension', 'marfan-syndrome', 'ehlers-danlos', 'connective-tissue-disorder', 'cocaine-use'],
                diagnostics: ['ct-angiogram', 'transesophageal-echo', 'mri', 'cardiac-catheterization'],
                treatments: ['blood-pressure-control', 'emergency-surgery', 'endovascular-repair'],
                description: 'Sudden tear in intima of aorta with blood dissecting into aortic layers. Medical and surgical emergency. High mortality if not treated urgently.',
                incidence: '2-3.5 per 100,000 per year',
                mortality: 'Very high without treatment',
                image: 'resources/aortic_dissection.png',
                color: 'alert-coral'
            },
            {
                id: 'hypertension-systemic',
                name: 'Systemic Hypertension',
                category: 'Vascular Disease',
                prevalence: 'Very Common',
                severity: 'Moderate',
                symptoms: ['headache', 'dizziness', 'chest-pain', 'often-asymptomatic'],
                riskFactors: ['age', 'obesity', 'smoking', 'family-history', 'sedentary-lifestyle', 'high-sodium-diet'],
                diagnostics: ['blood-pressure-monitoring', 'ecg', 'echocardiogram', 'renal-function', 'lipid-profile'],
                treatments: ['lifestyle-modification', 'ace-inhibitors', 'arbs', 'beta-blockers', 'calcium-channel-blockers', 'diuretics'],
                description: 'Persistent elevation of systolic blood pressure ≥130 mmHg or diastolic ≥80 mmHg. Leading cause of cardiovascular disease and death worldwide.',
                incidence: '103 million US adults (45%)',
                mortality: 'Primary contributor to CVD deaths',
                image: 'resources/hypertension.png',
                color: 'diagnostic-teal'
            },
            {
                id: 'peripheral-artery-disease',
                name: 'Peripheral Artery Disease',
                category: 'Vascular Disease',
                prevalence: 'Common',
                severity: 'Moderate',
                symptoms: ['claudication', 'limb-pain', 'wounds', 'cold-extremities', 'erectile-dysfunction'],
                riskFactors: ['smoking', 'diabetes', 'hypertension', 'age', 'dyslipidemia', 'chronic-kidney-disease'],
                diagnostics: ['ankle-brachial-index', 'duplex-ultrasound', 'ct-angiography', 'angiography'],
                treatments: ['smoking-cessation', 'antiplatelet-agents', 'statins', 'exercise', 'endovascular-intervention', 'bypass-surgery'],
                description: 'Atherosclerotic narrowing of peripheral arteries, most commonly lower extremities. Strong predictor of systemic atherosclerosis and cardiovascular events.',
                incidence: '6.8 million US adults >70 years',
                mortality: 'Increased cardiovascular and limb loss risk',
                image: 'resources/pad.png',
                color: 'imaging-orange'
            },
            
            // Inflammatory Heart Disease
            {
                id: 'myocarditis',
                name: 'Myocarditis',
                category: 'Inflammatory Heart Disease',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['chest-pain', 'dyspnea', 'palpitations', 'fatigue', 'fever'],
                riskFactors: ['viral-infection', 'bacterial-infection', 'autoimmune', 'toxins', 'medications'],
                diagnostics: ['ecg', 'cardiac-biomarkers', 'echocardiogram', 'cardiac-mri', 'biopsy'],
                treatments: ['supportive-care', 'immunosuppression', 'immunoglobulin', 'mechanical-support'],
                description: 'Inflammation of myocardium typically caused by viral infections. Can present as acute heart failure, cardiogenic shock, or mimic myocardial infarction.',
                incidence: '1-10 per 100,000 annually',
                mortality: 'Variable by etiology, 5-7% with fulminant myocarditis',
                image: 'resources/myocarditis.png',
                color: 'diagnostic-teal'
            },
            {
                id: 'infective-endocarditis',
                name: 'Infective Endocarditis',
                category: 'Inflammatory Heart Disease',
                prevalence: 'Rare',
                severity: 'High',
                symptoms: ['fever', 'heart-murmur', 'embolic-phenomena', 'night-sweats', 'malaise'],
                riskFactors: ['valvular-disease', 'prosthetic-valves', 'iv-drug-use', 'dental-procedures', 'poor-dental-hygiene'],
                diagnostics: ['blood-cultures', 'echocardiogram', 'transesophageal-echo', 'duke-criteria', 'cbc-lfts'],
                treatments: ['antibiotics', 'surgical-valve-replacement', 'supportive-care'],
                description: 'Infection of endocardium typically involving heart valves. Characterized by bacteremia, valvular vegetations, systemic emboli, and vasculitis.',
                incidence: '3-10 per 100,000 annually',
                mortality: '15-25% despite treatment',
                image: 'resources/endocarditis.png',
                color: 'alert-coral'
            },
            
            // Thrombotic & Embolic Disease
            {
                id: 'pulmonary-embolism',
                name: 'Pulmonary Embolism',
                category: 'Thrombotic Disease',
                prevalence: 'Uncommon',
                severity: 'High',
                symptoms: ['dyspnea', 'chest-pain', 'syncope', 'tachycardia', 'hemoptysis'],
                riskFactors: ['deep-vein-thrombosis', 'immobility', 'surgery', 'cancer', 'pregnancy', 'thrombophilia', 'malignancy'],
                diagnostics: ['ct-pulmonary-angiogram', 'd-dimer', 'ventilation-perfusion-scan', 'ecg', 'chest-xray'],
                treatments: ['anticoagulation', 'thrombolysis', 'inferior-vena-cava-filter', 'embolectomy'],
                description: 'Obstruction of pulmonary arteries by thrombotic material, most commonly from DVT. Medical and hemodynamic emergency requiring prompt diagnosis and treatment.',
                incidence: '1 per 1,000 adults annually',
                mortality: '15-30% if untreated, 2-8% with treatment',
                image: 'resources/pe.png',
                color: 'warning-amber'
            },
            {
                id: 'long-qt-syndrome',
                name: 'Long QT Syndrome',
                category: 'Arrhythmia',
                prevalence: 'Rare',
                severity: 'High',
                symptoms: ['syncope', 'palpitations', 'seizures', 'sudden-cardiac-death'],
                riskFactors: ['genetic', 'family-history', 'medications', 'electrolyte-abnormalities', 'hypothyroidism'],
                diagnostics: ['ecg', 'holter-monitor', 'genetic-testing', 'epinephrine-qt-stress-test', 'exercise-stress-test'],
                treatments: ['beta-blockers', 'icd', 'left-cardiac-sympathetic-denervation', 'medication-avoidance', 'genetic-counseling'],
                description: 'Inherited or acquired condition with prolonged QT interval on ECG predisposing to polymorphic ventricular tachycardia (torsades de pointes) and sudden cardiac death. Multiple genetic subtypes (LQT1-LQT15) with distinct triggers. Leading cause of sudden cardiac death in young people.',
                incidence: '1 in 2,000 live births',
                mortality: 'Untreated: 1-2% annual risk of sudden cardiac death; with treatment risk reduced significantly',
                image: 'resources/lqts.png',
                color: 'cardiac-purple'
            },
            {
                id: 'brugada-syndrome',
                name: 'Brugada Syndrome',
                category: 'Arrhythmia',
                prevalence: 'Rare',
                severity: 'High',
                symptoms: ['syncope', 'palpitations', 'sudden-cardiac-death', 'seizures-during-sleep', 'nocturnal-agonal-respiration'],
                riskFactors: ['genetic', 'scn5a-mutation', 'family-history', 'fever', 'male', 'asian-ancestry', 'sodium-channel-blockers'],
                diagnostics: ['ecg', 'drug-challenge-test', 'holter-monitor', 'genetic-testing', 'electrophysiology-study', 'ajmaline-provocative-test'],
                treatments: ['icd', 'quinidine', 'fever-management', 'medication-avoidance', 'catheter-ablation', 'isoproterenol'],
                description: 'Inherited sodium channelopathy characterized by distinctive coved ST-segment elevation in right precordial leads (V1-V3) and increased risk of ventricular fibrillation. Leading cause of sudden unexplained death syndrome (SUDS) in young men. Three ECG pattern types with Type 1 being diagnostic. Risk of arrhythmic events is highest during rest or sleep.',
                incidence: '1–5 per 10,000 (up to 12/10,000 in Southeast Asia)',
                mortality: 'Untreated symptomatic patients: 10% annual risk of sudden cardiac death; ICD dramatically reduces risk',
                image: 'resources/brugada.png',
                color: 'cardiac-purple'
            },
            {
                id: 'deep-vein-thrombosis',
                name: 'Deep Vein Thrombosis',
                category: 'Thrombotic Disease',
                prevalence: 'Common',
                severity: 'Moderate',
                symptoms: ['leg-swelling', 'leg-pain', 'warmth', 'erythema', 'tenderness'],
                riskFactors: ['immobility', 'surgery', 'cancer', 'pregnancy', 'oral-contraceptives', 'inherited-thrombophilia', 'severe-infection'],
                diagnostics: ['duplex-ultrasound', 'd-dimer', 'ct-venography', 'mri-venography'],
                treatments: ['anticoagulation', 'compression-therapy', 'thrombolysis', 'catheter-directed-therapy'],
                description: 'Thrombus formation in deep venous system, most commonly lower extremities. Major risk factor for pulmonary embolism. Requires anticoagulation.',
                incidence: '1-3 per 1,000 adults annually',
                mortality: 'Low with treatment, high if leads to PE',
                image: 'resources/dvt.png',
                color: 'clinical-blue'
            }
        ];

        this.filteredDisorders = [...this.disorders];
        this.buildSearchIndex();
    }

    buildSearchIndex() {
        this.disorders.forEach(disorder => {
            const searchableText = [
                disorder.name,
                disorder.category,
                disorder.description,
                ...disorder.symptoms,
                ...disorder.riskFactors,
                ...disorder.diagnostics,
                ...disorder.treatments
            ].join(' ').toLowerCase();
            
            this.searchIndex[disorder.id] = searchableText;
        });
    }

    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const searchToggle = document.getElementById('search-toggle');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');

        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                searchOverlay.classList.remove('hidden');
                searchInput.focus();
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.add('hidden');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value, searchResults);
            });
        }

        // Close overlay on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
                searchOverlay.classList.add('hidden');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
    }

    performSearch(query, resultsContainer) {
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = this.disorders.filter(disorder => {
            return this.searchIndex[disorder.id].includes(query.toLowerCase());
        });

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-neutral-slate text-center py-4">No results found. Try different search terms.</p>';
            return;
        }

        resultsContainer.innerHTML = results.map(disorder => `
            <div class="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onclick="window.location.href='disorders/${disorder.id}.html'">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-deep-navy">${disorder.name}</h4>
                        <p class="text-sm text-neutral-slate">${disorder.category}</p>
                        <p class="text-xs text-gray-500 mt-1">${disorder.description.substring(0, 100)}...</p>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-2 py-1 text-xs rounded-full bg-${disorder.color} text-white">
                            ${disorder.prevalence}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    initializeFilters() {
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        const symptomFilter = document.getElementById('symptom-filter')?.value || '';
        const riskFilter = document.getElementById('risk-filter')?.value || '';
        const diagnosticFilter = document.getElementById('diagnostic-filter')?.value || '';
        const treatmentFilter = document.getElementById('treatment-filter')?.value || '';

        this.filteredDisorders = this.disorders.filter(disorder => {
            const matchesSymptom = !symptomFilter || disorder.symptoms.includes(symptomFilter);
            const matchesRisk = !riskFilter || disorder.riskFactors.includes(riskFilter);
            const matchesDiagnostic = !diagnosticFilter || disorder.diagnostics.includes(diagnosticFilter);
            const matchesTreatment = !treatmentFilter || disorder.treatments.includes(treatmentFilter);

            return matchesSymptom && matchesRisk && matchesDiagnostic && matchesTreatment;
        });

        this.renderDisorders();
        
        // Show filter results
        const resultsCount = this.filteredDisorders.length;
        const totalCount = this.disorders.length;
        
        // Scroll to disorders section
        document.getElementById('disorders').scrollIntoView({ behavior: 'smooth' });
        
        // Show notification
        this.showNotification(`Showing ${resultsCount} of ${totalCount} disorders matching your filters.`);
    }

    renderDisorders() {
        const grid = document.getElementById('disorders-grid');
        if (!grid) return;

        if (this.filteredDisorders.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 text-neutral-slate mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-deep-navy mb-2">No disorders found</h3>
                    <p class="text-neutral-slate">Try adjusting your filters to see more results.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredDisorders.map(disorder => `
            <div class="disorder-card bg-white rounded-2xl p-6 shadow-lg border border-gray-200 cursor-pointer" onclick="window.location.href='disorders/${disorder.id}.html'">
                <div class="flex items-center justify-between mb-4">
                    <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-${disorder.color} text-white">
                        ${disorder.category}
                    </span>
                    <span class="text-sm text-neutral-slate">${disorder.prevalence}</span>
                </div>
                
                <div class="mb-4">
                    <img src="${disorder.image}" alt="${disorder.name}" class="w-full h-32 object-cover rounded-lg mb-4" onerror="this.style.display='none'">
                    <h3 class="text-xl font-playfair font-bold text-deep-navy mb-2">${disorder.name}</h3>
                    <p class="text-sm text-neutral-slate mb-4">${disorder.description.substring(0, 120)}...</p>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-neutral-slate">Incidence:</span>
                        <span class="font-semibold text-deep-navy">${disorder.incidence}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-neutral-slate">Mortality:</span>
                        <span class="font-semibold text-deep-navy">${disorder.mortality}</span>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-1 mb-4">
                    ${disorder.symptoms.slice(0, 3).map(symptom => `
                        <span class="inline-block px-2 py-1 text-xs bg-gray-100 text-neutral-slate rounded">${symptom.replace('-', ' ')}</span>
                    `).join('')}
                    ${disorder.symptoms.length > 3 ? `<span class="text-xs text-neutral-slate">+${disorder.symptoms.length - 3} more</span>` : ''}
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                    <button class="w-full bg-${disorder.color} hover:opacity-90 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300">
                        View Details →
                    </button>
                </div>
            </div>
        `).join('');

        // Animate disorder cards
        this.animateDisorderCards();
    }

    animateDisorderCards() {
        const cards = document.querySelectorAll('.disorder-card');
        
        anime({
            targets: cards,
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutCubic'
        });
    }

    initializeAnimations() {
        // Animate stats counters
        const statsCounters = document.querySelectorAll('.stats-counter');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsCounters.forEach(counter => {
            observer.observe(counter);
        });

        // Animate hero text
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            Splitting({ target: heroText, by: 'chars' });
            
            anime({
                targets: '.hero-text .char',
                translateY: [100, 0],
                opacity: [0, 1],
                delay: anime.stagger(50),
                duration: 1000,
                easing: 'easeOutCubic'
            });
        }
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle (if needed)
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                document.getElementById('search-toggle').click();
            }
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-success-green text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility functions for other pages
    static getDisorderById(id) {
        const cardiologyResource = new CardiologyResource();
        return cardiologyResource.disorders.find(disorder => disorder.id === id);
    }

    static getAllDisorders() {
        const cardiologyResource = new CardiologyResource();
        return cardiologyResource.disorders;
    }

    static searchDisorders(query) {
        const cardiologyResource = new CardiologyResource();
        return cardiologyResource.disorders.filter(disorder => {
            return cardiologyResource.searchIndex[disorder.id].includes(query.toLowerCase());
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.cardiologyApp = new CardiologyResource();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardiologyResource;
}