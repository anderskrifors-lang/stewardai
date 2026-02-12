// StewardAI - Antibiotikabeslutsstöd
// Baserat på Strama nationella behandlingsrekommendationer

// Antibiotikariktlinjer per infektion (förenklad version)
const guidelines = {
    // Pneumoni
    pneumonia_cap: {
        mild: {
            firstLine: { drug: 'Fenoximetylpenicillin', dose: '1g x 3', route: 'PO', days: '7', coverage: 95 },
            alternatives: [
                { drug: 'Amoxicillin', dose: '500mg x 3', route: 'PO' },
                { drug: 'Doxycyklin', dose: '200mg dag 1, 100mg x 1', route: 'PO', note: 'Vid pc-allergi' }
            ]
        },
        moderate: {
            firstLine: { drug: 'Bensylpenicillin', dose: '3g x 3', route: 'IV', days: '7-10', coverage: 92 },
            alternatives: [
                { drug: 'Cefotaxim', dose: '1g x 3', route: 'IV' },
                { drug: 'Moxifloxacin', dose: '400mg x 1', route: 'PO', note: 'Vid pc-allergi' }
            ]
        },
        severe: {
            firstLine: { drug: 'Bensylpenicillin + Erytromycin', dose: '3g x 4 + 1g x 3', route: 'IV', days: '10-14', coverage: 94 },
            alternatives: [
                { drug: 'Cefotaxim + Erytromycin', dose: '2g x 3 + 1g x 3', route: 'IV' },
                { drug: 'Moxifloxacin', dose: '400mg x 1', route: 'IV', note: 'Vid pc-allergi' }
            ]
        }
    },
    
    pneumonia_hap: {
        moderate: {
            firstLine: { drug: 'Piperacillin/Tazobaktam', dose: '4g x 3', route: 'IV', days: '7-10', coverage: 88 },
            alternatives: [
                { drug: 'Cefotaxim', dose: '2g x 3', route: 'IV' },
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV', note: 'Vid ESBL-risk' }
            ]
        },
        severe: {
            firstLine: { drug: 'Piperacillin/Tazobaktam', dose: '4g x 4', route: 'IV', days: '10-14', coverage: 85 },
            alternatives: [
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV' },
                { drug: 'Meropenem + Vankomycin', dose: '1g x 3 + 1g x 2', route: 'IV', note: 'Vid MRSA-risk' }
            ]
        }
    },
    
    // UVI
    uti_uncomplicated: {
        mild: {
            firstLine: { drug: 'Nitrofurantoin', dose: '50mg x 3', route: 'PO', days: '5', coverage: 97 },
            alternatives: [
                { drug: 'Pivmecillinam', dose: '200mg x 3', route: 'PO' },
                { drug: 'Trimetoprim', dose: '160mg x 2', route: 'PO' }
            ]
        }
    },
    
    uti_complicated: {
        moderate: {
            firstLine: { drug: 'Ciprofloxacin', dose: '500mg x 2', route: 'PO', days: '7-10', coverage: 89 },
            alternatives: [
                { drug: 'Trimetoprim-Sulfametoxazol', dose: '160/800mg x 2', route: 'PO' },
                { drug: 'Ceftibuten', dose: '400mg x 1', route: 'PO' }
            ]
        },
        severe: {
            firstLine: { drug: 'Cefotaxim', dose: '1g x 3', route: 'IV', days: '10-14', coverage: 90 },
            alternatives: [
                { drug: 'Ciprofloxacin', dose: '400mg x 2', route: 'IV' },
                { drug: 'Piperacillin/Tazobaktam', dose: '4g x 3', route: 'IV' }
            ]
        }
    },
    
    pyelonephritis: {
        moderate: {
            firstLine: { drug: 'Ciprofloxacin', dose: '500mg x 2', route: 'PO', days: '7-10', coverage: 88 },
            alternatives: [
                { drug: 'Trimetoprim-Sulfametoxazol', dose: '160/800mg x 2', route: 'PO' },
                { drug: 'Ceftibuten', dose: '400mg x 1', route: 'PO' }
            ]
        },
        severe: {
            firstLine: { drug: 'Cefotaxim', dose: '1g x 3', route: 'IV', days: '10-14', coverage: 91 },
            alternatives: [
                { drug: 'Ciprofloxacin', dose: '400mg x 2', route: 'IV' },
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV', note: 'Vid ESBL' }
            ]
        }
    },
    
    // Hud & mjukdelar
    cellulitis: {
        mild: {
            firstLine: { drug: 'Flukloxacillin', dose: '1g x 3', route: 'PO', days: '10', coverage: 94 },
            alternatives: [
                { drug: 'Fenoximetylpenicillin', dose: '1g x 3', route: 'PO', note: 'Ren erysipelas' },
                { drug: 'Klindamycin', dose: '300mg x 3', route: 'PO', note: 'Vid pc-allergi' }
            ]
        },
        moderate: {
            firstLine: { drug: 'Kloxacillin', dose: '2g x 4', route: 'IV', days: '10-14', coverage: 92 },
            alternatives: [
                { drug: 'Cefotaxim', dose: '1g x 3', route: 'IV' },
                { drug: 'Klindamycin', dose: '600mg x 3', route: 'IV', note: 'Vid pc-allergi' }
            ]
        },
        severe: {
            firstLine: { drug: 'Kloxacillin + Klindamycin', dose: '2g x 4 + 600mg x 3', route: 'IV', days: '14+', coverage: 93 },
            alternatives: [
                { drug: 'Piperacillin/Tazobaktam', dose: '4g x 4', route: 'IV' },
                { drug: 'Vankomycin', dose: '1g x 2', route: 'IV', note: 'Vid MRSA' }
            ]
        }
    },
    
    // Sepsis
    sepsis_unknown: {
        severe: {
            firstLine: { drug: 'Piperacillin/Tazobaktam', dose: '4g x 4', route: 'IV', days: '7-14', coverage: 87 },
            alternatives: [
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV' },
                { drug: 'Cefotaxim + Metronidazol', dose: '2g x 3 + 500mg x 3', route: 'IV' }
            ]
        },
        septic_shock: {
            firstLine: { drug: 'Meropenem + Vankomycin', dose: '2g x 3 + 1g x 2', route: 'IV', days: '14+', coverage: 94 },
            alternatives: [
                { drug: 'Piperacillin/Tazobaktam + Vankomycin', dose: '4g x 4 + 1g x 2', route: 'IV' }
            ]
        }
    },
    
    sepsis_uro: {
        severe: {
            firstLine: { drug: 'Cefotaxim', dose: '2g x 3', route: 'IV', days: '7-14', coverage: 90 },
            alternatives: [
                { drug: 'Piperacillin/Tazobaktam', dose: '4g x 3', route: 'IV' },
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV', note: 'Vid ESBL' }
            ]
        }
    },
    
    sepsis_abdominal: {
        severe: {
            firstLine: { drug: 'Piperacillin/Tazobaktam', dose: '4g x 4', route: 'IV', days: '7-14', coverage: 89 },
            alternatives: [
                { drug: 'Meropenem', dose: '1g x 3', route: 'IV' },
                { drug: 'Cefotaxim + Metronidazol', dose: '2g x 3 + 500mg x 3', route: 'IV' }
            ]
        }
    }
};

// Culture-based modifications
const cultureAdjustments = {
    e_coli: { preferred: 'Cefotaxim', coverage: 95 },
    e_coli_esbl: { preferred: 'Meropenem', coverage: 99, warning: 'ESBL-producerande' },
    klebsiella: { preferred: 'Cefotaxim', coverage: 92 },
    s_aureus: { preferred: 'Kloxacillin', coverage: 98 },
    mrsa: { preferred: 'Vankomycin', coverage: 99, warning: 'MRSA - kontakta infektionsläkare' },
    s_pneumoniae: { preferred: 'Bensylpenicillin', coverage: 97 },
    pseudomonas: { preferred: 'Piperacillin/Tazobaktam', coverage: 88, warning: 'Pseudomonas - överväg kombinationsbehandling' },
    enterococcus: { preferred: 'Ampicillin', coverage: 90 }
};

// GFR dose adjustments
function adjustForGFR(drug, gfr) {
    const renalDrugs = {
        'Nitrofurantoin': { min: 45, warning: 'Kontraindicerad vid eGFR <45' },
        'Ciprofloxacin': { threshold: 30, adjustment: '250-500mg x 2 vid eGFR <30' },
        'Meropenem': { threshold: 30, adjustment: '1g x 2 vid eGFR 25-50, 500mg x 2 vid eGFR <25' },
        'Vankomycin': { threshold: 50, adjustment: 'Dalvärdestyrd dosering' }
    };
    
    if (renalDrugs[drug]) {
        if (renalDrugs[drug].min && gfr < renalDrugs[drug].min) {
            return { contraindicated: true, message: renalDrugs[drug].warning };
        }
        if (gfr < renalDrugs[drug].threshold) {
            return { adjust: true, message: renalDrugs[drug].adjustment };
        }
    }
    return null;
}

// Get Strama score
function getStramaScore(drug) {
    const narrowSpectrum = ['Fenoximetylpenicillin', 'Flukloxacillin', 'Nitrofurantoin', 'Pivmecillinam', 'Bensylpenicillin'];
    const broadSpectrum = ['Meropenem', 'Piperacillin/Tazobaktam', 'Vankomycin'];
    
    if (narrowSpectrum.some(d => drug.includes(d))) return 'green';
    if (broadSpectrum.some(d => drug.includes(d))) return 'yellow';
    return 'green'; // Default
}

// Main recommendation function
function getRecommendation(params) {
    const { infection, severity, gfr, allergies, risks, culture } = params;
    
    // Get base guideline
    let guideline = guidelines[infection];
    if (!guideline) {
        return { error: 'Infektion ej implementerad ännu' };
    }
    
    // Get severity-specific recommendation (default to moderate if not found)
    let rec = guideline[severity] || guideline['moderate'] || guideline['mild'];
    if (!rec) {
        return { error: 'Ingen rekommendation för denna svårighetsgrad' };
    }
    
    let result = {
        primary: { ...rec.firstLine },
        alternatives: [...(rec.alternatives || [])],
        warnings: [],
        stramaScore: getStramaScore(rec.firstLine.drug)
    };
    
    // Adjust for culture results
    if (culture && culture !== 'pending' && culture !== 'negative') {
        const cultureAdj = cultureAdjustments[culture];
        if (cultureAdj) {
            result.primary.drug = cultureAdj.preferred;
            result.primary.coverage = cultureAdj.coverage;
            result.cultureDirected = true;
            if (cultureAdj.warning) {
                result.warnings.push(cultureAdj.warning);
            }
            result.stramaScore = 'green'; // Culture-directed is always good
        }
    }
    
    // Check allergies
    if (allergies.includes('penicillin')) {
        if (result.primary.drug.toLowerCase().includes('penicillin') ||
            result.primary.drug.toLowerCase().includes('amoxicillin') ||
            result.primary.drug.toLowerCase().includes('piperacillin')) {
            // Find non-PC alternative
            const altDrug = result.alternatives.find(a => 
                a.note && a.note.includes('pc-allergi'));
            if (altDrug) {
                result.primary = { ...altDrug, coverage: 85 };
                result.warnings.push('Penicillinallergi - alternativt preparat valt');
            }
        }
    }
    
    // Check GFR
    const gfrAdj = adjustForGFR(result.primary.drug, gfr);
    if (gfrAdj) {
        if (gfrAdj.contraindicated) {
            result.warnings.push(gfrAdj.message);
            result.gfrWarning = true;
        } else if (gfrAdj.adjust) {
            result.warnings.push(`Njurfunktion: ${gfrAdj.message}`);
        }
    }
    
    // Check ESBL risk
    if (risks.includes('esbl') && !result.cultureDirected) {
        result.warnings.push('ESBL-risk: Överväg karbapanem om försämring');
        result.primary.coverage = Math.max(result.primary.coverage - 10, 70);
    }
    
    // Check MRSA risk
    if (risks.includes('mrsa') && !result.cultureDirected) {
        if (!result.primary.drug.includes('Vankomycin')) {
            result.warnings.push('MRSA-risk: Överväg tillägg av Vankomycin');
        }
    }
    
    return result;
}

// UI Functions
document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultState').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    
    // Collect form data
    const params = {
        infection: document.getElementById('infection').value,
        severity: document.getElementById('severity').value,
        gfr: parseInt(document.getElementById('gfr').value) || 90,
        allergies: [],
        risks: [],
        culture: document.getElementById('culture').value
    };
    
    // Collect allergies
    if (document.getElementById('allergy_pc').checked) params.allergies.push('penicillin');
    if (document.getElementById('allergy_cef').checked) params.allergies.push('cefalosporin');
    if (document.getElementById('allergy_sulfa').checked) params.allergies.push('sulfa');
    if (document.getElementById('allergy_fq').checked) params.allergies.push('fluorokinolon');
    
    // Collect risks
    if (document.getElementById('risk_mrsa').checked) params.risks.push('mrsa');
    if (document.getElementById('risk_esbl').checked) params.risks.push('esbl');
    if (document.getElementById('risk_pseudomonas').checked) params.risks.push('pseudomonas');
    if (document.getElementById('risk_immunocompromised').checked) params.risks.push('immunocompromised');
    
    // Simulate API delay
    setTimeout(() => {
        const result = getRecommendation(params);
        renderResult(result);
    }, 800);
});

function renderResult(result) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('resultState').classList.remove('hidden');
    
    if (result.error) {
        document.getElementById('recommendationContent').innerHTML = `
            <div style="text-align: center; color: var(--danger);">
                <p>⚠️ ${result.error}</p>
            </div>
        `;
        return;
    }
    
    const coverageClass = result.primary.coverage >= 90 ? 'coverage-high' :
                          result.primary.coverage >= 80 ? 'coverage-medium' : 'coverage-low';
    
    const scoreClass = result.stramaScore === 'green' ? 'score-green' :
                       result.stramaScore === 'yellow' ? 'score-yellow' : 'score-red';
    
    const scoreText = result.stramaScore === 'green' ? 'Smalspektrum ✓' :
                      result.stramaScore === 'yellow' ? 'Bredspektrum' : 'Reservpreparat';
    
    let html = `
        <div class="recommendation">
            <div class="recommendation-header">
                <span class="drug-name">${result.primary.drug}</span>
                <span class="coverage-badge ${coverageClass}">${result.primary.coverage}% täckning</span>
            </div>
            <div class="dosage">
                <strong>${result.primary.dose}</strong> ${result.primary.route}
                ${result.primary.days ? `i ${result.primary.days} dagar` : ''}
            </div>
            <div class="rationale">
                ${result.cultureDirected ? '🧫 Odlingsriktat val baserat på resistensbestämning' : 
                  '📋 Empiriskt val enligt Strama-riktlinjer'}
            </div>
        </div>
        
        <div class="strama-score">
            <div class="score-dot ${scoreClass}"></div>
            <span><strong>Strama-score:</strong> ${scoreText}</span>
        </div>
    `;
    
    if (result.warnings.length > 0) {
        html += `
            <div class="warnings">
                <h3>⚠️ Observera</h3>
                <ul>
                    ${result.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (result.alternatives.length > 0) {
        html += `
            <div class="alternatives">
                <h3>Alternativ</h3>
                ${result.alternatives.map(alt => `
                    <div class="alt-drug">
                        <span>${alt.drug} ${alt.dose}</span>
                        <span style="color: var(--text-secondary);">${alt.note || alt.route}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    document.getElementById('recommendationContent').innerHTML = html;
}
