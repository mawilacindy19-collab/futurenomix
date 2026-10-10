import { jsPDF } from 'jspdf';

export interface PDFProfileData {
  name: string;
  role: string;
  location: string;
  website?: string;
  email?: string;
  bio: string;
  skills: string[];
  projects?: string[];
  experience?: {
    title: string;
    period: string;
    description: string;
  }[];
}

export function generateProfilePDF(profile: PDFProfileData) {
  // Create PDF in A4 size (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2; // 170 mm
  let y = margin;

  // Helper to check and add new page
  const checkPageSpace = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - margin) {
      doc.addPage();
      // Draw modern header bar on subsequent pages
      doc.setFillColor(39, 39, 42); // Zinc 800
      doc.rect(margin, margin - 10, contentWidth, 1.5, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170); // Zinc 400
      doc.text(`${profile.name} — Professional Profile`, margin, margin - 5);
      
      y = margin + 10;
    }
  };

  // Helper to draw horizontal line
  const drawDivider = () => {
    checkPageSpace(10);
    y += 4;
    doc.setDrawColor(228, 228, 231); // Zinc 200
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  };

  // === 1. HEADER SECTION ===
  // Accent badge
  doc.setFillColor(24, 24, 27); // Zinc 900
  doc.rect(margin, y, 6, 6, 'F');
  
  // App brand indicator
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122); // Zinc 500
  doc.text('ORBIT WORKSPACE ALIGNED PROFILE', margin + 10, y + 4.5);
  y += 12;

  // Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(24, 24, 27); // Zinc 900
  doc.text(profile.name, margin, y);
  y += 8;

  // Primary Title/Role
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(82, 82, 91); // Zinc 600
  const splitRole = doc.splitTextToSize(profile.role, contentWidth);
  doc.text(splitRole, margin, y);
  y += (splitRole.length * 6) + 4;

  // Contact Details bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122); // Zinc 500
  
  const contactParts = [
    profile.location ? `Location: ${profile.location}` : '',
    profile.website ? `Website: ${profile.website}` : '',
    profile.email ? `Email: ${profile.email}` : 'Email: contact@orbit.app'
  ].filter(Boolean);

  doc.text(contactParts.join('   |   '), margin, y);
  y += 10;

  drawDivider();

  // === 2. SUMMARY SECTION ===
  checkPageSpace(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(24, 24, 27); // Zinc 900
  doc.text('SUMMARY & MISSION', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(63, 63, 70); // Zinc 700
  const splitBio = doc.splitTextToSize(profile.bio, contentWidth);
  doc.text(splitBio, margin, y, { lineHeightFactor: 1.4 });
  y += (splitBio.length * 5) + 8;

  // === 3. CORE EXPERTISE & SKILLS ===
  if (profile.skills && profile.skills.length > 0) {
    drawDivider();
    checkPageSpace(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27); // Zinc 900
    doc.text('KEY CAPABILITIES & CORE EXPERTISE', margin, y);
    y += 8;

    // Draw expertise chips beautifully as neat styled items in grid-like columns
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(39, 39, 42); // Zinc 800

    let col = 0;
    let startX = margin;
    const colWidth = contentWidth / 2;

    for (let i = 0; i < profile.skills.length; i++) {
      checkPageSpace(8);
      const skill = profile.skills[i];
      const posX = startX + (col * colWidth);
      
      // Draw subtle custom circle bullet
      doc.setFillColor(161, 161, 170); // Zinc 400
      doc.circle(posX + 1.5, y - 1, 1, 'F');
      
      // Draw skill label
      doc.text(skill, posX + 5, y);
      
      col++;
      if (col > 1) {
        col = 0;
        y += 7;
      }
    }
    if (col !== 0) {
      y += 7;
    }
    y += 3;
  }

  // === 4. COMPLETED & FEATURED PROJECTS ===
  if (profile.projects && profile.projects.length > 0) {
    drawDivider();
    checkPageSpace(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27); // Zinc 900
    doc.text('FEATURED & PROPOSED STARTUP INITIATIVES', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(63, 63, 70); // Zinc 700

    for (let i = 0; i < profile.projects.length; i++) {
      checkPageSpace(15);
      const proj = profile.projects[i];
      
      // Project Header Box
      doc.setFillColor(244, 244, 245); // Zinc 100
      doc.rect(margin, y - 4, contentWidth, 7, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(24, 24, 27);
      doc.text(proj, margin + 4, y + 1);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 113, 122);
      doc.text('Active ecosystem resource verified on Orbit Network.', margin + 4, y);
      y += 8;
    }
    y += 2;
  }

  // === 5. PROFESSIONAL JOURNEY ===
  if (profile.experience && profile.experience.length > 0) {
    drawDivider();
    checkPageSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27); // Zinc 900
    doc.text('JOURNEY & KEY MILESTONES', margin, y);
    y += 8;

    for (let i = 0; i < profile.experience.length; i++) {
      const exp = profile.experience[i];
      checkPageSpace(30);

      // Timeline Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(24, 24, 27); // Zinc 900
      doc.text(exp.title, margin, y);

      // Period (Align Right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122); // Zinc 500
      const periodWidth = doc.getTextWidth(exp.period);
      doc.text(exp.period, margin + contentWidth - periodWidth, y);
      y += 5;

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(82, 82, 91); // Zinc 600
      const splitExpDesc = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(splitExpDesc, margin, y, { lineHeightFactor: 1.3 });
      y += (splitExpDesc.length * 4.5) + 8;
    }
  }

  // === FOOTER PAGINATION ===
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170); // Zinc 400
    
    // Bottom border
    doc.setDrawColor(244, 244, 245);
    doc.line(margin, pageHeight - 15, margin + contentWidth, pageHeight - 15);
    
    // Footer text
    doc.text('Orbit Workspaces • Dynamic PDF Generator', margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth - 15, pageHeight - 10);
  }

  // Save the document with a descriptive title
  const formattedName = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  doc.save(`orbit-profile-${formattedName}.pdf`);
}
