import { jsPDF } from 'jspdf';
import { 
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
  schoolLogoUrl?: string;
}

export async function generateCareerBlueprintPDF(data: PDFReportData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const sortedInts = Object.entries(data.scores).sort(([, a], [, b]) => b - a);
  const formatScore = (score: number) => Math.round(score / 4);

  // --- HEADER ---
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Career Assessment Report", 15, 20);
  doc.setFontSize(8);
  doc.text(`Designed by Sidmadina Technologies • ${data.reportDate}`, 15, 30);

  // --- CONTENT ---
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text(`Student: ${data.studentName}`, 15, 55);
  doc.text(`Pathway: ${data.pathway}`, 15, 65);

  doc.setFontSize(10);
  doc.text("Intelligence Profile:", 15, 85);
  sortedInts.forEach(([key, score], i) => {
    const y = 95 + (i * 10);
    doc.text(`${key}: ${formatScore(score)}/25`, 20, y);
    doc.setFillColor(241, 245, 249);
    doc.rect(80, y - 3, 100, 2, 'F');
    doc.setFillColor(67, 56, 202);
    doc.rect(80, y - 3, (score / 100) * 100, 2, 'F');
  });

  // --- FOOTER ---
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 280, pageWidth, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("CAREERCOMPASS KENYA | CBE ALIGNMENT SYSTEM | SIDMADINA TECHNOLOGIES", pageWidth / 2, 290, { align: 'center' });

  doc.save(`${data.studentName.replace(/\s+/g, '_')}_Career_Blueprint.pdf`);
}