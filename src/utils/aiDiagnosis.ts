import diseasesData from '../data/diseases.json';
import symptomsData from '../data/symptoms.json';

export interface DiagnosisResult {
  disease: any;
  score: number;
  matchPercentage: number;
  hasRedFlag: boolean;
}

/**
 * Logika evaluasi bobot Sacred Seven.
 * Menerima daftar ID gejala awal dan skor evaluasi tambahan dari anamnesis.
 */
export function predictDiagnosis(
  selectedSymptomIds: string[], 
  anamnesisScoreMultiplier: Record<string, number> = {} // Kunci: id_penyakit, Nilai: pengali bobot (1-3)
): DiagnosisResult[] {
  if (!selectedSymptomIds || selectedSymptomIds.length === 0) return [];

  const results = diseasesData.map((disease: any) => {
    let score = 0;
    let maxPossibleScore = 0;
    let hasRedFlag = false; // Akan diaktifkan oleh UI jika jawaban sacred seven cocok dengan red flag

    // 1. Hitung base score dari gejala yang dipilih
    if (disease.symptoms_weights) {
      // Hitung total skor maksimum jika semua gejala penyakit ini terpenuhi
      Object.values(disease.symptoms_weights).forEach((weight: any) => {
        maxPossibleScore += (weight as number);
      });

      selectedSymptomIds.forEach((symId) => {
        if (disease.symptoms_weights[symId]) {
          score += disease.symptoms_weights[symId];
        }
      });
    } else {
      maxPossibleScore = 10;
      score = 0;
    }

    // 2. Terapkan multiplier dari hasil interaksi Sacred Seven
    // Jika anamnesis untuk penyakit ini sangat cocok, multiplier > 1
    const multiplier = anamnesisScoreMultiplier[disease.id] || 1;
    score = score * multiplier;

    const matchPercentage = maxPossibleScore > 0 ? Math.min(Math.round((score / maxPossibleScore) * 100), 100) : 0;
    
    return {
      disease,
      score,
      matchPercentage,
      hasRedFlag
    };
  });

  // Urutkan berdasarkan score tertinggi, lalu persentase
  results.sort((a, b) => b.score - a.score || b.matchPercentage - a.matchPercentage);

  // Filter yang memiliki setidaknya sedikit kecocokan
  return results.filter(r => r.score > 0).slice(0, 3);
}

// Fungsi bantu untuk mendapatkan detail gejala berdasarkan ID
export function getSymptomDetails(symId: string) {
  return symptomsData.find(s => s.id === symId);
}
