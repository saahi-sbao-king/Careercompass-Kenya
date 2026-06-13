import { jsPDF } from 'jspdf';
import { 
  INTEL_DESCRIPTIONS,
  getLevel,
  IntelligenceType
} from '@/lib/assessment-data';

export interface PDFReportData {
  studentName: string;
  age: string;
  grade: string;
  school: string;
  pathway: string;
  reportDate: string;
  scores: Record<string, number>;
  schoolLogoUrl?: string;
}

export async function generateCareerBlueprintPDF(data: PDFReportData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const sortedInts = Object.entries(data.scores).sort(([, a], [, b]) => b - a);
  const topThree = sortedInts.slice(0, 3);

  const primaryColor = [67, 56, 202]; // #4338ca
  const secondaryColor = [249, 115, 22]; // #f97316

  // --- PAGE 1: EXECUTIVE SUMMARY ---
  
  // Header Block
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("Career Intelligence Blueprint", 15, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Designed by Sidmadina Technologies • ${data.reportDate}`, 15, 35);

  // Student Info Grid
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 60, pageWidth - 30, 30, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  doc.text("SCHOLAR NAME", 20, 70);
  doc.text("GRADE / CLASS", 70, 70);
  doc.text("INSTITUTION", 120, 70);
  doc.text("AGE", 170, 70);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.studentName, 20, 78);
  doc.text(data.grade, 70, 78);
  doc.text(data.school, 120, 78);
  doc.text(data.age, 170, 78);

  // Recommended Pathway
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.roundedRect(pageWidth - 85, 100, 70, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("RECOMMENDED PATHWAY", pageWidth - 80, 107);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.pathway, pageWidth - 80, 115);

  // Intelligence Profile Chart
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text("Intelligence Profile Summary", 15, 110);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  sortedInts.forEach(([key, score], i) => {
    const y = 125 + (i * 9);
    doc.text(`${key}`, 20, y);
    
    // Progress track
    doc.setFillColor(241, 245, 249);
    doc.rect(70, y - 3, 100, 3, 'F');
    
    // Progress fill
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(70, y - 3, (score / 25) * 100, 3, 'F');
    
    // Level Text
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(getLevel(score), 175, y);
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
  });

  // Top 3 Briefs
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Top Dominant Intelligences", 15, 215);

  topThree.forEach(([name, score], i) => {
    const y = 225 + (i * 18);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, pageWidth - 30, 15, 2, 2, 'F');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.text(`${i + 1}. ${name}`, 20, y + 9);
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Level: ${getLevel(score)} (${score}/25)`, pageWidth - 55, y + 9);
  });

  // Footer Page 1
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 285, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("CAREERCOMPASS KENYA | CBE ALIGNMENT | PAGE 1", pageWidth / 2, 292, { align: 'center' });

  // --- PAGE 2: QUALITATIVE DEPTH ---
  doc.addPage();
  
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Detailed Strategic Analysis", 15, 12);

  let currentY = 35;

  topThree.forEach(([name]) => {
    const meta = INTEL_DESCRIPTIONS[name as IntelligenceType];
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(name, 15, currentY);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(meta.desc, pageWidth - 30);
    doc.text(descLines, 15, currentY + 6);
    
    currentY += 6 + (descLines.length * 5);

    // Strengths & Careers Table
    doc.setFillColor(248, 250, 252);
    doc.rect(15, currentY, (pageWidth - 40) / 2, 35, 'F');
    doc.rect(20 + (pageWidth - 40) / 2, currentY, (pageWidth - 40) / 2, 35, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.text("KEY STRENGTHS", 20, currentY + 7);
    doc.text("CAREER AREAS", 25 + (pageWidth - 40) / 2, currentY + 7);
    
    doc.setFont("helvetica", "normal");
    meta.strengths.slice(0, 4).forEach((s, j) => doc.text(`• ${s}`, 20, currentY + 14 + (j * 4.5)));
    meta.careers.slice(0, 4).forEach((c, j) => doc.text(`• ${c}`, 25 + (pageWidth - 40) / 2, currentY + 14 + (j * 4.5)));
    
    currentY += 45;
  });

  // Recommended Clusters
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, currentY, pageWidth - 30, 40, 3, 3, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("RECOMMENDED CAREER CLUSTERS", 20, currentY + 10);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const clusters = ["STEM Careers", "Health Sciences", "Business & Entrepreneurship", "Creative Arts", "Public Service"];
  clusters.forEach((c, j) => {
    const col = j % 2;
    const row = Math.floor(j / 2);
    doc.text(`• ${c}`, 25 + (col * 80), currentY + 18 + (row * 6));
  });

  // Next Steps Summary
  currentY += 55;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CareerCompass Guidance Summary", 15, currentY);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const steps = [
    "Complete the Passion, Interest and Abilities Assessment.",
    "Explore recommended career pathways.",
    "Research relevant university, college and TVET programmes.",
    "Consult a teacher, parent or career counselor for further guidance."
  ];
  steps.forEach((s, j) => doc.text(`${j + 1}. ${s}`, 15, currentY + 8 + (j * 6)));

  // Final Footer Branded
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 285, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("CAREERCOMPASS KENYA | SIDMADINA TECHNOLOGIES | DISCOVER. LEARN. SUCCEED.", pageWidth / 2, 292, { align: 'center' });

  doc.save(`${data.studentName.replace(/\s+/g, '_')}_Career_Blueprint.pdf`);
}
