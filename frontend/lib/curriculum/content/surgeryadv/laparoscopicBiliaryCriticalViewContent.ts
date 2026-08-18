/**
 * Clinical Surgery Advanced: Laparoscopic & Biliary Surgery: The Critical View of Safety
 * Authoritative surgical content derived from SAGES Guidelines, Strasberg BDI Classification, Schwartz (11th ed.).
 * Mapped to NMC CBME Competencies: SU3.1, SU3.2, MD43.2, SU41.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LAPAROSCOPIC_BILIARY_CRITICAL_VIEW_MODULE: PhysiologyLessonModule = {
  id: "surgery-adv-biliary-critical-view",
  unitCode: "SU3.1",
  title: "Laparoscopic Cholecystectomy: The Critical View of Safety (CVS) & Bile Duct Injury Prevention",
  competencies: ["SU3.1", "SU3.2", "MD43.2", "SU41.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Laparoscopic Cholecystectomy: Critical View of Safety & BDI Prevention

Iatrogenic Bile Duct Injury (BDI) is the most catastrophic complication of laparoscopic cholecystectomy, preventable by strict adherence to the Strasberg Critical View of Safety (CVS).

---

## 1. The Three Mandatory Criteria of the Critical View of Safety (CVS)

$$\\begin{array}{lcc}
\\hline
\\textbf{Criterion} & \\textbf{Surgical Dissection Target} & \\textbf{Anatomical Verification Mandate} \\\\
\\hline
\\textbf{1. Clear Triangle} & \\mathbf{\\text{Hepatocystic (Calot's) Triangle}} & \\text{Completely dissect all fat and fibrous tissue from the triangle;} \\\\
& & \\text{common bile duct and liver surface clearly visualized} \\\\
\\textbf{2. Expose Plate} & \\mathbf{\\text{Lower 1/3 of Gallbladder Bed}} & \\text{Gallbladder base is separated from the cystic plate of the liver} \\\\
& & \\text{so that the liver bed is directly seen behind the gallbladder} \\\\
\\textbf{3. Two Structures} & \\mathbf{\\text{Only TWO Structures Entering GB}} & \\mathbf{\\text{Only the Cystic Duct and Cystic Artery are seen directly}} \\\\
& & \\mathbf{\\text{entering the gallbladder; DO NOT CLIP until CVS is 100\\% achieved!}} \\\\
\\hline
\\end{array}$$

---

## 2. Strasberg Classification of Iatrogenic Bile Duct Injury (BDI)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Strasberg Type} & \\textbf{Anatomic Location of Injury} & \\textbf{Common Mechanism} & \\textbf{Clinical Presentation} & \\textbf{Definitive Repair Protocol} \\\\
\\hline
\\textbf{Type A} & \\text{Cystic duct stump / minor duct of Luschka} & \\text{Slipped clip, thermal burn} & \\text{Biliary peritonitis / biloma} & \\text{ERCP biliary sphincterotomy + stent} \\\\
\\textbf{Type B} & \\text{Occlusion of aberrant right sectoral duct} & \\text{Misidentified clipped branch} & \\text{Segmental atrophy, cholangitis} & \\text{Hepatic resection or observation} \\\\
\\textbf{Type C} & \\text{Transection of aberrant right sectoral duct} & \\text{Inadvertent cutting of branch} & \\text{Bile leak, bile peritonitis} & \\text{Roux-en-Y hepaticojejunostomy} \\\\
\\textbf{Type D} & \\text{Lateral partial injury to Common Bile Duct} & \\text{Cautery burn, tearing} & \\text{Bile leak / jaundice} & \\text{Primary repair over T-tube / ERCP} \\\\
\\textbf{Type E (E1-E5)} & \\mathbf{\\text{Complete Circumferential Transection}} & \\mathbf{\\text{Classic misidentification of CBD}} & \\mathbf{\\text{Progressive obstructive jaundice,}} & \\mathbf{\\text{Roux-en-Y Hepaticojejunostomy}} \\\\
& \\mathbf{\\text{of Common Hepatic / Bile Duct}} & \\mathbf{\\text{as cystic duct (clipped/transected)}} & \\mathbf{\\text{biloma, acute liver failure}} & (\\text{by experienced hepatobiliary surgeon}) \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "During an elective laparoscopic cholecystectomy for symptomatic cholelithiasis in a 44-year-old female, the surgeon encounters dense inflammation in Calot's triangle. A tubular structure is isolated and thought to be the cystic duct. Before applying clips, the surgical team performs a critical pause to verify the Strasberg Critical View of Safety (CVS). They observe that while the lower third of the gallbladder is detached from the liver bed, adipose tissue still obscures the hepatocystic triangle, and the common bile duct is not clearly visualized.",
      question: "Which of the following is the most appropriate surgical action according to SAGES Safe Cholecystectomy guidelines?",
      options: [
        "Do not apply clips; continue careful dissection until the hepatocystic triangle is cleared of all fat and fibrous tissue, confirming that only two structures enter the gallbladder (CVS), or convert to an open procedure / subtotal cholecystectomy if CVS cannot be achieved safely",
        "Place clips immediately and transect the tubular structure to expedite the operation",
        "Ligate the structure with a suture loop and proceed without further dissection",
        "Perform immediate blind cautery coagulation of the surrounding tissue"
      ],
      correctAnswerIndex: 0,
      explanation: "According to SAGES Safe Cholecystectomy protocols and Strasberg criteria: Clips must NEVER be applied to any tubular structure until the Critical View of Safety (CVS) has been 100% definitively achieved. The 3 CVS requirements are: (1) Clearance of all fat and fibrous tissue from the hepatocystic triangle; (2) Dissection of the lower third of the gallbladder off the cystic plate of the liver bed; and (3) Visualization of two and only two structures entering the gallbladder. If inflammation, fibrosis, or aberrant anatomy prevents safe achievement of CVS, the surgeon must execute a 'bailout' strategy—such as laparoscopic fenestrating/reconstituting subtotal cholecystectomy or conversion to open surgery—to avoid catastrophic common bile duct transection (Strasberg Type E injury)."
    }
  ]
};
