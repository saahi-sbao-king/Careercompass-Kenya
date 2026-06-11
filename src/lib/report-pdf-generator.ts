import { jsPDF } from 'jspdf';
import { 
  getRecommendedPassions, 
  getRecommendedAbilities, 
  getRecommendedInterests,
  getRecommendedCareers,
  getRecommendedSubjects 
} from '@/lib/assessment-data';

export interface PDFReportData {
  studentName: string;
  age: string;
  grade: string;
  school: string;
  pathway: string;
  reportDate: string;
  scores: Record<string, number>;
  studentPhotoUrl?: string | null;
  schoolLogoUrl?: string;
  careers?: string[];
  electives?: string[];
}

const intelligenceMetadata: Record<string, { label: string; rgb: [number, number, number] }> = {
  "Linguistic": { label: "Linguistic", rgb: [79, 70, 229] },
  "Logical-Math": { label: "Logical-Math", rgb: [16, 185, 129] },
  "Musical": { label: "Musical", rgb: [8, 145, 178] },
  "Naturalist": { label: "Naturalist", rgb: [101, 163, 13] },
  "Spatial": { label: "Spatial", rgb: [249, 115, 22] },
  "Intrapersonal": { label: "Intrapersonal", rgb: [100, 116, 139] },
  "Existential": { label: "Existential", rgb: [168, 85, 247] },
  "Interpersonal": { label: "Interpersonal", rgb: [14, 165, 233] },
  "Bodily-Kinesthetic": { label: "Bodily-Kinesthetic", rgb: [244, 63, 94] },
};

export async function generateCareerBlueprintPDF(data: PDFReportData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const sortedInts = Object.entries(data.scores).sort(([, a], [, b]) => b - a);
  const top3 = sortedInts.slice(0, 3);
  const formatScore = (score: number) => Math.round(score / 4);

  const careers = data.careers || getRecommendedCareers(data.scores);
  const electives = data.electives || getRecommendedSubjects(data.scores, data.pathway);

  // --- ZONE 1: EXECUTIVE HEADER (Indigo #4338ca) ---
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Decorative circle
  doc.setFillColor(255, 255, 255);
  // @ts-ignore
  if (typeof doc.setGState === 'function') {
    // @ts-ignore
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.circle(pageWidth - 10, 10, 30, 'F');
    // @ts-ignore
    doc.setGState(new doc.GState({ opacity: 1.0 }));
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CAREERCOMPASS KENYA", 15, 12);

  doc.setFontSize(18);
  doc.text("Career Assessment Report", 15, 20);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.school} • ${data.reportDate}`, 15, 26);

  // School Logo
  if (data.schoolLogoUrl) {
    try {
      doc.addImage(data.schoolLogoUrl, 'PNG', pageWidth - 35, 6, 22, 22);
    } catch (e) {
      console.error("PDF Logo Error:", e);
    }
  }

  // --- ZONE 2: IDENTIFICATION & PATHWAY ---
  doc.setFillColor(248, 250, 252); // bg-slate-50
  doc.roundedRect(15, 45, 115, 18, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240); // border-slate-200
  doc.roundedRect(15, 45, 115, 18, 2, 2, 'S');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.studentName, 22, 53);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`${data.age} Yrs • ${data.grade} • ${data.school}`, 22, 58);

  doc.setFillColor(16, 185, 129); // bg-emerald-500
  doc.roundedRect(140, 45, 55, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("RECOMMENDED PATHWAY", 167.5, 51, { align: 'center' });
  doc.setFontSize(9);
  doc.text(data.pathway, 167.5, 57, { align: 'center' });

  // --- ZONE 3: TOP INTELLIGENCES ---
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Top Intelligences", 15, 75);
  doc.line(15, 77, 45, 77);

  const medalLabels = ["PRIMARY", "SECONDARY", "TERTIARY"];
  top3.forEach(([key, score], i) => {
    const x = 15 + (i * 62);
    const meta = intelligenceMetadata[key] || { rgb: [100, 116, 139], label: key };
    
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, 82, 58, 28, 2, 2, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(x, 82, 58, 28, 2, 2, 'S');

    doc.setFillColor(meta.rgb[0], meta.rgb[1], meta.rgb[2]);
    doc.rect(x, 82, 58, 1.2, 'F');

    doc.setTextColor(67, 56, 202); // indigo-600
    doc.setFontSize(6);
    doc.text(medalLabels[i], x + 29, 88, { align: 'center' });
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(meta.label, x + 29, 94, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`${formatScore(score)}`, x + 25, 104, { align: 'center' });
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(7);
    doc.text("/25", x + 33, 104);
  });

  // --- ZONE 4: CAREERS & ELECTIVES ---
  // A. Recommended Careers
  doc.setFillColor(240, 249, 255); // indigo-50
  doc.roundedRect(15, 118, 90, 25, 2, 2, 'F');
  doc.setDrawColor(224, 242, 254);
  doc.roundedRect(15, 118, 90, 25, 2, 2, 'S');
  doc.setTextColor(3, 105, 161);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("RECOMMENDED CAREERS", 20, 124);
  doc.setFontSize(6);
  doc.setTextColor(30, 41, 59);
  doc.text(careers.join(", "), 20, 130, { maxWidth: 80 });

  // B. CBE Subjects
  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(110, 118, 85, 25, 2, 2, 'F');
  doc.setDrawColor(254, 243, 199);
  doc.roundedRect(110, 118, 85, 25, 2, 2, 'S');
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(7);
  doc.text("RECOMMENDED 3 ELECTIVES", 115, 124);
  doc.setFontSize(6);
  doc.setTextColor(30, 41, 59);
  doc.text(electives.join(", "), 115, 130, { maxWidth: 75 });

  // --- ZONE 5: QUALITATIVE INSIGHTS ---
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 150, 180, 35, 2, 2, 'F');
  doc.setDrawColor(241, 245, 249);
  doc.roundedRect(15, 150, 180, 35, 2, 2, 'S');

  const interests = getRecommendedInterests(data.scores).slice(0, 3);
  const passions = getRecommendedPassions(data.scores).slice(0, 3);
  const abilities = getRecommendedAbilities(data.scores).slice(0, 3);

  doc.setTextColor(67, 56, 202);
  doc.setFontSize(7);
  doc.text("INTERESTS", 20, 156);
  interests.forEach((item, i) => {
    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${item}`, 20, 162 + (i * 4));
  });

  doc.setTextColor(4, 120, 87);
  doc.text("PASSIONS", 80, 156);
  passions.forEach((item, i) => {
    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${item}`, 80, 162 + (i * 4));
  });

  doc.setTextColor(14, 116, 144);
  doc.text("ABILITIES", 140, 156);
  abilities.forEach((item, i) => {
    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${item}`, 140, 162 + (i * 4));
  });

  // --- ZONE 6: FULL PROFILE ---
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Full Intelligence Profile", 15, 195);
  doc.line(15, 197, 55, 197);

  sortedInts.forEach(([key, score], i) => {
    const y = 205 + (i * 7);
    const meta = intelligenceMetadata[key] || { rgb: [100, 116, 139], label: key };
    
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(meta.label.toUpperCase(), 15, y, { align: 'left' });

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(50, y - 1.5, 125, 1.5, 0.5, 0.5, 'F');
    doc.setFillColor(meta.rgb[0], meta.rgb[1], meta.rgb[2]);
    doc.roundedRect(50, y - 1.5, (score / 100) * 125, 1.5, 0.5, 0.5, 'F');

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6);
    doc.text(`${formatScore(score)}/25`, 190, y, { align: 'right' });
  });

  // --- ZONE 7: FOOTER BRANDING ---
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 282, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text(`CareerCompass Kenya | Designed by Sidmadina Techgroup`, pageWidth / 2, 289, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255, 0.6);
  doc.text(`Kenya's Competency-Based Education (CBE) System Alignment`, pageWidth / 2, 293, { align: 'center' });

  doc.save(`${data.studentName.replace(/\s+/g, '_')}_Career_Blueprint.pdf`);
}
