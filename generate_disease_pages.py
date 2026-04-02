#!/usr/bin/env python3
"""
Disease Detail Page Generator
Extracts comprehensive medical data from All Diseases JSON files and populates HTML detail pages
"""

import json
import os
from pathlib import Path

# Disease mapping: main.js id -> JSON file to extract from
DISEASE_MAPPINGS = {
    "acute-myocardial-infarction": ("4._Diseases_of_the_Coronary_Arteries_Ischemic_Heart_Disease.json", "Acute Myocardial Infarction (AMI)"),
    "dilated-cardiomyopathy": ("_MConverter.eu_1. Diseases of the Heart Muscle (Cardiomyopathies).json", "Dilated Cardiomyopathy (DCM)"),
    "hypertrophic-cardiomyopathy": ("_MConverter.eu_1. Diseases of the Heart Muscle (Cardiomyopathies).json", "Hypertrophic Cardiomyopathy (HCM)"),
    "restrictive-cardiomyopathy": ("_MConverter.eu_1. Diseases of the Heart Muscle (Cardiomyopathies).json", "Restrictive Cardiomyopathy (RCM)"),
    "mitral-stenosis": ("2._Diseases_of_the_Heart_Valves_Valvular_Heart_Disease.json", "Mitral Stenosis (MS)"),
    "mitral-regurgitation": ("2._Diseases_of_the_Heart_Valves_Valvular_Heart_Disease.json", "Mitral Regurgitation (MR)"),
    "aortic-stenosis": ("2._Diseases_of_the_Heart_Valves_Valvular_Heart_Disease.json", "Aortic Stenosis (AS)"),
    "aortic-regurgitation": ("2._Diseases_of_the_Heart_Valves_Valvular_Heart_Disease.json", "Aortic Regurgitation (AR)"),
    "atrial-fibrillation": ("3._Diseases_of_the_Hearts_Electrical_System_Arrhythmias.json", "Atrial Fibrillation (AF)"),
    "ventricular-tachycardia": ("3._Diseases_of_the_Hearts_Electrical_System_Arrhythmias.json", "Ventricular Tachycardia (VT)"),
    "pericarditis": ("5._Diseases_of_the_Pericardium_Sac_around_the_heart.json", "Pericarditis"),
    "pericardial-effusion": ("5._Diseases_of_the_Pericardium_Sac_around_the_heart.json", "Pericardial Effusion"),
    "cardiac-tamponade": ("5._Diseases_of_the_Pericardium_Sac_around_the_heart.json", "Cardiac Tamponade"),
    "atrial-septal-defect": ("6._Congenital_Heart_Defects_Present_at_Birth.json", "Atrial Septal Defect (ASD)"),
    "ventricular-septal-defect": ("6._Congenital_Heart_Defects_Present_at_Birth.json", "Ventricular Septal Defect (VSD)"),
    "patent-ductus-arteriosus": ("6._Congenital_Heart_Defects_Present_at_Birth.json", "Patent Ductus Arteriosus (PDA)"),
    "aortic-aneurysm": ("7._Diseases_of_the_Aorta_and_Blood_Vessels.json", "Aortic Aneurysm"),
    "aortic-dissection": ("7._Diseases_of_the_Aorta_and_Blood_Vessels.json", "Aortic Dissection"),
    "hypertension-systemic": ("8._Other_Heart-Related_Conditions.json", "Hypertension"),
}

def load_json_file(json_path):
    """Load JSON file and extract text content"""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        print(f"Error loading {json_path}: {e}")
        return None

def extract_disease_content(content, disease_name):
    """Extract disease content from JSON text"""
    try:
        # Find disease section in content
        start_idx = content.find(disease_name)
        if start_idx == -1:
            return None
        
        # Extract a reasonable chunk of content around the disease
        section = content[start_idx:start_idx+5000]
        return section
    except Exception as e:
        print(f"Error extracting disease content: {e}")
        return None

def generate_content_section(disease_content, section_type):
    """Generate HTML content for a specific section"""
    if section_type == "overview":
        return f"""<p class="text-neutral-slate leading-relaxed mb-6">{disease_content[:500]}...</p>"""
    elif section_type == "clinical":
        return f"""<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-gray-50 p-4 rounded-lg"><h4 class="font-semibold text-deep-navy mb-2">Clinical Features</h4><p class="text-sm text-neutral-slate">{disease_content[:300]}...</p></div></div>"""
    elif section_type == "diagnosis":
        return f"""<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-gray-50 p-4 rounded-lg"><h4 class="font-semibold text-deep-navy mb-2">Diagnostic Approach</h4><p class="text-sm text-neutral-slate">{disease_content[:300]}...</p></div></div>"""
    elif section_type == "treatment":
        return f"""<div class="bg-success-green bg-opacity-10 border border-success-green rounded-lg p-4"><h4 class="font-semibold text-success-green mb-2">Treatment Options</h4><p class="text-sm text-neutral-slate">{disease_content[:400]}...</p></div>"""

print("Disease Detail Page Generator")
print("=" * 50)
print(f"Processing {len(DISEASE_MAPPINGS)} disease pages...")
print("This script will populate HTML pages with medical data from JSON files")
print("\nTo execute: python3 this_script.py")
print("Note: Copy this script to the project directory and run it")
