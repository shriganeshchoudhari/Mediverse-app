import os

chapters_rich_data = {
    "hemodynamics": {
        "title": "Hemodynamics",
        "analogy": "Blood vessels are like a city's plumbing system: narrow pipes (arterioles) offer high resistance, wide pipes (aorta) allow high flow, and a viscous fluid (like syrup vs. water) requires much more pump pressure to move through the network.",
        "concept": "Hemodynamics is the study of the physical laws governing blood flow, pressure, and resistance. Blood flow (Q) is directly proportional to the pressure gradient (ΔP) and inversely proportional to vascular resistance (R).",
        "anatomy": "The vascular tree consists of the high-pressure arterial system (aorta, arteries, arterioles), the exchange network (capillaries), and the low-pressure venous system (venules, veins, vena cava). Arterioles contain smooth muscle and serve as the main resistance vessels.",
        "physiology": "Normal pressures: Aorta SBP/DBP = 120/80 mmHg; Capillaries = 30 mmHg (arterial end) to 10 mmHg (venous end); Vena Cava = 2-4 mmHg. Blood flow is laminar under normal conditions but can become turbulent when velocity increases (high Reynolds number).",
        "mechanism": "According to Poiseuille's law, resistance is inversely proportional to the fourth power of the radius ($R \\propto 1/r^4$). Vasoconstriction (radius halved) increases resistance 16-fold, reducing blood flow. Viscosity ($\eta$), driven by hematocrit, and vessel length ($L$) also increase resistance.",
        "flowchart": """graph TD
    A[Cardiac Contraction] -->|Generates| B[Pressure Gradient - delta P]
    B -->|Drives flow through| C[Vascular Resistance - R]
    C -->|Determined by| D[Blood Viscosity - eta]
    C -->|Determined by| E[Vessel Length - L]
    C -->|Critically determined by| F[Vessel Radius - r]
    F -->|Halving radius causes| G[16-fold Resistance Increase]""",
        "correlation": "Turbulent flow produces sounds (bruits in constricted arteries, murmurs in stenotic heart valves) that can be auscultated. It is predicted by the Reynolds number ($Re > 2000-3000$).",
        "disorders": "1. Atherosclerosis: Narrowing of arteries, increasing resistance and arterial pressure. 2. Polycythemia: Elevated RBC count, increasing viscosity and workload on the heart.",
        "formula": "Q = \\frac{\\Delta P}{R}, \\quad R = \\frac{8\\eta L}{\\pi r^4}, \\quad Re = \\frac{\\rho v d}{\\eta}",
        "mnemonics": "TPR is AR (Total Peripheral Resistance is determined primarily by Arteriole Radius).",
        "viva": [
            "What is Poiseuille's law? **Answer**: It defines resistance in laminar flow: $R = 8\\eta L / \\pi r^4$, showing that radius is the most powerful determinant.",
            "Explain the difference between laminar and turbulent flow. **Answer**: Laminar flow is silent and layered (fastest in the center). Turbulent flow is chaotic, noisy, and requires higher pressure to drive."
        ],
        "mcqs": [
            {
                "q": "If the radius of an arteriole is reduced to half its original size, the resistance to blood flow increases by:",
                "a": "A) 2 times", "b": "B) 4 times", "c": "C) 8 times", "d": "D) 16 times",
                "ans": "D", "exp": "According to Poiseuille's law, resistance is inversely proportional to $r^4$. $(1/0.5)^4 = 16$."
            }
        ],
        "case": "A patient presents with a carotid bruit. Doppler ultrasound reveals 70% narrowing of the internal carotid artery. **Analysis**: The stenosis reduces vessel radius, causing a local increase in blood velocity ($v$) and turbulence ($Re > 2000$), generating the auscultable bruit.",
        "flashcards": [
            {"f": "What is the primary site of peripheral vascular resistance?", "b": "The arterioles."},
            {"f": "How does hematocrit affect hemodynamics?", "b": "Elevated hematocrit increases blood viscosity, raising vascular resistance."}
        ]
    },
    "ecg": {
        "title": "Electrocardiogram",
        "analogy": "The ECG is like having cameras positioned at different angles around a soccer stadium (Einthoven's leads): they don't capture individual players' muscle contractions, but they trace the overall movement of the crowd (electrical depolarization waves) moving toward or away from the cameras.",
        "concept": "The ECG is a surface recording of the sum of cardiac electrical activity. Depolarization waves moving toward a positive electrode produce upward deflections, while those moving away produce downward deflections.",
        "anatomy": "The cardiac conduction system: Sinoatrial (SA) node, Internodal pathways, Atrioventricular (AV) node, Bundle of His, Left and Right Bundle Branches, and Purkinje fibers.",
        "physiology": "Normal waves: P wave (atrial depolarization, <0.12s); QRS complex (ventricular depolarization, <0.10s); T wave (ventricular repolarization). Intervals: PR interval (AV delay, 0.12-0.20s); QT interval (total ventricular action potential, <0.44s).",
        "mechanism": "Leads capture cardiac dipole vectors. Standard limb leads (I, II, III) form Einthoven's Triangle. Augmented limb leads (aVR, aVL, aVF) and precordial chest leads (V1-V6) provide a 3D view of electrical conduction.",
        "flowchart": """graph TD
    A[SA Node fires] -->|Causes| B[Atrial Depolarization - P Wave]
    B -->|Conduction delay at| C[AV Node - PR Segment]
    C -->|Spreads through branches to| D[Ventricular Depolarization - QRS Complex]
    D -->|Plateau phase of AP| E[Isoelectric ST Segment]
    E -->|Causes| F[Ventricular Repolarization - T Wave]""",
        "correlation": "ST-segment elevation indicates acute myocardial infarction (STEMI). Prolonged PR interval (>0.20s) indicates first-degree AV heart block.",
        "disorders": "1. Atrial Fibrillation: Absent P waves and irregular R-R intervals. 2. Ventricular Tachycardia: Rapid, wide, monomorphic QRS complexes. 3. Hyperkalemia: Tall, peaked T waves.",
        "formula": "\\text{Heart Rate (bpm)} = \\frac{300}{\\text{Number of large squares between R-R waves}}",
        "mnemonics": "Limb Leads Are I, II, III (Lead I: Right Arm to Left Arm; Lead II: Right Arm to Left Leg; Lead III: Left Arm to Left Leg).",
        "viva": [
            "What does the PR interval represent? **Answer**: The time from the onset of atrial depolarization to the onset of ventricular depolarization, including the AV nodal conduction delay.",
            "Why is the ST segment normally isoelectric? **Answer**: Because all ventricular myocytes are depolarized (plateau phase of action potential), resulting in zero potential difference."
        ],
        "mcqs": [
            {
                "q": "A prolonged PR interval (>0.22 seconds) is diagnostic of:",
                "a": "A) First-degree AV block", "b": "B) Second-degree Mobitz I block", "c": "C) Left bundle branch block", "d": "D) Myocardial infarction",
                "ans": "A", "exp": "First-degree AV block is characterized by a constant PR interval prolongation > 0.20s without dropped beats."
            }
        ],
        "case": "A 60-year-old man presents with chest pain. His ECG shows ST-segment elevation in leads II, III, and aVF. **Analysis**: This represents an acute inferior wall myocardial infarction (STEMI) involving the right coronary artery.",
        "flashcards": [
            {"f": "What does a pathological Q wave indicate?", "b": "Prior transmural myocardial infarction (necrosis)."},
            {"f": "Which lead is best for evaluating atrial activity (P waves)?", "b": "Lead II and V1."}
        ]
    },
    "cardiac-output": {
        "title": "Cardiac Output",
        "analogy": "Cardiac output is like the volume of water delivered by a fire truck per minute: it depends on how fast the pump cycles (Heart Rate) and how much water is squirted per stroke (Stroke Volume).",
        "concept": "Cardiac Output (CO) is the volume of blood pumped by each ventricle per minute. CO = Heart Rate (HR) x Stroke Volume (SV). Normal resting CO is ~5.0 L/min.",
        "anatomy": "Left and right ventricles, myocardium, AV and semilunar valves, and the autonomic nervous system fibers (vagus and sympathetic chain).",
        "physiology": "Normal HR: 60-100 bpm. Normal SV: 70 mL. Stroke volume is determined by Preload (Frank-Starling law), Afterload (arterial pressure), and Contractility (inotropic state).",
        "mechanism": "Frank-Starling Law: An increase in venous return stretches the ventricles (increased end-diastolic volume/preload), aligning actin and myosin filaments optimally, generating a stronger contraction and increasing stroke volume.",
        "flowchart": """graph TD
    A[Venous Return increases] -->|Raises| B[End-Diastolic Volume - Preload]
    B -->|Stretches| C[Ventricular Myocytes]
    C -->|Increases| D[Actin-Myosin Overlap & Ca2+ Sensitivity]
    D -->|Causes| E[Increased Contraction Force]
    E -->|Raises| F[Stroke Volume - SV]
    F -->|Multiplied by HR yields| G[Increased Cardiac Output]""",
        "correlation": "Heart failure is characterized by a reduced Ejection Fraction (EF < 40-50%), where the ventricle cannot pump out an adequate fraction of its end-diastolic volume.",
        "disorders": "1. Systolic Heart Failure: Decreased myocardial contractility. 2. Diastolic Heart Failure: Ventricular hypertrophy preventing normal diastolic filling.",
        "formula": "CO = HR \\times SV, \\quad SV = EDV - ESV, \\quad EF = \\frac{SV}{EDV} \\times 100",
        "mnemonics": "PAC (Determinants of Stroke Volume: Preload, Afterload, Contractility).",
        "viva": [
            "Define Ejection Fraction and state its normal range. **Answer**: The percentage of blood ejected from the ventricle per beat: $EF = (SV/EDV) \\times 100$. Normal is 55% to 70%.",
            "What is the Fick Principle for measuring cardiac output? **Answer**: CO = Oxygen consumption / (Arterial O2 content - Mixed venous O2 content)."
        ],
        "mcqs": [
            {
                "q": "According to the Frank-Starling mechanism, the primary determinant of stroke volume is:",
                "a": "A) Heart rate", "b": "B) Mean arterial pressure", "c": "C) End-diastolic volume", "d": "D) Total peripheral resistance",
                "ans": "C", "exp": "Frank-Starling mechanism states that contractility and stroke volume increase in response to increased preload (EDV)."
            }
        ],
        "case": "A patient with dilated cardiomyopathy has an EDV of 150 mL and an ESV of 105 mL. **Analysis**: SV = 150 - 105 = 45 mL. EF = (45 / 150) * 100 = 30%. This represents severe systolic dysfunction.",
        "flashcards": [
            {"f": "What is the normal resting cardiac output?", "b": "Approximately 5.0 L/min."},
            {"f": "How does sympathetic stimulation affect cardiac output?", "b": "It increases both heart rate (positive chronotropy) and contractility (positive inotropy)."}
        ]
    },
    "bp-regulation": {
        "title": "Blood Pressure Regulation",
        "analogy": "Blood pressure regulation is like maintaining constant pressure in a city water main: the brain uses rapid sensors (baroreceptors) to adjust the pump speed (heart) and faucet diameters (vessels) second-by-second, while the kidney acts as a slow floodgate, adjusting water volume over days.",
        "concept": "Mean Arterial Pressure (MAP) is regulated by short-term neural reflexes (baroreceptors) and long-term renal humoral mechanisms (Renin-Angiotensin-Aldosterone System - RAAS).",
        "anatomy": "Carotid sinus and aortic arch baroreceptors, medulla oblongata (vasomotor center), autonomic nerves, and renal juxtaglomerular apparatus.",
        "physiology": "Normal BP is <120/80 mmHg. MAP = Diastolic BP + 1/3 Pulse Pressure. Short-term regulation corrects posture-induced pressure drops, while long-term regulation controls blood volume.",
        "mechanism": "RAAS Cascade: 1. Low renal perfusion triggers Renin release, 2. Renin converts Angiotensinogen to Angiotensin I, 3. ACE converts Angiotensin I to Angiotensin II, 4. Angiotensin II causes vasoconstriction and stimulates Aldosterone release, 5. Aldosterone increases renal Na+ and water reabsorption.",
        "flowchart": """graph TD
    A[Drop in Blood Pressure] -->|Stimulates| B[Renal Juxtaglomerular Cells]
    B -->|Secrete| C[Renin]
    C -->|Converts Angiotensinogen to| D[Angiotensin I]
    D -->|ACE converts in lungs to| E[Angiotensin II]
    E -->|Causes| F[Potent Vasoconstriction]
    E -->|Stimulates| G[Adrenal Cortex Aldosterone Secretion]
    G -->|Increases| H[Renal Na+ & H2O Reabsorption]
    F & H -->|Raise| I[Blood Pressure back to normal]""",
        "correlation": "ACE inhibitors (e.g. Lisinopril) and ARBs (e.g. Losartan) are primary antihypertensive medications that block the RAAS pathway.",
        "disorders": "1. Primary Hypertension: Chronic elevation of BP without an identifiable cause. 2. Orthostatic Hypotension: Drop in SBP >20 mmHg upon standing due to impaired baroreceptor reflex.",
        "formula": "MAP = CO \\times TPR, \\quad MAP = DBP + \\frac{PP}{3}, \\quad PP = SBP - DBP",
        "mnemonics": "ALDO holds Salt, ADH holds Water (Aldosterone reabsorbs Na+; ADH/Vasopressin reabsorbs pure water).",
        "viva": [
            "Where are the baroreceptors located? **Answer**: In the carotid sinus (monitored by CN IX) and the aortic arch (monitored by CN X).",
            "What is the long-term regulator of blood pressure? **Answer**: The kidneys, by regulating blood volume via pressure natriuresis."
        ],
        "mcqs": [
            {
                "q": "Which enzyme converts Angiotensin I to Angiotensin II?",
                "a": "A) Renin", "b": "B) Angiotensin-converting enzyme (ACE)", "c": "C) Aldosterone synthase", "d": "D) Pepsin",
                "ans": "B", "exp": "ACE is primarily located in the pulmonary vascular endothelium and converts Angiotensin I to II."
            }
        ],
        "case": "A patient stands up quickly and feels dizzy. Their BP drops from 120/80 to 90/60 mmHg, and heart rate does not increase. **Analysis**: This is Orthostatic Hypotension due to autonomic neuropathy or baroreceptor dysfunction, failing to trigger sympathetic vasoconstriction.",
        "flashcards": [
            {"f": "What is the primary action of Aldosterone?", "b": "To increase sodium reabsorption and potassium excretion in the renal collecting ducts."},
            {"f": "How does the baroreceptor reflex respond to high blood pressure?", "b": "It increases parasympathetic outflow (vagal) to slow the heart and decreases sympathetic outflow to dilate arterioles."}
        ]
    },
    "coronary-circulation": {
        "title": "Coronary Circulation",
        "analogy": "The coronary circulation is like a delivery truck that can only unload packages when the engine is off: because the contracting heart muscle squeezes its own blood vessels during systole, the heart can only receive its own nourishment (coronary blood flow) during diastole.",
        "concept": "Coronary circulation delivers oxygenated blood to the myocardium. It is unique because 80% of left ventricular coronary blood flow occurs during diastole, and it is regulated primarily by metabolic factors.",
        "anatomy": "Left Main Coronary Artery (divides into LAD and Circumflex) and Right Coronary Artery. They originate from the sinuses of Valsalva just above the aortic valve.",
        "physiology": "Normal coronary blood flow is 250 mL/min (5% of cardiac output). The myocardium has a high oxygen extraction ratio (70-80%), meaning oxygen delivery can only increase by increasing blood flow.",
        "mechanism": "Local Metabolic Autoregulation: When cardiac workload increases, oxygen consumption rises, producing local vasodilators, primarily Adenosine and Nitric Oxide (NO). These dilate coronary arterioles to increase blood flow.",
        "flowchart": """graph TD
    A[Increased Cardiac Workload] -->|Raises| B[Myocardial O2 Consumption]
    B -->|Causes local hypoxia & splits ATP to| C[Adenosine & Nitric Oxide]
    C -->|Diffuses to| D[Coronary Vascular Smooth Muscle]
    D -->|Triggers| E[Arteriolar Vasodilation]
    E -->|Increases| F[Coronary Blood Flow]
    F -->|Delivers| G[More Oxygen to match demand]""",
        "correlation": "Coronary Artery Disease (CAD) is characterized by atherosclerotic plaques. When narrowing exceeds 70%, oxygen delivery during exercise falls below demand, causing angina pectoris.",
        "disorders": "1. Angina Pectoris: Transient myocardial ischemia causing chest pain. 2. Myocardial Infarction: Complete occlusion of a coronary artery leading to necrosis.",
        "formula": "\\text{Coronary Perfusion Pressure} = \\text{Diastolic BP} - \\text{Left Ventricular End-Diastolic Pressure}",
        "mnemonics": "LAD is the Widowmaker (Left Anterior Descending artery occlusion is the most common cause of fatal myocardial infarctions).",
        "viva": [
            "Why is the subendocardium most vulnerable to ischemia? **Answer**: It experiences the highest compressive forces during systole, limiting its perfusion window compared to epicardial layers.",
            "What is the primary metabolic vasodilator in the coronary circulation? **Answer**: Adenosine."
        ],
        "mcqs": [
            {
                "q": "Most of the blood flow to the left ventricle occurs during:",
                "a": "A) Isovolumetric contraction", "b": "B) Rapid ejection phase", "c": "C) Diastole", "d": "D) Atrial systole",
                "ans": "C", "exp": "During ventricular systole, myocardial compression squeezes coronary vessels, preventing flow. Perfuson occurs during diastole."
            }
        ],
        "case": "A patient experiences crushing chest pain that radiates to their left arm during exertion, relieved by sublingual Nitroglycerin. **Analysis**: This is stable angina. Exertion increases oxygen demand. Nitroglycerin releases Nitric Oxide, causing systemic venodilation (reducing preload/workload) and coronary vasodilation.",
        "flashcards": [
            {"f": "What is the normal myocardial oxygen extraction ratio?", "b": "Approximately 70-80% (very high compared to skeletal muscle's 25%)."},
            {"f": "Which artery is the main branch of the Left Main Coronary Artery?", "b": "The Left Anterior Descending (LAD) and Left Circumflex (LCx) arteries."}
        ]
    },
    "gas-exchange": {
        "title": "Gas Exchange",
        "analogy": "Gas exchange across the respiratory membrane is like commuters passing through a turnstile: the rate of diffusion depends on the area of the turnstile (alveolar surface area), the pressure pushing from behind (partial pressure gradient), and how thin the gate is (membrane thickness).",
        "concept": "Oxygen and Carbon Dioxide transfer between alveoli and pulmonary capillaries via simple passive diffusion, governed by Fick's law of diffusion.",
        "anatomy": "The respiratory membrane: alveolar epithelium, epithelial basement membrane, interstitial space, capillary basement membrane, and capillary endothelium. Total thickness is <0.6 µm.",
        "physiology": "Normal partial pressures: Alveolar pO2 = 104 mmHg, pCO2 = 40 mmHg. Mixed venous pO2 = 40 mmHg, pCO2 = 45 mmHg. The diffusion coefficient of CO2 is 20 times higher than that of O2.",
        "mechanism": "Fick's Law of Diffusion: The volume of gas diffusing per minute ($V_{gas}$) is directly proportional to the surface area ($A$), diffusion coefficient ($D$), and partial pressure difference ($P_1 - P_2$), and inversely proportional to membrane thickness ($T$).",
        "flowchart": """graph TD
    A[Alveolar pO2 = 104 mmHg] -->|Pressure Gradient| B[Venous Capillary pO2 = 40 mmHg]
    B -->|Rapid diffusion of O2 across| C[Thin Respiratory Membrane - 0.5 um]
    C -->|Equlibrium reached in| D[0.25 seconds]
    D -->|Leaves lung at| E[Arterial pO2 = 100 mmHg]
    F[Venous pCO2 = 45 mmHg] -->|Diffuses to Alveolar pCO2 = 40 mmHg| G[CO2 excretion]""",
        "correlation": "Pulmonary edema increases membrane thickness ($T$), slowing O2 diffusion and causing arterial hypoxemia. Emphysema destroys alveolar walls, reducing surface area ($A$) and impairing exchange.",
        "disorders": "1. Pulmonary Fibrosis: Thickening of the interstitial space, limiting gas diffusion. 2. Ventilation-Perfusion (V/Q) Mismatch: Shunt (V/Q = 0) or Dead Space (V/Q = infinity) impairing blood oxygenation.",
        "formula": "V_{gas} = \\frac{A \\cdot D \\cdot (P_1 - P_2)}{T}, \\quad P_A O_2 = F_I O_2(P_B - 47) - \\frac{P_a CO_2}{R}",
        "mnemonics": "CO2 is 20x faster (Carbon dioxide is 20 times more soluble than oxygen, diffusing rapidly despite a small pressure gradient).",
        "viva": [
            "State Fick's Law of Diffusion. **Answer**: The diffusion rate is directly proportional to the surface area and pressure gradient, and inversely proportional to the membrane thickness.",
            "What is the Alveolar-arterial (A-a) oxygen gradient? **Answer**: The difference between alveolar pO2 and arterial pO2. A high gradient (>15-20 mmHg) indicates intrinsic lung disease."
        ],
        "mcqs": [
            {
                "q": "Which of the following increases the rate of gas diffusion across the respiratory membrane?",
                "a": "A) Increased membrane thickness", "b": "B) Decreased alveolar surface area", "c": "C) Increased partial pressure gradient", "d": "D) Decreased gas solubility",
                "ans": "C", "exp": "According to Fick's law, diffusion is directly proportional to the partial pressure gradient."
            }
        ],
        "case": "A patient with pulmonary fibrosis presents with dyspnea. Arterial blood gas shows PaO2 of 60 mmHg and PaCO2 of 38 mmHg. **Analysis**: Fibrosis increases membrane thickness, limiting oxygen diffusion. CO2 remains normal because of its high diffusion coefficient.",
        "flashcards": [
            {"f": "What is the normal thickness of the respiratory membrane?", "b": "Less than 0.6 micrometers (typically 0.2 to 0.5 µm)."},
            {"f": "What is a pulmonary shunt?", "b": "Perfusion of alveoli that are not ventilated (V/Q = 0), preventing blood oxygenation."}
        ]
    },
    "gas-transport": {
        "title": "O2 and CO2 Transport",
        "analogy": "Oxygen transport is like a fleet of school buses: Hemoglobin molecules are the buses, and the seats are the iron binding sites. Normally, 97% of the seats are occupied (oxygen saturation), but in acidic or hot tissues, the bus doors open wider, letting passengers off more easily.",
        "concept": "Oxygen is transported bound to hemoglobin (98.5%) and dissolved in plasma (1.5%). Carbon dioxide is transported as bicarbonate (70%), carbaminohemoglobin (23%), and dissolved (7%).",
        "anatomy": "Erythrocytes containing Hemoglobin (four polypeptide chains, each with an iron-containing heme group), and carbonic anhydrase enzymes inside RBCs.",
        "physiology": "The Oxygen-Hemoglobin dissociation curve is sigmoidal due to cooperative binding. P50 is the partial pressure at which hemoglobin is 50% saturated (normally 27 mmHg).",
        "mechanism": "Oxygen Unloading (Bohr Effect): In active tissues, high pCO2, acidity (low pH), high temperature, and 2,3-BPG bind to hemoglobin, shifting the curve to the right, decreasing O2 affinity and promoting oxygen unloading.",
        "flowchart": """graph TD
    A[CO2 enters RBC from tissues] -->|Carbonic Anhydrase converts| B[H2O + CO2 -> H2CO3 -> H+ + HCO3-]
    B -->|HCO3- leaves RBC in exchange for Cl-| C[Chloride Shift - Hamburger Phenomenon]
    B -->|H+ binds Hb causing| D[Bohr Effect - Right Shift]
    D -->|Promotes| E[Oxygen Unloading to Tissues]
    E -->|Deoxygenated Hb binds more CO2| F[Haldane Effect]""",
        "correlation": "Carbon monoxide (CO) has 200 times higher affinity for hemoglobin than oxygen, shifting the curve to the left and preventing oxygen release to tissues.",
        "disorders": "1. Carbon Monoxide Poisoning: Tissue hypoxia with normal PaO2. 2. Methemoglobinemia: Iron in heme is oxidized to ferric state ($Fe^{3+}$), which cannot bind oxygen.",
        "formula": "[\\text{O}_2] = (1.34 \\times \\text{Hb} \\times S_a\\text{O}_2) + (0.003 \\times P_a\\text{O}_2)",
        "mnemonics": "CADET, face Right! (Factors that shift the curve to the Right: **C**O2, **A**cid/pH, **D**PG/2,3-BPG, **E**xercise, **T**emperature).",
        "viva": [
            "What is the Chloride Shift? **Answer**: The exchange of bicarbonate ($HCO_3^-$) leaving the RBC for chloride ($Cl^-$) entering the RBC, maintaining electrical neutrality.",
            "Explain the Haldane Effect. **Answer**: Deoxygenation of hemoglobin increases its ability to carry carbon dioxide, assisting CO2 loading in tissues."
        ],
        "mcqs": [
            {
                "q": "Which of the following shifts the oxygen-hemoglobin dissociation curve to the right?",
                "a": "A) Increased pH", "b": "B) Decreased pCO2", "c": "C) Increased temperature", "d": "D) Decreased 2,3-BPG",
                "ans": "C", "exp": "Increased temperature, acidity (low pH), high CO2, and high 2,3-BPG decrease Hb-O2 affinity, shifting the curve to the right."
            }
        ],
        "case": "A house fire survivor presents with headache and confusion. Pulse oximetry reads 98% but arterial oxygen content is low. **Analysis**: Carbon monoxide poisoning. CO binds hemoglobin with high affinity, preventing oxygen transport. Pulse oximeters cannot distinguish carboxyhemoglobin from oxyhemoglobin.",
        "flashcards": [
            {"f": "How much oxygen can 1 gram of hemoglobin carry when fully saturated?", "b": "1.34 mL of oxygen."},
            {"f": "What is the primary form in which CO2 is transported in the blood?", "b": "As bicarbonate ions ($HCO_3^-$) in the plasma."}
        ]
    },
    "breathing-regulation": {
        "title": "Regulation of Breathing",
        "analogy": "Breathing regulation is like an automated cruise control on a car: sensors check the fuel/exhaust ratio (chemoreceptors monitoring CO2 and pH), and send signals to the accelerator (medullary respiratory centers) to speed up or slow down the engine (diaphragm).",
        "concept": "Breathing is controlled by brainstem respiratory networks to maintain arterial blood gas ($PaCO_2, PaO_2, pH$) values within strict normal ranges.",
        "anatomy": "Medullary respiratory groups (DRG, VRG), Pontine centers (Pneumotaxic, Apneustic), Central chemoreceptors (medulla), and Peripheral chemoreceptors (carotid and aortic bodies).",
        "physiology": "Normal respiratory rate is 12-16 breaths/min. Carbon dioxide ($PaCO_2$) is the primary chemical driver of ventilation under normal conditions. Hypoxia ($PaO_2 < 60$ mmHg) stimulates breathing via peripheral chemoreceptors.",
        "mechanism": "Chemoreceptor Loop: 1. Elevated arterial $PaCO_2$ diffuses across the Blood-Brain Barrier into the CSF, 2. Hydrates to form $H^+$ ions, lowering CSF pH, 3. Central chemoreceptors detect $H^+$ and stimulate the Dorsal Respiratory Group, 4. Phrenic nerve triggers hyperventilation to blow off $CO_2$.",
        "flowchart": """graph TD
    A[Arterial PaCO2 rises] -->|CO2 diffuses across| B[Blood-Brain Barrier]
    B -->|Hydrates in CSF| C[CO2 + H2O -> H2CO3 -> H+ + HCO3-]
    C -->|H+ activates| D[Medullary Central Chemoreceptors]
    D -->|Stimulates| E[Dorsal Respiratory Group - DRG]
    E -->|Fires down phrenic nerve to| F[Diaphragm Contraction]
    F -->|Causes| G[Hyperventilation - blows off CO2]""",
        "correlation": "Patients with chronic COPD retain $CO_2$, desensitizing their central chemoreceptors. Their drive to breathe shifts to oxygen levels (hypoxic drive). Giving them high-flow oxygen can suppress this drive, causing respiratory arrest.",
        "disorders": "1. Sleep Apnea: Temporary cessation of breathing during sleep due to airway obstruction or loss of central respiratory drive. 2. Cheyne-Stokes Respiration: Crescendo-decrescendo breathing pattern separated by apnea.",
        "formula": "\\text{PaCO2} \\propto \\frac{\\text{CO2 Production (VCO2)}}{\\text{Alveolar Ventilation (VA)}}",
        "mnemonics": "Central is CO2, Peripheral is pH and Pressure (Central chemoreceptors respond to $CO_2$/$H^+$ in CSF; Peripheral respond to $pO_2 < 60$ mmHg, $pCO_2$, and arterial pH).",
        "viva": [
            "Why do central chemoreceptors not respond directly to arterial hydrogen ions ($H^+$)? **Answer**: Hydrogen ions are charged and cannot cross the Blood-Brain Barrier, whereas $CO_2$ diffuses easily and forms $H^+$ locally in the CSF.",
            "What is the function of the Hering-Breuer Inflation Reflex? **Answer**: Stretch receptors in the bronchioles inhibit the DRG to prevent lung over-inflation."
        ],
        "mcqs": [
            {
                "q": "The primary chemical stimulus for central chemoreceptors is a change in:",
                "a": "A) Arterial pO2", "b": "B) Arterial pH", "c": "C) CSF hydrogen ion concentration", "d": "D) Venous pCO2",
                "ans": "C", "exp": "Arterial $CO_2$ crosses the BBB and generates $H^+$ ions in the CSF, which directly stimulate central chemoreceptors."
            }
        ],
        "case": "A patient with severe emphysema and chronic hypercapnia is admitted. They are given 100% oxygen via a non-rebreather mask and stop breathing. **Analysis**: The high oxygen removed their hypoxic drive, which was their only remaining respiratory stimulus due to chronic central chemoreceptor desensitization.",
        "flashcards": [
            {"f": "Which nerve carries signals from the carotid body chemoreceptors?", "b": "The glossopharyngeal nerve (CN IX)."},
            {"f": "What is the role of the pneumotaxic center in the pons?", "b": "It limits inspiration, regulating tidal volume and respiratory rate."}
        ]
    },
    "high-altitude": {
        "title": "High Altitude Physiology",
        "analogy": "High altitude is like playing a game with fewer balls: the air still has 21% oxygen, but the atmospheric pressure is low, meaning the molecules are spread thin. Your body must recruit more catchers (erythropoietin making RBCs) and speed up the conveyor belt (ventilation) to catch the same amount of oxygen.",
        "concept": "Hypobaric hypoxia at high altitude triggers acute compensatory reflexes followed by chronic acclimatization mechanisms to restore tissue oxygen delivery.",
        "anatomy": "Peripheral chemoreceptors, pulmonary vascular smooth muscle, renal cells producing erythropoietin, and systemic capillaries.",
        "physiology": "At sea level, $P_{B} = 760$ mmHg ($P_I O_2 = 149$ mmHg). At 5,500m, $P_{B} = 380$ mmHg ($P_I O_2 = 70$ mmHg). Hypoxia triggers hyperventilation, causing respiratory alkalosis. Over days, kidneys excrete $HCO_3^-$ to normalize pH.",
        "mechanism": "Acclimatization Pathway: 1. Low PaO2 activates peripheral chemoreceptors, increasing ventilation, 2. Respiratory alkalosis occurs due to CO2 washout, 3. Kidneys excrete bicarbonate to compensate, 4. Renal hypoxia stabilizes HIF-1α, stimulating Erythropoietin (EPO) synthesis, 5. Bone marrow increases RBC production (polycythemia).",
        "flowchart": """graph TD
    A[Hypobaric Hypoxia] -->|Stimulates| B[Peripheral Chemoreceptors]
    B -->|Increases| C[Alveolar Ventilation]
    C -->|Causes CO2 washout| D[Respiratory Alkalosis]
    D -->|Compensated by| E[Renal Excretion of Bicarbonate]
    A -->|Renal Hypoxia stabilizes| F[HIF-1 alpha]
    F -->|Triggers release of| G[Erythropoietin - EPO]
    G -->|Stimulates bone marrow| H[Erythroid Hyperplasia & Polycythemia]""",
        "correlation": "Hypoxic Pulmonary Vasoconstriction (HPV) at high altitude causes generalized pulmonary arteriole constriction, leading to pulmonary hypertension and potentially High Altitude Pulmonary Edema (HAPE).",
        "disorders": "1. Acute Mountain Sickness (AMS): Headache, nausea, dizziness due to hypoxia and cerebral vasodilation. 2. High Altitude Pulmonary Edema (HAPE): High capillary pressure causes fluid leakage into alveoli.",
        "formula": "P_B(h) = 760 \\times e^{-0.00012 \\cdot h} \\quad (\\text{where } h \\text{ is altitude in meters})",
        "mnemonics": "EPO rises to the peak (Erythropoietin stimulates RBC production to compensate for low oxygen at high altitude).",
        "viva": [
            "How does the kidney compensate for respiratory alkalosis at high altitude? **Answer**: By downregulating carbonic anhydrase and secreting bicarbonate ($HCO_3^-$) in the urine, returning blood pH toward 7.40.",
            "What is the role of 2,3-BPG during altitude acclimatization? **Answer**: It increases within RBCs, shifting the Hb-O2 curve to the right to facilitate oxygen unloading in tissues."
        ],
        "mcqs": [
            {
                "q": "Which of the following is the initial physiological response to high altitude?",
                "a": "A) Decreased heart rate", "b": "B) Increased alveolar ventilation", "c": "C) Decreased renal bicarbonate excretion", "d": "D) Decreased hematocrit",
                "ans": "B", "exp": "Low PaO2 immediately triggers peripheral chemoreceptors to increase alveolar ventilation."
            }
        ],
        "case": "A climber ascends rapidly to 4,000m and develops severe dyspnea, a cough with pink frothy sputum, and cyanosis. **Analysis**: This is High Altitude Pulmonary Edema (HAPE) caused by hypoxic pulmonary vasoconstriction raising capillary hydrostatic pressure, forcing fluid into the alveoli.",
        "flashcards": [
            {"f": "What hormone stimulates red blood cell production at high altitude?", "b": "Erythropoietin (EPO), released by renal interstitial cells."},
            {"f": "What happens to blood pH during acute high altitude exposure?", "b": "It rises (alkalosis) due to hyperventilation blowing off carbon dioxide."}
        ]
    },
    "pft": {
        "title": "Pulmonary Function Tests",
        "analogy": "PFTs are like inspecting a house's ventilation system: spirometry checks how fast and how much air can blow out of the vents (distinguishing a clog/asthma from a shrunk room/fibrosis), while diffusion capacity checks how well air leaks through the duct filters into the rooms.",
        "concept": "PFTs assess lung volumes, capacities, and flow rates to differentiate obstructive and restrictive lung diseases.",
        "anatomy": "Conducting airways, alveolar space, chest wall, and respiratory muscles.",
        "physiology": "Normal values: Tidal Volume (TV) = 500 mL, Vital Capacity (VC) = 4.6 L, Residual Volume (RV) = 1.2 L. FEV1/FVC ratio is normally 75-80%. Obstructive: decreased FEV1/FVC (<70%). Restrictive: normal/increased FEV1/FVC, but decreased total lung capacity (TLC).",
        "mechanism": "Forced Expiraton Mechanics: In obstructive disease (asthma, COPD), airway resistance is high, slowing flow and flattening the expiratory curve. In restrictive disease (fibrosis, scoliosis), lung expansion is limited, lowering total capacity but maintaining normal expiratory flow rates.",
        "flowchart": """graph TD
    A[Perform Spirometry] -->|Measure| B[FEV1 / FVC Ratio]
    B -->|If Ratio < 70%| C[Obstructive Lung Disease: Asthma, COPD]
    B -->|If Ratio >= 70% & FVC is low| D[Suspect Restrictive Lung Disease]
    D -->|Confirm via Plethysmography| E[TLC < 80% predicted confirms Restrictive]
    C -->|Give bronchodilator| F[If FEV1 increases >12%, reversible obstruction]""",
        "correlation": "A bronchodilator reversibility test (FEV1 increases >12% or 200mL after Albuterol) is the hallmark diagnostic indicator for Asthma, separating it from irreversible COPD.",
        "disorders": "1. Chronic Obstructive Pulmonary Disease (COPD): Fixed airway obstruction. 2. Idiopathic Pulmonary Fibrosis: Restrictive lung disease with decreased lung compliance.",
        "formula": "\\text{Total Lung Capacity (TLC)} = \\text{Vital Capacity (VC)} + \\text{Residual Volume (RV)}",
        "mnemonics": "Obstructive Out, Restrictive In (Obstructive has trouble getting air OUT; Restrictive has trouble getting air IN).",
        "viva": [
            "What is Residual Volume and how is it measured? **Answer**: The volume of air remaining in the lungs after maximal expiration. It cannot be measured by simple spirometry; it requires helium dilution or body plethysmography.",
            "Explain the difference between a capacity and a volume. **Answer**: A capacity is the sum of two or more lung volumes (e.g., Functional Residual Capacity = Expiratory Reserve Volume + Residual Volume)."
        ],
        "mcqs": [
            {
                "q": "A patient has an FEV1/FVC ratio of 55%. This is indicative of:",
                "a": "A) Restrictive lung disease", "b": "B) Obstructive lung disease", "c": "C) Normal lung function", "d": "D) Respiratory muscle weakness",
                "ans": "B", "exp": "An FEV1/FVC ratio less than 70% defines an obstructive ventilatory defect."
            }
        ],
        "case": "A patient with dyspnea has an FVC of 60% predicted, an FEV1 of 62% predicted, and an FEV1/FVC ratio of 82%. **Analysis**: The normal FEV1/FVC ratio rules out obstruction. The low FVC suggests a restrictive pattern, which should be confirmed by measuring Total Lung Capacity (TLC < 80% confirms restriction).",
        "flashcards": [
            {"f": "What is the normal FEV1/FVC ratio in healthy adults?", "b": "Approximately 75% to 80% (or above 70%)."},
            {"f": "Which lung volume cannot be measured by spirometry?", "b": "Residual Volume (RV)."}
        ]
    },
    "tubular-reabsorption": {
        "title": "Tubular Reabsorption",
        "analogy": "Tubular reabsorption is like sorting through a trash bin: the glomerulus dumps almost everything into the nephron bin, and the renal tubules must quickly grab all the valuables (glucose, water, sodium) and put them back in the house (bloodstream) before the waste reaches the exit.",
        "concept": "Tubular reabsorption retrieves water and solutes from the glomerular filtrate. The Proximal Convoluted Tubule (PCT) is the workhorse, reabsorbing 65% of all water, sodium, potassium, and 100% of glucose and amino acids.",
        "anatomy": "Nephron segments: Proximal Tubule, Loop of Henle, Distal Tubule, and Collecting Duct. Principal and Intercalated cells.",
        "physiology": "Normal renal glucose threshold is ~180 mg/dL. If blood glucose exceeds this, the SGLT transporters saturate, and glucose appears in the urine (glucosuria).",
        "mechanism": "Basolateral $Na^+/K^+$ ATPase pumps $Na^+$ out of the tubule cell into the interstitium, creating a low intracellular $Na^+$ concentration and negative charge. This electrochemical gradient drives secondary active transport of glucose (SGLT2) and amino acids across the apical membrane.",
        "flowchart": """graph TD
    A[Basolateral Na+/K+ ATPase] -->|Pumps Na+ out| B[Low intracellular Na+]
    B -->|Drives apical| C[Na+/Glucose Symporter - SGLT2]
    C -->|Reabsorbs| D[100% of filtered Glucose in PCT]
    E[Descending Loop of Henle] -->|Passively reabsorbs| F[Water only]
    G[Thick Ascending Loop of Henle] -->|NKCC2 Symporter reabsorbs| H[Na+, K+, 2Cl- - site of loop diuretics]""",
        "correlation": "SGLT2 inhibitors (e.g. Empagliflozin) block glucose reabsorption in the PCT, lowering blood glucose in type 2 diabetes by promoting urinary glucose excretion.",
        "disorders": "1. Renal Glucosuria: Normal blood glucose but glucose in urine due to mutated SGLT2. 2. Fanconi Syndrome: Generalized dysfunction of the PCT, leading to loss of glucose, amino acids, phosphate, and bicarbonate.",
        "formula": "\\text{Filtered Load} = \\text{GFR} \\times \\text{Plasma Concentration}",
        "mnemonics": "PCT is the primary packer (The PCT reabsorbs the bulk of all solutes: 65% of sodium and water, and 100% of glucose and amino acids).",
        "viva": [
            "What is the transport maximum ($T_m$) for glucose? **Answer**: The maximum rate at which glucose can be reabsorbed when all SGLT transporters are saturated, typically 375 mg/min in men.",
            "Where do loop diuretics act? **Answer**: In the thick ascending limb of the loop of Henle, by blocking the $Na^+-K^+-2Cl^-$ (NKCC2) co-transporter."
        ],
        "mcqs": [
            {
                "q": "The majority of filtered water and sodium is reabsorbed in the:",
                "a": "A) Loop of Henle", "b": "B) Distal convoluted tubule", "c": "C) Proximal convoluted tubule", "d": "D) Collecting duct",
                "ans": "C", "exp": "The PCT reabsorbs approximately 65% of filtered water, sodium, chloride, potassium, and bicarbonate."
            }
        ],
        "case": "A patient with diabetes has a blood glucose of 280 mg/dL and presents with frequent urination (polyuria). **Analysis**: High blood glucose exceeds the renal threshold (180 mg/dL), saturating SGLT2 transporters. Unreabsorbed glucose acts as an osmotic diuretic in the tubule lumen, dragging water with it.",
        "flashcards": [
            {"f": "Where is the sodium-glucose cotransporter 2 (SGLT2) located?", "b": "In the early segments of the proximal convoluted tubule (PCT)."},
            {"f": "What hormone regulates water permeability in the collecting duct?", "b": "Antidiuretic Hormone (ADH), which inserts aquaporin-2 channels."}
        ]
    },
    "countercurrent": {
        "title": "Countercurrent Mechanism",
        "analogy": "The countercurrent mechanism is like a heat exchanger in an industrial plant: by running the fluid down one pipe (descending limb) and up an adjacent pipe (ascending limb) while actively pumping salt out of the ascending side, the kidney traps a massive concentration of salt in the deep tissue, creating a suction force that pulls water out of the collecting duct.",
        "concept": "The countercurrent mechanism (countercurrent multiplier in the loop of Henle and exchanger in the vasa recta) creates a hyperosmotic medullary interstitium, allowing the body to excrete concentrated urine.",
        "anatomy": "Loop of Henle (descending and ascending limbs), Vasa Recta (medullary capillaries), and the Medullary Collecting Duct.",
        "physiology": "The medullary osmolarity increases from 300 mOsm/L (cortex) to 1200 mOsm/L (deep medulla). The descending loop is highly permeable to water but impermeable to solutes; the ascending loop is impermeable to water but actively pumps NaCl.",
        "mechanism": "Countercurrent Multiplier: 1. Active transport of NaCl out of the thick ascending limb via NKCC2 co-transporter increases medullary interstitial osmolarity, 2. This osmotic gradient draws water out of the descending limb, concentrating tubular fluid, 3. The highly concentrated fluid flows into the ascending limb, fueling more NaCl transport.",
        "flowchart": """graph TD
    A[Thick Ascending Limb pumps NaCl out] -->|Raises| B[Medullary Interstitial Osmolarity]
    B -->|Draws water out of| C[Water-Permeable Descending Limb]
    C -->|Concentrates| D[Tubular Fluid flowing to loop tip]
    D -->|Delivers highly concentrated NaCl to| A
    E[ADH inserts Aquaporins in Collecting Duct] -->|Allows water to be drawn out by| B
    F[Urine is Concentrated]""",
        "correlation": "Loop diuretics (e.g. Furosemide) block the NKCC2 co-transporter in the ascending loop, disrupting the medullary concentration gradient and causing massive water excretion.",
        "disorders": "1. Central Diabetes Insipidus: Lack of ADH release, preventing water reabsorption and causing large volumes of dilute urine. 2. Nephrogenic Diabetes Insipidus: Renal resistance to ADH.",
        "formula": "\\text{Urine Osmolarity} = \\frac{\\text{Osmolar Excretion}}{\\text{Urine Volume}}",
        "mnemonics": "Descending Drips Water, Ascending Active Salt (Descending loop is water permeable; Ascending loop actively pumps NaCl).",
        "viva": [
            "What is the role of urea in the countercurrent mechanism? **Answer**: Urea recycling from the collecting ducts contributes about 40-50% of the hyperosmotic medullary gradient.",
            "How do the vasa recta preserve the medullary gradient? **Answer**: By serving as countercurrent exchangers; their U-shaped slow blood flow allows passive solute and water equilibration without washing out the gradient."
        ],
        "mcqs": [
            {
                "q": "Which segment of the nephron is impermeable to water under all conditions?",
                "a": "A) Descending limb of loop of Henle", "b": "B) Ascending limb of loop of Henle", "c": "C) Collecting duct", "d": "D) Proximal convoluted tubule",
                "ans": "B", "exp": "The ascending limb of the loop of Henle is impermeable to water, allowing dilute fluid to form as solutes are pumped out."
            }
        ],
        "case": "A patient with a head injury produces 8 liters of dilute urine daily. Injecting desmopressin (ADH analog) reduces urine output and raises urine concentration. **Analysis**: Central Diabetes Insipidus. The lack of ADH prevented aquaporin insertion, leaving the collecting duct impermeable to the medullary concentration gradient.",
        "flashcards": [
            {"f": "What is the maximum osmolarity of the human renal medulla?", "b": "Approximately 1200 to 1400 mOsm/L."},
            {"f": "What capillaries run parallel to the loops of Henle to prevent washout?", "b": "The vasa recta."}
        ]
    },
    "acid-base": {
        "title": "Acid-Base Balance",
        "analogy": "Acid-base balance is like a high-wire balancing act: the body produces acidic waste constantly, and relies on a chemical net (Bicarbonate buffer), rapid breathing adjustments to vent gas (respiratory compensation), and renal secretion to dump acid in the urine (renal compensation) to stay on the wire.",
        "concept": "The body maintains arterial pH between 7.35 and 7.45. Extracellular pH is governed by the bicarbonate-carbonic acid buffer system, regulated by the lungs ($CO_2$) and kidneys ($HCO_3^-$).",
        "anatomy": "Erythrocytes (carbonic anhydrase), medullary respiratory centers (ventilation control), and renal intercalated cells (acid excretion/bicarbonate reabsorption).",
        "physiology": "Normal ranges: pH = 7.35-7.45, PaCO2 = 35-45 mmHg, HCO3- = 22-26 mEq/L. Metabolic disorders originate from changes in $HCO_3^-$; respiratory disorders originate from changes in $PaCO_2$.",
        "mechanism": "Renal Compensation for Acidosis: In Type A intercalated cells, a basolateral $HCO_3^-/Cl^-$ exchanger and apical $H^+$ ATPase pump $H^+$ into the lumen (excreted via phosphate/ammonium buffers) while returning new $HCO_3^-$ to the blood.",
        "flowchart": """graph TD
    A[Arterial pH drops < 7.35] -->|Acidosis detected by| B[Chemoreceptors]
    B -->|Triggers immediate| C[Respiratory Hyperventilation - blows off CO2]
    C -->|Limits pH drop but requires| D[Renal Compensation over 3-5 days]
    D -->|Renal Intercalated Cells| E[Secrete H+ via H+ ATPase into lumen]
    E -->|Synthesize & reabsorb| F[New HCO3- into bloodstream]
    F -->|Returns pH toward| G[Normal Range]""",
        "correlation": "The Serum Anion Gap distinguishes causes of metabolic acidosis. High anion gap (>12) indicates acid addition (diabetic ketoacidosis, lactic acidosis). Normal anion gap indicates bicarbonate loss (diarrhea).",
        "disorders": "1. Diabetic Ketoacidosis: High anion gap metabolic acidosis. 2. Respiratory Acidosis: Hypoventilation (COPD) causing $CO_2$ retention. 3. Metabolic Alkalosis: Vomiting causing loss of gastric $HCl$.",
        "formula": "pH = 6.1 + \\log \\left( \\frac{[HCO_3^-]}{0.03 \\times PaCO_2} \\right), \\quad \\text{Anion Gap} = [Na^+] - ([Cl^-] + [HCO_3^-])",
        "mnemonics": "ROME (Acid-base mnemonic: **R**espiratory **O**pposite [pH up, pCO2 down = alkalosis], **M**etabolic **E**qual [pH up, HCO3 up = alkalosis]).",
        "viva": [
            "State Winter's Formula and its clinical use. **Answer**: Expected $PaCO_2 = (1.5 \\times [HCO_3^-]) + 8 \\pm 2$. It evaluates if there is adequate respiratory compensation for metabolic acidosis.",
            "What is the difference between Type A and Type B intercalated cells? **Answer**: Type A cells secrete $H^+$ and reabsorb $HCO_3^-$ (active during acidosis). Type B cells secrete $HCO_3^-$ and reabsorb $H^+$ (active during alkalosis)."
        ],
        "mcqs": [
            {
                "q": "A patient has pH 7.20, PaCO2 60 mmHg, and HCO3- 28 mEq/L. This represents:",
                "a": "A) Metabolic acidosis", "b": "B) Respiratory acidosis", "c": "C) Metabolic alkalosis", "d": "D) Respiratory alkalosis",
                "ans": "B", "exp": "Low pH (<7.35) indicates acidosis. Elevated PaCO2 (>45 mmHg) indicates a respiratory origin."
            }
        ],
        "case": "A patient with type 1 diabetes presents with deep, rapid breathing (Kussmaul breathing). ABG: pH 7.15, HCO3- 10 mEq/L, PaCO2 23 mmHg. Serum Na+ 140, Cl- 105. **Analysis**: High Anion Gap Metabolic Acidosis (AG = 140 - (105 + 10) = 25). The Kussmaul breathing is the respiratory compensation to blow off $CO_2$.",
        "flashcards": [
            {"f": "What is the normal serum anion gap range?", "b": "8 to 12 mEq/L."},
            {"f": "Which organ compensates rapidly for metabolic acid-base disturbances?", "b": "The lungs (via changes in ventilation rate, acting in minutes)."}
        ]
    },
    "micturition": {
        "title": "Micturition Reflex",
        "analogy": "The bladder is like a balloon with a dual-lock valve: parasympathetic nerves are the hands that squeeze the balloon to push water out, while sympathetic nerves keep the balloon relaxed and the main valve locked shut. Voluntary control acts as the final lock (external sphincter) that you choose when to release.",
        "concept": "Micturition is a spinal reflex facilitated or inhibited by higher brain centers (pontine micturition center and cerebral cortex).",
        "anatomy": "Detrusor muscle (bladder wall smooth muscle), Internal Urethral Sphincter (smooth muscle), and External Urethral Sphincter (skeletal muscle). Pelvic, Hypogastric, and Pudendal nerves.",
        "physiology": "Bladder filling (sympathetic dominance): relaxes detrusor ($Beta_3$ receptors) and contracts internal sphincter ($Alpha_1$). Bladder voiding (parasympathetic dominance): contracts detrusor ($M_3$ receptors) and relaxes internal sphincter. External sphincter is under voluntary control (pudendal nerve).",
        "mechanism": "Micturition Reflex: 1. Bladder volume reaches 150-200 mL, activating stretch receptors, 2. Sensory signals travel via pelvic nerves to sacral spinal cord (S2-S4), 3. Parasympathetic efferents fire, causing detrusor contraction and internal sphincter relaxation, 4. Higher cortical centers override voluntary pudendal motor firing to relax external sphincter.",
        "flowchart": """graph TD
    A[Bladder fills to 150-200 mL] -->|Activates| B[Bladder Wall Stretch Receptors]
    B -->|Sensory signals via pelvic nerve to| C[Sacral Spinal Cord S2-S4]
    C -->|Ascends to| D[Pontine Micturition Center]
    D -->|If micturition is convenient| E[Inhibits Sympathetic & Pudendal firing]
    D -->|Stimulates| F[Parasympathetic Pelvic Nerves]
    F -->|Contracts| G[Detrusor Muscle]
    F -->|Relaxes| H[Internal Sphincter]
    E -->|Relaxes| I[External Sphincter voluntarily]
    G & H & I -->|Result| J[Urine Voiding]""",
        "correlation": "Spinal cord injury above the sacral level blocks descending cortical control, initially causing urinary retention (spinal shock) followed by an automatic, uninhibited neurogenic bladder.",
        "disorders": "1. Stress Incontinence: Leakage of urine during coughing/sneezing due to weak pelvic floor muscles. 2. Overflow Incontinence: Dribbling due to chronically overdistended bladder (prostate hypertrophy).",
        "formula": "\\text{Bladder Compliance} = \\frac{\\Delta \\text{Volume}}{\\Delta \\text{Pressure}}",
        "mnemonics": "Point and Shoot (Parasympathetic handles erection/urination voiding; Sympathetic handles ejaculation/urination storage).",
        "viva": [
            "Name the three nerves supplying the urinary bladder and their functions. **Answer**: 1. Pelvic nerve (parasympathetic, voiding), 2. Hypogastric nerve (sympathetic, filling/storage), 3. Pudendal nerve (somatic, voluntary external sphincter control).",
            "What is cystometry? **Answer**: A diagnostic procedure measuring the relationship between bladder volume and pressure during filling."
        ],
        "mcqs": [
            {
                "q": "Contraction of the bladder detrusor muscle is mediated by:",
                "a": "A) Sympathetic beta-receptors", "b": "B) Parasympathetic muscarinic receptors", "c": "C) Somatic motor receptors", "d": "D) Sympathetic alpha-receptors",
                "ans": "B", "exp": "Parasympathetic pelvic nerves release Acetylcholine, binding to $M_3$ muscarinic receptors to contract the detrusor muscle."
            }
        ],
        "case": "A patient with benign prostatic hyperplasia presents with severe lower abdominal pain and inability to void urine. Cystometry shows a distended bladder with elevated pressure. **Analysis**: Acute urinary retention. The mechanical obstruction by the enlarged prostate increases outlet resistance, preventing micturition.",
        "flashcards": [
            {"f": "Which nerve provides voluntary control over the external urethral sphincter?", "b": "The pudendal nerve (S2-S4)."},
            {"f": "What is the primary muscle of the bladder wall?", "b": "The detrusor muscle."}
        ]
    },
    "gi-secretions": {
        "title": "GI Secretions",
        "analogy": "GI secretions are like specialized cleaning and chemical agents in a factory: saliva is the pre-rinse, gastric acid is a corrosive solvent breaking down bulk materials, and pancreatic juices are the neutralizing agents (bicarbonate) and machinery tools (digestive enzymes) completing the processing.",
        "concept": "GI secretions break down food, regulate pH, and protect the mucosa. Main secretions include Saliva, Gastric acid, Pancreatic juice, Bile, and Intestinal mucus.",
        "anatomy": "Salivary glands (parotid, submandibular, sublingual), gastric glands (parietal, chief, mucous neck cells), exocrine pancreas (acinar and ductal cells), and hepatocytes.",
        "physiology": "Daily secretions total ~7-8 Liters. Gastric acid (pH ~0.8) converts pepsinogen to active pepsin. Pancreatic secretions are alkaline (rich in $HCO_3^-$) to neutralize acidic chyme entering the duodenum.",
        "mechanism": "Gastric Acid Secretion: Parietal cells use $H^+/K^+$ ATPase (proton pump) to secrete $H^+$ into the lumen. Carbonic anhydrase generates $H^+$ and $HCO_3^-$. $HCO_3^-$ is transported basolaterally (alkaline tide) in exchange for $Cl^-$, which diffuses apically.",
        "flowchart": """graph TD
    A[Gastrin, ACh, Histamine bind] -->|Parietal Cell Activation| B[Active H+/K+ ATPase Proton Pump]
    B -->|Pumps H+ into| C[Gastric Lumen]
    D[Intracellular CA activity] -->|Generates| E[H+ & HCO3-]
    E -->|HCO3- enters blood via| F[Basolateral Cl-/HCO3- Exchanger]
    F -->|Causes post-prandial| G[Alkaline Tide in Blood]
    F -->|Cl- enters cell & diffuses into| C
    C -->|Combination forms| H[HCl Secretion]""",
        "correlation": "Proton Pump Inhibitors (PPIs, e.g. Omeprazole) covalently bind and inhibit the $H^+/K^+$ ATPase in parietal cells, effectively treating gastroesophageal reflux disease (GERD) and peptic ulcers.",
        "disorders": "1. Peptic Ulcer Disease: Erosion of gastric or duodenal mucosa due to helicobacter pylori or NSAID-induced loss of bicarbonate-mucus barrier. 2. Zollinger-Ellison Syndrome: Gastrin-secreting tumor causing severe hyperacidity.",
        "formula": "\\text{Gastric Acid Output} = \\text{Flow Rate} \\times [\\text{H}^+]",
        "mnemonics": "PEP acts on PEP (Pepsinogen is secreted by Chief cells and digests Proteins).",
        "viva": [
            "Which three chemical substances stimulate gastric acid secretion? **Answer**: Gastrin (endocrine), Histamine (paracrine), and Acetylcholine (neurocrine).",
            "What is the function of the Intrinsic Factor secreted by parietal cells? **Answer**: It binds Vitamin B12 in the duodenum, enabling its absorption in the terminal ileum."
        ],
        "mcqs": [
            {
                "q": "Which cell type in the stomach secretes pepsinogen?",
                "a": "A) Parietal cells", "b": "B) G cells", "c": "C) Chief cells", "d": "D) Mucous neck cells",
                "ans": "C", "exp": "Chief cells synthesize and secrete pepsinogen, the inactive precursor of pepsin."
            }
        ],
        "case": "A patient with joint pain taking high-dose Ibuprofen develops burning epigastric pain. Endoscopy reveals a gastric ulcer. **Analysis**: NSAIDs inhibit COX-1, depleting prostaglandins ($PGE_2$) that normally inhibit gastric acid secretion and stimulate protective bicarbonate and mucus production.",
        "flashcards": [
            {"f": "What is the pH of pancreatic secretions?", "b": "Highly alkaline, typically 8.0 to 8.3 (rich in bicarbonate)."},
            {"f": "Which hormone stimulates gallbladder contraction and pancreatic enzyme secretion?", "b": "Cholecystokinin (CCK)."}
        ]
    },
    "digestion-absorption": {
        "title": "Digestion & Absorption",
        "analogy": "Digestion and absorption are like recycling a brick house: the brick mortar is broken down by hammers (digestive enzymes) into individual bricks (monomers), which are then loaded onto conveyor belts (transporters like SGLT1) to enter the recycling trucks (bloodstream) for reuse.",
        "concept": "Digestion is the chemical breakdown of food into absorbable monomers. Absorption is the transport of these monomers across the intestinal mucosal epithelium into the blood or lymph.",
        "anatomy": "Enterocyte brush border membrane (microvilli maximizing surface area), lacteals (lymphatic transport of fats), and portal vein (carrying water-soluble nutrients to the liver).",
        "physiology": "Carbohydrates are digested to monosaccharides (glucose, galactose, fructose). Proteins are digested to amino acids and di/tripeptides. Lipids are emulsified by bile salts into micelles to release free fatty acids.",
        "mechanism": "Absorption of Glucose: Co-transported with $Na^+$ across the apical membrane via SGLT-1 (secondary active transport). It exits the basolateral membrane via GLUT-2 (facilitated diffusion). Fructose is absorbed apically via GLUT-5.",
        "flowchart": """graph TD
    A[Starch digested by amylase to] -->|Maltose, Oligosaccharides| B[Brush Border Disaccharidases]
    B -->|Cleaved to| C[Glucose, Galactose, Fructose]
    C -->|Glucose/Galactose enter enterocyte via| D[Apical SGLT-1 Symporter with Na+]
    C -->|Fructose enters via| E[Apical GLUT-5 Transporter]
    D & E -->|Solutes exit basolaterally via| F[GLUT-2 Facilitated Diffusion]
    F -->|Enter| G[Portal Blood Circulation]""",
        "correlation": "Lactose Intolerance is caused by a deficiency of the brush-border enzyme lactase. Undigested lactose remains in the lumen, acting as an osmotic agent and fermenting into gas, causing bloating and diarrhea.",
        "disorders": "1. Celiac Disease: Immune-mediated destruction of villi in response to gluten, causing severe malabsorption. 2. Steatorrhea: Excretion of excess fat in feces due to pancreatic lipase deficiency or bile duct obstruction.",
        "formula": "\\text{Absorption Efficiency} = \\frac{\\text{Intake} - \\text{Fecal Output}}{\\text{Intake}} \\times 100",
        "mnemonics": "SGLT needs Salt (SGLT-1 requires the co-transport of sodium ions to drive glucose absorption).",
        "viva": [
            "How are lipids absorbed and transported differently from carbohydrates and proteins? **Answer**: Lipids are packaged into micelles, diffuse into enterocytes, are re-esterified to triglycerides, packaged into chylomicrons, and enter the lymphatic lacteals rather than blood capillaries.",
            "Where does the absorption of Vitamin B12 and bile salts take place? **Answer**: In the terminal ileum."
        ],
        "mcqs": [
            {
                "q": "Which transporter is responsible for the absorption of fructose across the apical membrane of enterocytes?",
                "a": "A) SGLT-1", "b": "B) GLUT-2", "c": "C) GLUT-4", "d": "D) GLUT-5",
                "ans": "D", "exp": "Fructose is absorbed across the apical membrane by GLUT-5 via facilitated diffusion."
            }
        ],
        "case": "A patient experiences abdominal cramps, bloating, and watery diarrhea after drinking milk. **Analysis**: Lactase deficiency. The lack of lactase leaves lactose unhydrolyzed. Unabsorbed lactose creates an osmotic gradient, drawing water into the colon and fermenting into methane and hydrogen gases.",
        "flashcards": [
            {"f": "What co-transport driver does SGLT1 utilize?", "b": "Sodium ions ($Na^+$)."},
            {"f": "In what form are dietary lipids absorbed into the lymphatic system?", "b": "As chylomicrons."}
        ]
    },
    "liver-biliary": {
        "title": "Liver & Biliary System",
        "analogy": "The liver is the body's centralized refinery and recycling plant: it filters all waste (detoxification), packages raw materials (protein synthesis), processes fuel (glycogen storage), and produces a heavy detergent (bile) stored in a reservoir (gallbladder) to break down fatty grease.",
        "concept": "The liver is the largest metabolic organ, responsible for bile synthesis, carbohydrate/lipid metabolism, protein synthesis, and detoxification. Bile is concentrated and stored in the gallbladder.",
        "anatomy": "Hepatic lobule (functional unit), portal triad (hepatic artery, portal vein, bile duct), hepatic sinusoids, Kupffer cells, and bile canaliculi.",
        "physiology": "Normal total bilirubin is <1.2 mg/dL. Bile contains bile salts (cholesterol derivatives), lecithin, bicarbonate, and bilirubin. Enterohepatic circulation recycles 95% of excreted bile salts.",
        "mechanism": "Bilirubin Metabolism: 1. Senescent RBCs broken down in spleen to unconjugated bilirubin (water-insoluble), 2. Bound to albumin in blood and transported to liver, 3. Conjugated by UGT1A1 enzyme with glucuronic acid (water-soluble), 4. Excreted in bile into intestine, 5. Converted by bacteria to urobilinogen.",
        "flowchart": """graph TD
    A[Erythrocyte breakdown in Spleen] -->|Releases| B[Unconjugated Bilirubin - insoluble]
    B -->|Carried by Albumin to| C[Hepatocytes]
    C -->|UGT1A1 enzyme conjugates with| D[Glucuronic Acid]
    D -->|Forms| E[Conjugated Bilirubin - soluble]
    E -->|Excreted into| F[Bile Duct & Intestine]
    F -->|Converted by bacteria to| G[Urobilinogen & Stercobilin]""",
        "correlation": "Jaundice is the yellowing of tissues due to bilirubin buildup (>2-3 mg/dL). Pre-hepatic (hemolysis), hepatic (hepatitis), and post-hepatic (gallstone obstruction) causes present with different conjugation ratios.",
        "disorders": "1. Cholelithiasis: Gallstones in the gallbladder, commonly made of cholesterol. 2. Liver Cirrhosis: Fibrosis replacing healthy parenchyma, causing portal hypertension and ascites.",
        "formula": "\\text{Bilirubin Excretion} = \\text{Conjugated Bilirubin} + \\text{Urobilinogen}",
        "mnemonics": "UGT conjugates (UGT1A1 glucuronosyltransferase conjugates bilirubin in the liver).",
        "viva": [
            "What is the enterohepatic circulation? **Answer**: The recycling loop where bile salts are absorbed in the terminal ileum, return to the liver via the portal vein, and are re-secreted into the bile.",
            "How does post-hepatic (obstructive) jaundice affect stool and urine color? **Answer**: Stools become clay-colored (lack of stercobilin), and urine becomes dark/tea-colored (excess conjugated bilirubin excreted by kidneys)."
        ],
        "mcqs": [
            {
                "q": "Which enzyme conjugates bilirubin in the liver hepatocytes?",
                "a": "A) Heme oxygenase", "b": "B) Biliverdin reductase", "c": "C) UDP-glucuronosyltransferase (UGT)", "d": "D) Alkaline phosphatase",
                "ans": "C", "exp": "UGT conjugates bilirubin with glucuronic acid, converting it into a water-soluble form."
            }
        ],
        "case": "A patient with gallstone obstruction presents with yellow eyes, dark urine, and pale stools. Lab shows elevated conjugated bilirubin and alkaline phosphatase. **Analysis**: Post-hepatic obstructive jaundice. The gallstone blocks bile flow, causing conjugated bilirubin to leak into the blood and be excreted in urine, while failing to reach the gut.",
        "flashcards": [
            {"f": "What is the primary organic constituent of bile?", "b": "Bile salts (cholesterol derivatives)."},
            {"f": "What are Kupffer cells?", "b": "Specialized resident macrophages located in the hepatic sinusoids."}
        ]
    },
    "gi-hormones": {
        "title": "GI Hormones",
        "analogy": "GI hormones are like walkie-talkie signals sent between departments in a restaurant: when food enters the lobby (stomach), Gastrin yells to fire up the stoves (acid secretion); when greasy food enters the kitchen (duodenum), CCK tells the gallbladder to dump soap (bile) and the stomach to slow down deliveries.",
        "concept": "GI hormones are peptide messengers secreted by enteroendocrine cells in response to luminal contents, regulating motility, secretions, and appetite.",
        "anatomy": "Enteroendocrine G cells (gastric antrum), I cells (duodenum/jejunum), S cells (duodenum), and K cells (duodenum/jejunum).",
        "physiology": "1. Gastrin: Stimulates gastric acid and mucosal growth. 2. Cholecystokinin (CCK): Stimulates gallbladder contraction and pancreatic enzyme secretion. 3. Secretin: Stimulates pancreatic bicarbonate secretion. 4. GIP: Stimulates glucose-dependent insulin release.",
        "mechanism": "Secretin Acid Feedback: When acidic chyme (pH < 4.5) enters the duodenum, S cells release Secretin. Secretin acts on pancreatic ductal cells via cAMP to secrete water and $HCO_3^-$, neutralizing the acid and shutting down secretin release.",
        "flowchart": """graph TD
    A[Acidic Chyme enters Duodenum] -->|Stimulates| B[S Cells in Duodenum]
    B -->|Secrete| C[Secretin into Bloodstream]
    C -->|Binds to receptors on| D[Pancreatic Ductal Cells]
    D -->|Stimulates cAMP pathway to secrete| E[Bicarbonate & Water]
    E -->|Enters Duodenum & raises pH| F[Acid Neutralization]
    F -->|Negative Feedback inhibits| B""",
        "correlation": "Gastrin-secreting tumors (Gastrinomas) cause Zollinger-Ellison Syndrome, resulting in severe duodenal ulcers due to uninhibited gastric acid production.",
        "disorders": "1. Zollinger-Ellison Syndrome: Hypergastrinemia causing peptic ulcers. 2. Achlorhydria: Absence of gastric acid, often associated with autoimmune destruction of parietal cells.",
        "formula": "\\text{Pancreatic Secretion Rate} \\propto [\\text{Secretin}] + [\\text{CCK}]",
        "mnemonics": "G-S-I (Gastrin from G cells; Secretin from S cells; CCK from I cells).",
        "viva": [
            "What triggers the release of Cholecystokinin (CCK)? **Answer**: The presence of fatty acids and amino acids/peptides in the duodenum.",
            "Explain the Incretin effect. **Answer**: Oral glucose triggers a much larger insulin response than intravenous glucose because oral glucose stimulates the release of GIP and GLP-1 (Incretins) from the gut."
        ],
        "mcqs": [
            {
                "q": "Which GI hormone is stimulated by acid in the duodenum and causes bicarbonate secretion?",
                "a": "A) Gastrin", "b": "B) Cholecystokinin", "c": "C) Secretin", "d": "D) Ghrelin",
                "ans": "C", "exp": "Secretin is released by duodenal S cells in response to low pH, stimulating pancreatic ductal bicarbonate release."
            }
        ],
        "case": "A patient with multiple recurrent peptic ulcers has a fasting serum gastrin level of 1000 pg/mL (Normal <100 pg/mL). **Analysis**: Diagnostic of Zollinger-Ellison Syndrome. The gastrinoma secretes huge amounts of gastrin, causing continuous, maximal HCl secretion from parietal cells.",
        "flashcards": [
            {"f": "Which cell type secretes cholecystokinin?", "b": "I cells in the duodenum and jejunum."},
            {"f": "What is the primary action of Gastrin-Releasing Peptide (GRP)?", "b": "To stimulate gastrin release from G cells."}
        ]
    },
    # SECTION 8
    "hypothalamus-pituitary": {
        "title": "Hypothalamus & Pituitary",
        "analogy": "The hypothalamic-pituitary axis is like a military command chain: the general (Hypothalamus) issues local orders (releasing hormones) to the colonel (Anterior Pituitary), who sends field officers (trophic hormones) through the blood to direct the soldiers (target glands: thyroid, adrenal) to perform operations.",
        "concept": "The hypothalamus-pituitary axis is the master command system of endocrinology, integrating neural inputs to regulate growth, metabolism, reproduction, and stress.",
        "anatomy": "Hypothalamus, Median Eminence, Hypophyseal Portal Vessels (linking to Anterior Pituitary/Adenohypophysis), and the Hypothalamic-Hypophyseal tract (direct axonal connection to Posterior Pituitary/Neurohypophysis).",
        "physiology": "Anterior pituitary hormones: TSH, ACTH, LH, FSH, GH, Prolactin. Posterior pituitary hormones (synthesized in hypothalamus, stored in posterior pituitary): ADH (vasopressin) and Oxytocin.",
        "mechanism": "Feedback loops: Target gland hormones (e.g. Thyroxine) exert negative feedback by binding receptors on anterior pituitary thyrotropes (inhibiting TSH) and hypothalamic neurons (inhibiting TRH) to maintain homeostasis.",
        "flowchart": """graph TD
    A[Hypothalamus secretes] -->|TRH| B[Hypophyseal Portal System]
    B -->|Stimulates Thyrotropes in| C[Anterior Pituitary]
    C -->|Secrete| D[TSH into circulation]
    D -->|Stimulates Thyroid to release| E[T3 & T4]
    E -->|Negative Feedback inhibits| A
    E -->|Negative Feedback inhibits| C""",
        "correlation": "Pituitary adenomas can cause mass effect (compressing the optic chiasm, causing bitemporal hemianopsia) or hypersecretion syndromes (Prolactinoma, Acromegaly).",
        "disorders": "1. Prolactinoma: Most common secreting pituitary tumor, causing galactorrhea and amenorrhea. 2. Sheehan Syndrome: Postpartum pituitary necrosis due to blood loss during delivery.",
        "formula": "\\text{Primary Gland Failure}: \\quad \\uparrow \\text{Trophic Hormone} \\quad \\& \\quad \\downarrow \\text{Target Hormone}",
        "mnemonics": "FLAT PiG (Anterior pituitary hormones: **F**SH, **L**H, **A**CTH, **T**SH, **P**rolactin, **G**rowth Hormone).",
        "viva": [
            "What is the hypophyseal portal system? **Answer**: A system of blood vessels connecting the hypothalamus with the anterior pituitary, allowing rapid, undiluted transport of releasing hormones.",
            "Where are ADH and Oxytocin synthesized? **Answer**: In the supraoptic and paraventricular nuclei of the hypothalamus."
        ],
        "mcqs": [
            {
                "q": "Which of the following hormones is synthesized in the hypothalamus and stored in the posterior pituitary?",
                "a": "A) Growth Hormone", "b": "B) Prolactin", "c": "C) Oxytocin", "d": "D) TSH",
                "ans": "C", "exp": "Oxytocin and ADH are synthesized in the hypothalamus and transported axially to the posterior pituitary for storage and release."
            }
        ],
        "case": "A patient presents with double vision and loss of peripheral vision in both eyes. MRI reveals a 1.5 cm pituitary mass. **Analysis**: The pituitary tumor (macroadenoma) is compressing the overlying optic chiasm, causing bitemporal hemianopsia (mass effect).",
        "flashcards": [
            {"f": "Which hypothalamic hormone inhibits prolactin secretion?", "b": "Dopamine."},
            {"f": "What is the vascular connection between the hypothalamus and adenohypophysis?", "b": "The hypophyseal portal system."}
        ]
    },
    "adrenal-gland": {
        "title": "Adrenal Gland",
        "analogy": "The adrenal cortex is like a three-story manufacturing plant: the top floor (glomerulosa) produces salt-retaining valves (Aldosterone), the middle floor (fasciculata) produces sugar-regulating fuel (Cortisol), and the bottom floor (reticularis) produces performance boosters (DHEA). The basement (medulla) produces emergency nitro boosts (Epinephrine).",
        "concept": "The adrenal glands sit atop the kidneys. The cortex has three histologically and functionally distinct zones producing steroid hormones, while the medulla produces catecholamines.",
        "anatomy": "Adrenal cortex zones from outer to inner: Zona Glomerulosa, Zona Fasciculata, Zona Reticularis. Adrenal medulla contains chromaffin cells.",
        "physiology": "Zona Glomerulosa produces mineralocorticoids (Aldosterone). Zona Fasciculata produces glucocorticoids (Cortisol). Zona Reticularis produces androgens (DHEA). Medulla produces Epinephrine (80%) and Norepinephrine (20%).",
        "mechanism": "Hypothalamic-Pituitary-Adrenal (HPA) Axis: Stress or circadian rhythm stimulates hypothalamic CRH release, triggering pituitary ACTH secretion. ACTH stimulates adrenal steroidogenesis by upregulating StAR protein. Cortisol exerts negative feedback on CRH and ACTH.",
        "flowchart": """graph TD
    A[Stress / Circadian cues] -->|Hypothalamus releases| B[CRH]
    B -->|Stimulates Pituitary| C[ACTH release]
    C -->|Acts on Adrenal Fasciculata| D[Cortisol Synthesis]
    D -->|Raises blood glucose & suppresses immune system| E[Stress Response]
    D -.->|Negative Feedback| B
    D -.->|Negative Feedback| C""",
        "correlation": "Cushing Syndrome is characterized by cortisol excess (moon face, buffalo hump, abdominal striae). Addison's Disease is primary adrenal insufficiency, causing low cortisol, low aldosterone, and hyperpigmentation (due to elevated ACTH).",
        "disorders": "1. Cushing Disease: ACTH-secreting pituitary adenoma. 2. Conn Syndrome: Aldosterone-producing adrenal adenoma causing hypertension and hypokalemia. 3. Congenital Adrenal Hyperplasia (CAH): Commonly 21-hydroxylase deficiency, blocking cortisol/aldosterone and shunting cholesterol to androgens.",
        "formula": "\\text{Cortisol Levels} = \\text{Peak at 8:00 AM} \\quad \\& \\quad \\text{Trough at Midnight}",
        "mnemonics": "Go Find Receptor, Make Good Sex (Zones and their hormones from outer to inner: Zona **G**lomerulosa -> **M**ineralocorticoids; Zona **F**asciculata -> **G**lucocorticoids; Zona **R**eticularis -> **S**ex hormones).",
        "viva": [
            "Why does Addison's disease cause skin hyperpigmentation? **Answer**: Low cortisol increases ACTH secretion. ACTH shares a precursor (POMC) with Melanocyte-Stimulating Hormone (MSH), stimulating melanin production.",
            "What enzyme is deficient in 90% of Congenital Adrenal Hyperplasia cases? **Answer**: 21-hydroxylase."
        ],
        "mcqs": [
            {
                "q": "Which zone of the adrenal cortex is responsible for synthesizing Aldosterone?",
                "a": "A) Zona Fasciculata", "b": "B) Zona Glomerulosa", "c": "C) Zona Reticularis", "d": "D) Medulla",
                "ans": "B", "exp": "The Zona Glomerulosa contains aldosterone synthase and produces mineralocorticoids."
            }
        ],
        "case": "A patient presents with high blood pressure, low potassium (2.8 mEq/L), and low renin levels. **Analysis**: Conn Syndrome (Primary Hyperaldosteronism). Excess aldosterone promotes Na+ reabsorption (causing HTN) and K+ excretion (hypokalemia), suppressing renin feedback.",
        "flashcards": [
            {"f": "What cell type in the adrenal medulla secretes epinephrine?", "b": "Chromaffin cells."},
            {"f": "What is the primary stimulus for aldosterone release?", "b": "Angiotensin II and elevated plasma potassium ($K^+$) levels."}
        ]
    },
    "pancreas-diabetes": {
        "title": "Pancreas & Diabetes",
        "analogy": "Insulin is like a key that unlocks the doors of muscle and fat cells: when blood sugar is high after a meal, the pancreas releases the keys (Insulin) to unlock the gates (GLUT4), allowing sugar to enter the cells. Without keys (Type 1) or when the locks are rusty (Type 2), sugar accumulates in the street (bloodstream).",
        "concept": "The endocrine pancreas regulates glucose homeostasis. Insulin (beta cells) is anabolic, promoting glucose uptake and storage. Glucagon (alpha cells) is catabolic, releasing glucose during fasting.",
        "anatomy": "Islets of Langerhans: Alpha cells (20%, glucagon), Beta cells (70%, insulin/amylin), Delta cells (5%, somatostatin), and F cells (pancreatic polypeptide).",
        "physiology": "Normal fasting blood glucose is 70-100 mg/dL. Insulin is secreted in response to elevated blood glucose (stimulated by ATP-sensitive $K^+$ channel closure, causing depolarization and $Ca^{2+}$ influx).",
        "mechanism": "Insulin Signaling: 1. Insulin binds receptor tyrosine kinase, 2. Autophosphorylation recruits IRS-1/2, 3. Activates PI3K/Akt pathway, 4. Triggers translocation of GLUT-4 storage vesicles to the cell membrane, 5. Glucose enters cells via facilitated diffusion.",
        "flowchart": """graph TD
    A[Glucose enters Beta Cell via GLUT-2] -->|Glycolysis raises| B[Intracellular ATP/ADP Ratio]
    B -->|Closes| C[ATP-Sensitive K+ Channels]
    C -->|Causes| D[Cell Depolarization]
    D -->|Opens| E[Voltage-Gated Ca2+ Channels]
    E -->|Ca2+ influx triggers| F[Exocytosis of Insulin vesicles]
    F -->|Insulin binds muscle/fat RTK| G[GLUT-4 Translocation to Membrane]
    G -->|Glucose enters cells| H[Blood Glucose Lowers]""",
        "correlation": "Diabetes Mellitus is diagnosed by fasting plasma glucose $\\ge 126$ mg/dL or $HbA1c \\ge 6.5\\%$. Type 1 is autoimmune beta-cell destruction. Type 2 is progressive insulin resistance.",
        "disorders": "1. Diabetic Ketoacidosis (DKA): Life-threatening complication of Type 1 DM with absolute insulin deficiency, causing lipolysis and ketone body buildup. 2. Hyperosmolar Hyperglycemic State (HHS): Severe dehydration in Type 2 DM.",
        "formula": "\\text{HbA1c} = (\\text{Mean Blood Glucose in mg/dL} + 46.7) / 28.7",
        "mnemonics": "Insulin inserts GLUT-4 (Insulin stimulates GLUT-4 translocation in muscle and adipose tissues).",
        "viva": [
            "Explain how C-peptide is used clinically. **Answer**: Proinsulin is cleaved into insulin and C-peptide in equal amounts. Measuring C-peptide evaluates endogenous insulin production, helping distinguish Type 1 from Type 2 diabetes.",
            "What is the Somogyi effect? **Answer**: Rebound hyperglycemia in the morning caused by counter-regulatory hormones (epinephrine, cortisol) in response to nocturnal hypoglycemia."
        ],
        "mcqs": [
            {
                "q": "Which glucose transporter is insulin-dependent and located in skeletal muscle and adipose tissue?",
                "a": "A) GLUT-1", "b": "B) GLUT-2", "c": "C) GLUT-3", "d": "D) GLUT-4",
                "ans": "D", "exp": "GLUT-4 is the only insulin-dependent glucose transporter, sequestered in intracellular vesicles until insulin signaling occurs."
            }
        ],
        "case": "A 14-year-old girl presents with weight loss, constant thirst (polydipsia), and excessive urination (polyuria). Urine dipstick is positive for glucose and ketones. **Analysis**: New-onset Type 1 Diabetes Mellitus. Autoimmune destruction of beta cells prevents insulin synthesis, resulting in hyperglycemia and ketone production.",
        "flashcards": [
            {"f": "What pancreatic cells secrete somatostatin?", "b": "Delta cells."},
            {"f": "How does insulin affect potassium levels?", "b": "It shifts potassium into cells by stimulating the Na+/K+ ATPase pump."}
        ]
    },
    "calcium-bone": {
        "title": "Calcium & Bone Metabolism",
        "analogy": "Calcium regulation is like maintaining cash in a bank: the bone is the main vault holding 99% of the calcium, Parathyroid Hormone (PTH) is the manager withdrawing cash (resorption) to keep blood levels up, and Vitamin D is the security guard bringing in new cash from the outside (absorbing calcium from the gut).",
        "concept": "Extracellular calcium is vital for muscle contraction, nerve transmission, and coagulation. It is regulated by Parathyroid Hormone (PTH), Calcitonin, and active Vitamin D ($1,25-(OH)_2D_3$).",
        "anatomy": "Parathyroid glands, osteoblasts (bone-forming cells), osteoclasts (bone-resorbing cells derived from monocytes), and the proximal tubules of the kidneys.",
        "physiology": "Normal total serum calcium is 8.5-10.5 mg/dL. Ionized calcium (50%) is the biologically active fraction. PTH raises blood calcium; Calcitonin lowers it.",
        "mechanism": "PTH Action: 1. Low serum $Ca^{2+}$ is sensed by calcium-sensing receptors (CaSR) in parathyroid glands, 2. PTH is released, 3. Stimulates renal $Ca^{2+}$ reabsorption and stimulates 1-alpha-hydroxylase to activate Vitamin D, 4. Upregulates osteoblast expression of RANKL, binding osteoclast RANK receptors to activate bone resorption.",
        "flowchart": """graph TD
    A[Low Serum Calcium] -->|Sensed by CaSR| B[Parathyroid Glands release PTH]
    B -->|Increases| C[Renal Ca2+ Reabsorption]
    B -->|Stimulates renal| D[1-alpha-hydroxylase activity]
    D -->|Produces active| E[1,25-OH2 Vitamin D]
    E -->|Increases| F[Intestinal Ca2+ Absorption]
    B -->|Upregulates osteoblast| G[RANKL expression]
    G -->|Activates osteoclast| H[Bone Resorption]
    C & F & H -->|Raise| I[Serum Calcium back to normal]""",
        "correlation": "Chronic kidney disease prevents renal activation of Vitamin D (1-alpha-hydroxylase loss), causing hypocalcemia and secondary hyperparathyroidism (renal osteodystrophy).",
        "disorders": "1. Primary Hyperparathyroidism: Parathyroid adenoma causing stones, bones, abdominal groans, and psychiatric overtones. 2. Osteoporosis: Reduced bone mass with normal mineral-to-matrix ratio.",
        "formula": "[\\text{Corrected Calcium}] = [\\text{Measured Calcium}] + 0.8 \\times (4.0 - \\text{Serum Albumin in g/dL})",
        "mnemonics": "PTH pulls calcium from bones (PTH increases bone resorption to raise blood calcium levels).",
        "viva": [
            "Why does hypoalbuminemia decrease total calcium but leave ionized calcium normal? **Answer**: Albumin binds calcium. Lowering albumin reduces the bound fraction, but the homeostatically regulated ionized fraction remains unchanged.",
            "Describe the signs of hypocalcemia. **Answer**: Neuromuscular excitability, including Chvostek's sign (facial spasm when tapping facial nerve) and Trousseau's sign (carpopedal spasm when inflating BP cuff)."
        ],
        "mcqs": [
            {
                "q": "Which enzyme converts 25-hydroxyvitamin D to its active form, 1,25-dihydroxyvitamin D, in the kidneys?",
                "a": "A) 25-hydroxylase", "b": "B) 1-alpha-hydroxylase", "c": "C) 24-hydroxylase", "d": "D) Alkaline phosphatase",
                "ans": "B", "exp": "1-alpha-hydroxylase, stimulated by PTH in the renal proximal tubules, synthesizes active Vitamin D."
            }
        ],
        "case": "A patient presents with recurrent kidney stones and bone pain. Labs reveal serum calcium of 11.5 mg/dL and elevated PTH. **Analysis**: Primary Hyperparathyroidism. Excess PTH causes hypercalcemia and hypercalciuria (exceeding renal reabsorption capacity), leading to nephrolithiasis.",
        "flashcards": [
            {"f": "What cells secrete Calcitonin?", "b": "Parafollicular (C) cells of the thyroid gland."},
            {"f": "What receptor pathway mediates osteoclast activation by osteoblasts?", "b": "The RANK/RANKL pathway."}
        ]
    },
    "growth-hormone": {
        "title": "Growth Hormone",
        "analogy": "Growth hormone is like a construction manager: it does not lay the bricks directly, but it coordinates the site by releasing blueprints (IGF-1 from the liver) to stimulate bone elongation while mobilizing fuel (burning fat, sparing glucose) to power the project.",
        "concept": "Growth Hormone (GH/Somatotropin) is secreted by the anterior pituitary. It promotes postnatal growth and regulates lipid and carbohydrate metabolism, mediated in part by IGF-1.",
        "anatomy": "Anterior pituitary somatotropes, liver (primary site of IGF-1 synthesis), and the epiphyseal plates of long bones.",
        "physiology": "GH secretion is pulsatile, peaking during deep sleep. It is stimulated by GHRH and inhibited by Somatostatin. GH is diabetogenic (increases insulin resistance, raises blood glucose, promotes lipolysis).",
        "mechanism": "JAK/STAT Pathway: GH binds its receptor, activating Janus Kinase 2 (JAK2). JAK2 phosphorylates STAT transcription factors, which translocate to the nucleus to increase transcription of target genes, including IGF-1 (Insulin-like Growth Factor 1).",
        "flowchart": """graph TD
    A[Deep Sleep / Exercise / Hypoglycemia] -->|Hypothalamus releases| B[GHRH]
    B -->|Stimulates Pituitary| C[GH Secretion]
    C -->|Acts on Hepatocytes to synthesize| D[IGF-1 / Somatomedin-C]
    D -->|Stimulates chondrocytes in| E[Epiphyseal Plates - long bone growth]
    C -->|Metabolic effects| F[Lipolysis & Insulin Resistance]
    D -.->|Negative Feedback| A
    D -.->|Negative Feedback| C""",
        "correlation": "Gigantism occurs if GH excess occurs before epiphyseal plate fusion (in children). Acromegaly occurs after fusion (in adults), causing enlargement of hands, feet, jaw, and visceral organs.",
        "disorders": "1. Acromegaly: GH-secreting pituitary adenoma in adults. 2. Laron Dwarfism: GH receptor mutation, causing elevated GH but extremely low IGF-1.",
        "formula": "\\text{GH Secretion Rate} \\propto \\frac{\\text{GHRH}}{\\text{Somatostatin}}",
        "mnemonics": "SOMATOSTATIN Stops (Somatostatin is the primary hypothalamic inhibitor of GH, TSH, and insulin).",
        "viva": [
            "What is the metabolic difference between GH and Insulin? **Answer**: GH is anti-insulin; it decreases glucose uptake in muscle/fat (diabetogenic) and stimulates lipolysis, whereas insulin promotes glucose uptake and lipogenesis.",
            "How does IGF-1 participate in regulation? **Answer**: It exerts negative feedback on both GHRH release and GH release, and stimulates somatostatin release."
        ],
        "mcqs": [
            {
                "q": "The primary mediator of Growth Hormone's linear skeletal growth effects is:",
                "a": "A) Somatostatin", "b": "B) Insulin-like Growth Factor 1 (IGF-1)", "c": "C) Cortisol", "d": "D) Thyroxine",
                "ans": "B", "exp": "IGF-1 (Somatomedin-C), synthesized by the liver in response to GH, mediates linear bone growth."
            }
        ],
        "case": "A 40-year-old man notices his ring size and shoe size have steadily increased. He has a coarse facial appearance, prominent brow, and glucose intolerance. **Analysis**: Acromegaly due to a somatotrope adenoma. The growth of soft tissues occurs because the epiphyseal plates are already fused.",
        "flashcards": [
            {"f": "What hypothalamic hormone stimulates GH release?", "b": "GHRH (Growth Hormone-Releasing Hormone)."},
            {"f": "At what stage of the sleep cycle does GH secretion peak?", "b": "During slow-wave (deep) sleep (Stages 3 and 4 NREM)."}
        ]
    },
    # SECTION 9
    "male-repro": {
        "title": "Male Reproductive System",
        "analogy": "The male reproductive system is like a factory production line: LH acts as the power supply to the furnaces (Leydig cells) producing fuel (Testosterone), while FSH directs the assembly workers (Sertoli cells) to build and pack the product (spermatozoa) inside the factory walls (Blood-Testis Barrier).",
        "concept": "The male reproductive system is regulated by the hypothalamic-pituitary-gonadal (HPG) axis, controlling spermatogenesis and androgen synthesis.",
        "anatomy": "Seminiferous tubules, Sertoli cells, Leydig cells (interstitial space), epididymis, vas deferens, and accessory glands (seminal vesicles, prostate).",
        "physiology": "Spermatogenesis takes ~74 days. LH stimulates Leydig cells to produce Testosterone. FSH stimulates Sertoli cells to support spermatogenesis, produce androgen-binding protein (ABP), and secrete Inhibin B.",
        "mechanism": "Blood-Testis Barrier: Formed by tight junctions between Sertoli cells. It divides the seminiferous tubule into basal and adluminal compartments, preventing immune recognition of haploid spermatids (immunologically privileged site).",
        "flowchart": """graph TD
    A[Hypothalamus releases pulsatile| B[GnRH]
    B -->|Stimulates Pituitary| C[LH & FSH secretion]
    C -->|LH acts on| D[Leydig Cells]
    D -->|Produce| E[Testosterone]
    C -->|FSH acts on| F[Sertoli Cells]
    F -->|Secrete| G[ABP & Inhibin B]
    G & E -->|Drive| H[Spermatogenesis]
    E -.->|Negative Feedback| A & C
    G -.->|Inhibin B Negative Feedback| C""",
        "correlation": "Anabolic steroid abuse suppresses the HPG axis via negative feedback, causing testicular atrophy, azoospermia, and infertility due to loss of local intratesticular testosterone.",
        "disorders": "1. Klinefelter Syndrome: 47,XXY karyotype causing primary testicular failure (low testosterone, high LH/FSH, gynecomastia). 2. Cryptorchidism: Undescended testicles, impairing spermatogenesis due to high body temperature.",
        "formula": "\\text{Total Sperm Count} = \\text{Volume (mL)} \\times \\text{Concentration (million/mL)}",
        "mnemonics": "Sertoli Supports Sperm (Sertoli cells provide physical and nutritional support to maturing spermatids).",
        "viva": [
            "What is the function of the Blood-Testis Barrier? **Answer**: It prevents autoimmune destruction of developing haploid germ cells, which express foreign antigens.",
            "What enzyme converts testosterone to dihydrotestosterone (DHT)? **Answer**: 5-alpha-reductase, active in the prostate, skin, and hair follicles."
        ],
        "mcqs": [
            {
                "q": "Which cell type in the testes is responsible for synthesizing testosterone in response to LH?",
                "a": "A) Sertoli cells", "b": "B) Leydig cells", "c": "C) Spermatogonia", "d": "D) Myoid cells",
                "ans": "B", "exp": "Leydig cells (interstitial cells) express LH receptors and synthesize testosterone."
            }
        ],
        "case": "A 28-year-old bodybuilder complaining of infertility is found to have a sperm count of 2 million/mL (normal >15 million) and small, soft testicles. **Analysis**: Exogenous testosterone use created strong negative feedback on hypothalamic GnRH and pituitary LH/FSH, depriving Sertoli cells of local androgens needed for spermatogenesis.",
        "flashcards": [
            {"f": "What hormone provides negative feedback primarily on FSH release?", "b": "Inhibin B, secreted by Sertoli cells."},
            {"f": "What is the function of Androgen-Binding Protein (ABP)?", "b": "To maintain high local concentrations of testosterone within the seminiferous tubules."}
        ]
    },
    "pregnancy": {
        "title": "Pregnancy & Placenta",
        "analogy": "The placenta is like a specialized life-support pod docked onto the maternal ship: it serves as the fetus's lungs (gas exchange), kidneys (waste filtering), and digestive tract (nutrient intake) while releasing hormones (hCG) that modify the maternal cockpit settings to keep the portal open.",
        "concept": "Pregnancy involves major maternal cardiovascular, respiratory, and renal adaptations to support fetal development, mediated by placental hormones.",
        "anatomy": "Uterus, decidua, placental villi (syncytiotrophoblast and cytotrophoblast layers), umbilical cord (2 arteries, 1 vein).",
        "physiology": "Placenta secretes hCG (first trimester corpus luteum rescue), Progesterone (maintains uterine quiescence), and Estrogen (uterine growth). Maternal blood volume increases by 30-50%, and cardiac output rises by 30-40%.",
        "mechanism": "Placental Gas Exchange: Umbilical arteries carry deoxygenated blood from the fetus to the placenta. Oxygen diffuses from maternal intervillous spaces into the umbilical vein driven by the partial pressure gradient and the higher oxygen affinity of fetal hemoglobin (HbF).",
        "flowchart": """graph TD
    A[Implantation] -->|Trophoblast secretes| B[hCG]
    B -->|Rescues| C[Corpus Luteum]
    C -->|Sustains| D[Progesterone Secretion]
    D -->|Prevents| E[Menstruation & Uterine Contractions]
    F[Placental Growth] -->|Synthesizes| G[Progesterone & Estriol]
    G -->|Triggers maternal| H[Hypervolemia & Increased Cardiac Output]""",
        "correlation": "Preeclampsia is characterized by gestational hypertension and proteinuria, caused by abnormal placental spiral artery remodeling leading to chronic placental ischemia.",
        "disorders": "1. Preeclampsia: Gestational HTN, proteinuria, and systemic endothelial dysfunction. 2. Gestational Diabetes: Placental Lactogen (hPL) causes maternal insulin resistance, increasing glucose availability for the fetus.",
        "formula": "\\text{Mean Arterial Pressure (Pregnancy)} \\quad \\downarrow \\quad \\text{due to} \\quad \\downarrow \\text{Total Peripheral Resistance}",
        "mnemonics": "hCG keeps the cradle warm (hCG rescues the corpus luteum to maintain progesterone and sustain early pregnancy).",
        "viva": [
            "Why does physiological anemia of pregnancy occur? **Answer**: Plasma volume increases by 50% while RBC mass only increases by 20-30%, resulting in hemodilution.",
            "Explain the shift in the maternal oxygen-hemoglobin curve during pregnancy. **Answer**: Maternal Hb-O2 curve shifts to the right (Bohr effect due to local fetal acidosis), facilitating oxygen release to the placenta."
        ],
        "mcqs": [
            {
                "q": "Which placental hormone is responsible for maintaining the corpus luteum during the first trimester?",
                "a": "A) Human Placental Lactogen (hPL)", "b": "B) Human Chorionic Gonadotropin (hCG)", "c": "C) Progesterone", "d": "D) Estriol",
                "ans": "B", "exp": "hCG, secreted by the syncytiotrophoblast, prevents corpus luteum degradation, ensuring progesterone synthesis until the placenta takes over."
            }
        ],
        "case": "A pregnant woman at 32 weeks gestation presents with a BP of 150/95 mmHg and +2 protein on a urine dipstick. She has facial swelling. **Analysis**: Preeclampsia. Abnormal cytotrophoblast invasion of spiral arteries caused placental ischemia, triggering systemic endothelial dysfunction, vasoconstriction, and glomerular leak.",
        "flashcards": [
            {"f": "What is the normal vessel composition of the umbilical cord?", "b": "Two umbilical arteries (carrying deoxygenated blood to the placenta) and one umbilical vein (carrying oxygenated blood to the fetus)."},
            {"f": "How does GFR change during normal pregnancy?", "b": "It increases by 50% due to elevated renal blood flow."}
        ]
    },
    "lactation": {
        "title": "Lactation",
        "analogy": "Lactation is like a manufacturing and distribution system: Prolactin is the assembly supervisor that manufactures the milk inside the cells, while Oxytocin is the delivery valve that squeezes the cells (myoepithelial contraction) to eject the milk when a customer (baby) calls.",
        "concept": "Lactation is regulated by neuroendocrine reflexes. Prolactin stimulates milk synthesis, while Oxytocin mediates milk ejection (let-down reflex).",
        "anatomy": "Mammary gland alveoli (secretory cells), myoepithelial cells (surrounding alveoli), lactiferous ducts, and nipple mechanoreceptors.",
        "physiology": "Pregnancy high estrogen/progesterone levels stimulate ductal-alveolar development but inhibit active milk secretion. Delivery drop in estrogen/progesterone disinhibits prolactin. Suckling inhibits dopamine (increasing prolactin) and stimulates oxytocin release.",
        "mechanism": "Milk Let-Down Reflex: 1. Suckling stimulates tactile receptors in the nipple, 2. Signals travel via spinothalamic tracts to the hypothalamus, 3. Magnocellular neurons in the PVN/SO nuclei fire, releasing Oxytocin from the posterior pituitary, 4. Oxytocin contracts alveolar myoepithelial cells, ejecting milk.",
        "flowchart": """graph TD
    A[Suckling Stimulus] -->|Nipple Tactile Receptors| B[Spinothalamic Sensory Tracts]
    B -->|Hypothalamus| C[Inhibits Dopamine / Stimulates PVN & SO]
    C -->|Pituitary responses| D[Anterior Pituitary releases Prolactin]
    C -->|Pituitary responses| E[Posterior Pituitary releases Oxytocin]
    D -->|Stimulates| F[Alveolar Milk Synthesis]
    E -->|Contracts| G[Myoepithelial Cells]
    G -->|Causes| H[Milk Let-Down / Ejection]""",
        "correlation": "Lactational Amenorrhea: High prolactin levels during frequent breastfeeding inhibit hypothalamic GnRH release, suppressing LH/FSH secretion and serving as a natural (but incomplete) contraceptive.",
        "disorders": "1. Mastitis: Bacterial infection of a blocked lactiferous duct, presenting with pain, erythema, and fever. 2. Galactorrhea: Inappropriate milk secretion in non-lactating individuals, often due to a prolactinoma.",
        "formula": "\\text{Prolactin Secretion} \\propto \\frac{1}{\\text{Dopamine Concentration}}",
        "mnemonics": "PROlactin PROduces, Oxytocin Ejects (Prolactin stimulates milk production; Oxytocin stimulates milk ejection).",
        "viva": [
            "Why does milk secretion not occur during pregnancy despite high prolactin levels? **Answer**: High levels of progesterone and estrogen during pregnancy block the action of prolactin on the breast alveoli.",
            "What is Colostrum? **Answer**: The early milk secreted during the first few days postpartum, rich in proteins, vitamins, and IgA antibodies, but low in fat."
        ],
        "mcqs": [
            {
                "q": "Which hormone is directly responsible for contracting alveolar myoepithelial cells to eject milk?",
                "a": "A) Prolactin", "b": "B) Oxytocin", "c": "C) Progesterone", "d": "D) Estrogen",
                "ans": "B", "exp": "Oxytocin contracts the myoepithelial cells surrounding mammary alveoli, causing milk let-down."
            }
        ],
        "case": "A breastfeeding mother experiences milk ejection when she hears her baby cry, even before suckling starts. **Analysis**: The let-down reflex is a conditioned neuroendocrine reflex; sensory inputs (crying) stimulate the cerebral cortex to trigger hypothalamic oxytocin release.",
        "flashcards": [
            {"f": "What immunoglobulin is abundant in breast milk?", "b": "Secretory IgA (provides passive mucosal immunity to the infant)."},
            {"f": "What neurotransmitter acts as the primary Prolactin-Inhibiting Hormone?", "b": "Dopamine."}
        ]
    },
    # SECTION 10
    "motor-system": {
        "title": "Motor System",
        "analogy": "The motor system is like a corporate operations team: the president (Cerebral Cortex) drafts the strategy, which travels down the main elevator shaft (Corticospinal tract) to the local project managers (Lower Motor Neurons in spinal cord) who direct the factory floor workers (skeletal muscles) to execute the movements.",
        "concept": "The motor system plans, coordinates, and executes movement. It is divided into upper motor neurons (UMNs, brain/spinal tract) and lower motor neurons (LMNs, peripheral nerves).",
        "anatomy": "Primary Motor Cortex (Brodmann area 4), Internal Capsule, Pyramids of Medulla (where 85% of fibers decussate), Lateral Corticospinal Tract, and Alpha Motor Neurons in the spinal ventral horn.",
        "physiology": "UMNs originate in the cortex and synapse with LMNs in the spinal cord. Pyramidal tract controls voluntary fine motor skills. Extrapyramidal tracts (rubrospinal, vestibulospinal) control posture, balance, and muscle tone.",
        "mechanism": "Voluntary Movement execution: 1. Premotor cortex plans, 2. Primary motor cortex generates command, 3. Signals descend through internal capsule, 4. Decussate in medullary pyramids, 5. Synapse with contralateral spinal alpha motor neurons, 6. Muscle contracts.",
        "flowchart": """graph TD
    A[Primary Motor Cortex Area 4] -->|Fires down| B[Internal Capsule posterior limb]
    B -->|Descends to| C[Pyramids of Medulla]
    C -->|85% decussate to form| D[Lateral Corticospinal Tract]
    D -->|Synapses in spinal anterior horn with| E[Alpha Motor Neuron - LMN]
    E -->|Releases ACh at| F[Neuromuscular Junction]
    F -->|Causes Contraction of| G[Contralateral Skeletal Muscle]""",
        "correlation": "UMN lesions cause spastic paralysis, hyperreflexia, and positive Babinski sign due to loss of descending inhibition. LMN lesions cause flaccid paralysis, muscle atrophy, fasciculations, and hyporeflexia.",
        "disorders": "1. Amyotrophic Lateral Sclerosis (ALS): Degeneration of both UMNs and LMNs. 2. Spinal Cord Hemisection (Brown-Séquard Syndrome): Contralateral loss of pain/temp and ipsilateral motor paralysis.",
        "formula": "\\text{UMN Lesion} \\rightarrow \\uparrow \\text{Tone/Reflexes}, \\quad \\text{LMN Lesion} \\rightarrow \\downarrow \\text{Tone/Reflexes}",
        "mnemonics": "LMN is Everything Lowered (LMN lesion signs: **L**ost reflexes, **L**ost tone, **L**ost muscle mass [atrophy], **L**imp muscles [flaccid]).",
        "viva": [
            "Describe the Babinski reflex and its clinical significance. **Answer**: Stroking the sole of the foot normally causes plantar flexion. Extension (dorsiflexion of big toe, fanning of others) is a positive Babinski sign, indicating an UMN lesion.",
            "Where do the fibers of the lateral corticospinal tract decussate? **Answer**: In the pyramids of the lower medulla."
        ],
        "mcqs": [
            {
                "q": "Which of the following is a classic sign of a Lower Motor Neuron (LMN) lesion?",
                "a": "A) Spasticity", "b": "B) Hyperreflexia", "c": "C) Fasciculations", "d": "D) Positive Babinski sign",
                "ans": "C", "exp": "Fasciculations (muscle twitches) are caused by spontaneous depolarization of dying LMN motor units."
            }
        ],
        "case": "A patient with a history of stroke presents with paralysis on the right side of the body. Examination shows rigid muscles, brisk reflexes (+4), and an upward-pointing big toe when the sole of the foot is scraped. **Analysis**: Upper Motor Neuron lesion. The stroke damaged the left motor cortex, disrupting descending inhibitory control over the right spinal cord circuits.",
        "flashcards": [
            {"f": "What percent of corticospinal fibers decussate in the medulla?", "b": "Approximately 85% (forming the lateral corticospinal tract)."},
            {"f": "What tract is primarily responsible for voluntary fine movement of the limbs?", "b": "The lateral corticospinal tract."}
        ]
    },
    "sensory-system": {
        "title": "Sensory System",
        "analogy": "Sensory pathways are like different fiber-optic cables routing data to a server room: the fast, high-bandwidth cable (Dorsal Column pathway) carries high-priority, precise data like touch and position directly without leaks, while the slower, insulated cable (Spinothalamic pathway) handles warnings like fire and pain.",
        "concept": "Sensory receptors transduce physical stimuli into action potentials. The two main somatosensory pathways are the Dorsal Column-Medial Lemniscal (DCML) system and the Anterolateral (Spinothalamic) system.",
        "anatomy": "Receptors (Pacinian, Meissner, Ruffini, free nerve endings), Dorsal root ganglia (first-order neurons), Dorsal columns (Gracilis and Cuneatus), Medulla (gracile and cuneate nuclei), and Thalamus (VPL nucleus).",
        "physiology": "1. DCML system: Conveys fine touch, vibration, and proprioception. Fast, myelinated $A\\beta$ fibers. 2. Anterolateral system: Conveys pain, temperature, and crude touch. Slower, smaller $A\\delta$ and $C$ fibers.",
        "mechanism": "DCML Decussation: First-order sensory neurons enter the spinal cord and ascend ipsilaterally in dorsal columns. They synapse in the medulla. Second-order neurons decussate immediately as internal arcuate fibers, forming the medial lemniscus to ascend to the thalamus.",
        "flowchart": """graph TD
    A[Fine Touch / Vibration at receptor] -->|Fires| B[First-Order Neuron - DRG]
    B -->|Ascends ipsilaterally via| C[Spinal Dorsal Columns]
    C -->|Synapses in Medulla at| D[Nucleus Gracilis / Cuneatus]
    D -->|Second-Order Neurons decussate as| E[Internal Arcuate Fibers]
    E -->|Ascend via Medial Lemniscus to| F[Thalamus - VPL Nucleus]
    F -->|Third-Order Neurons project to| G[Primary Somatosensory Cortex]""",
        "correlation": "Syphilis can cause Tabes Dorsalis, selectively destroying the dorsal columns and causing loss of vibration and proprioception, leading to a sensory ataxia (stomping gait).",
        "disorders": "1. Tabes Dorsalis: Dorsal column demyelination. 2. Brown-Séquard Syndrome: Spinal cord hemisection, causing ipsilateral loss of touch/proprioception and contralateral loss of pain/temp.",
        "formula": "\\text{Weber-Fechner Law}: \\quad S = k \\cdot \\log(I)",
        "mnemonics": "DCML is Top Touch, Spinothalamic is Hot Pain (DCML = fine touch, vibration, proprioception; Spinothalamic = pain and temperature).",
        "viva": [
            "Where do the pathways of the DCML and Spinothalamic systems decussate? **Answer**: The DCML decussates in the medulla; the Spinothalamic decussates in the spinal cord at the level of entry.",
            "What is the difference between rapid and slow-adapting receptors? **Answer**: Rapid-adapting (e.g. Pacinian) detect onset/velocity of stimulus; slow-adapting (e.g. Merkel) detect continuous pressure/duration."
        ],
        "mcqs": [
            {
                "q": "The second-order neurons of the Dorsal Column-Medial Lemniscal system decussate in the:",
                "a": "A) Spinal cord anterior white commissure", "b": "B) Lower medulla", "c": "C) Pons", "d": "D) Internal capsule",
                "ans": "B", "exp": "DCML second-order fibers decussate in the medulla as internal arcuate fibers, forming the medial lemniscus."
            }
        ],
        "case": "A patient with neurosyphilis cannot tell where his legs are in space without looking at them and stomps his feet when walking. **Analysis**: Tabes dorsalis. The destruction of the dorsal columns impairs proprioceptive sensory feedback from the lower limbs.",
        "flashcards": [
            {"f": "Which receptor type is specialized for detecting high-frequency vibration?", "b": "Pacinian corpuscles (rapidly adapting)."},
            {"f": "Which thalamic nucleus receives somatosensory information from the body?", "b": "The Ventral Posterolateral (VPL) nucleus."}
        ]
    },
    "cerebellum": {
        "title": "Cerebellum & Basal Ganglia",
        "analogy": "Motor control is like executing a musical performance: the cortex is the composer, the Basal Ganglia is the editor that cuts out incorrect notes and permits the correct melody to start (regulating movement initiation), while the Cerebellum is the real-time tuner and conductor that corrects off-beat instruments (coordinating balance and accuracy).",
        "concept": "The Basal Ganglia initiates wanted voluntary movement and suppresses unwanted movement. The Cerebellum acts as a comparator, adjusting motor execution to match motor intent.",
        "anatomy": "Basal Ganglia: Striatum (Caudate/Putamen), Globus Pallidus, Subthalamic Nucleus, Substantia Nigra. Cerebellum: Vestibulocerebellum, Spinocerebellum, Cerebrocerebellum. Purkinje cells.",
        "physiology": "Basal Ganglia pathways: Direct pathway stimulates movement via D1 receptors (disinhibiting the thalamus); Indirect pathway inhibits movement via D2. Cerebellum Purkinje cells provide inhibitory GABAergic output to deep cerebellar nuclei.",
        "mechanism": "Direct Pathway: 1. Cortex excites Striatum, 2. Striatum releases GABA to inhibit Globus Pallidus Internus (GPi), 3. GPi normally inhibits Thalamus, so GPi inhibition disinhibits/excites Thalamus, 4. Thalamus excites Cortex, promoting movement. Dopamine via D1 receptors stimulates this pathway.",
        "flowchart": """graph TD
    A[Motor Cortex excites] -->|Glu| B[Striatum]
    B -->|GABA - inhibits| C[Globus Pallidus Internus - GPi]
    C -->|GPi normally inhibits Thalamus, now turned off| D[Thalamus disinhibited]
    D -->|Excites| E[Motor Cortex]
    E -->|Triggers| F[Voluntary Movement Initiation]
    G[Substantia Nigra releases Dopamine] -->|D1 Receptors| B
    G -.->|D2 Receptors inhibits indirect pathway| B""",
        "correlation": "Parkinson's Disease is caused by degeneration of dopaminergic neurons in the Substantia Nigra pars compacta, resulting in bradykinesia, resting tremor, and rigidity. Cerebellar lesions cause intention tremor, dysmetria, and ataxia.",
        "disorders": "1. Parkinson's Disease: Loss of substantia nigra dopamine. 2. Huntington's Disease: Caudate degeneration causing chorea. 3. Cerebellar Ataxia: Wide-based gait and poor balance.",
        "formula": "\\text{Basal Ganglia Output} \\propto \\text{Direct Pathway Activity} - \\text{Indirect Pathway Activity}",
        "mnemonics": "Cerebellar DANISH (Signs of cerebellar lesion: **D**ysdiadochokinesia, **A**taxia, **N**ystagmus, **I**ntention tremor, **S**lurred speech, **H**ypotonia).",
        "viva": [
            "Explain the difference between resting tremor and intention tremor. **Answer**: Resting tremor occurs at rest and disappears during movement (Parkinson's / Basal Ganglia). Intention tremor appears only during voluntary movement near target (Cerebellar).",
            "What is dysdiadochokinesia? **Answer**: Inability to perform rapid, alternating movements (e.g. pronation/supination), a classic sign of cerebellar dysfunction."
        ],
        "mcqs": [
            {
                "q": "Degeneration of dopaminergic neurons in the Substantia Nigra pars compacta leads to:",
                "a": "A) Huntington's chorea", "b": "B) Parkinson's disease", "c": "C) Cerebellar ataxia", "d": "D) Hemiballismus",
                "ans": "B", "exp": "Loss of dopamine in the substantia nigra disrupts basal ganglia pathways, causing Parkinson's disease."
            }
        ],
        "case": "A patient presents with a resting 'pill-rolling' tremor, rigid muscles, and difficulty initiating walking (shuffling gait). **Analysis**: Parkinson's disease. The loss of dopaminergic inputs to the striatum increases indirect pathway activity, suppressing cortical motor initiation.",
        "flashcards": [
            {"f": "What is the primary neurotransmitter of Purkinje cells?", "b": "GABA (inhibitory)."},
            {"f": "What basal ganglia structure is damaged in Hemiballismus?", "b": "The Subthalamic Nucleus."}
        ]
    },
    "ans": {
        "title": "Autonomic Nervous System",
        "analogy": "The ANS is like the autonomic heating and cooling system of a hybrid car: the Sympathetic division is the gas pedal and cooling system during high-speed racing (fight-or-flight: dilating pupils, raising heart rate, stopping digestion), while the Parasympathetic division is the slow battery charging mode at home (rest-and-digest: slow heart, active gut).",
        "concept": "The Autonomic Nervous System controls involuntary visceral functions. It consists of the Sympathetic (thoracolumbar) and Parasympathetic (craniosacral) divisions.",
        "anatomy": "Sympathetic: preganglionic neurons in T1-L2 spinal cord, paravertebral sympathetic chain. Parasympathetic: cranial nerves III, VII, IX, X and sacral S2-S4 spinal cord.",
        "physiology": "Sympathetic neurotransmitter: Acetylcholine at ganglia, Norepinephrine at target organs (except sweat glands: ACh). Parasympathetic: Acetylcholine at both ganglia and target organs. Adrenergic receptors: $Alpha_1, Alpha_2, Beta_1, Beta_2$. Cholinergic: Nicotinic, Muscarinic ($M_1-M_5$).",
        "mechanism": "Sympathetic Heart Rate Increase: Norepinephrine binds cardiac $Beta_1$ receptors (Gs protein coupled), activating adenylate cyclase, raising cAMP, opening HCN pacemaker channels ($I_f$) and L-type Ca2+ channels, accelerating pacemaker depolarization slope.",
        "flowchart": """graph TD
    A[Sympathetic Preganglionic fiber] -->|Releases ACh onto Nicotinic| B[Paravertebral Ganglion]
    B -->|Postganglionic fiber releases NE onto| C[Cardiac Beta-1 Receptors]
    C -->|Gs protein stimulates| D[Adenylate Cyclase]
    D -->|Raises| E[cAMP]
    E -->|Opens HCN pacemaker channels| F[Increased Pacemaker Depolarization Slope]
    F -->|Raises| G[Heart Rate & Contractility]""",
        "correlation": "Beta-blockers (e.g. Metoprolol) block $Beta_1$ receptors to treat hypertension and tachycardia. Atropine blocks muscarinic receptors to treat symptomatic bradycardia.",
        "disorders": "1. Horner Syndrome: Loss of sympathetic pathway to the face (ptosis, meiosis, anhidrosis). 2. Pheochromocytoma: Adrenal medulla tumor secreting excess catecholamines.",
        "formula": "\\text{Heart Rate} \\propto \\text{Sympathetic tone} - \\text{Parasympathetic tone}",
        "mnemonics": "Sympathetic is Fight-or-Flight, Parasympathetic is Rest-and-Digest.",
        "viva": [
            "What receptors are found on sweat glands? **Answer**: Muscarinic cholinergic receptors, stimulated by sympathetic postganglionic fibers releasing acetylcholine (an anatomical exception).",
            "Which cranial nerve carries 75% of all parasympathetic fibers? **Answer**: The Vagus nerve (CN X)."
        ],
        "mcqs": [
            {
                "q": "Which receptor subtype mediates sympathetic bronchodilation in the lungs?",
                "a": "A) Alpha-1", "b": "B) Beta-1", "c": "C) Beta-2", "d": "D) Muscarinic M2",
                "ans": "C", "exp": "Epinephrine/Norepinephrine bind to Beta-2 receptors on bronchial smooth muscle, causing relaxation and bronchodilation."
            }
        ],
        "case": "A patient is rushed to the ER with pinpoint pupils, salivation, wheezing, and bradycardia after spraying pesticides. **Analysis**: Organophosphate poisoning. Inhibition of acetylcholinesterase caused massive buildup of Acetylcholine, triggering extreme parasympathetic activation.",
        "flashcards": [
            {"f": "What is the preganglionic neurotransmitter for both Sympathetic and Parasympathetic systems?", "b": "Acetylcholine (ACh)."},
            {"f": "What receptor subtype on heart muscle increases contraction force?", "b": "Beta-1 adrenergic receptors."}
        ]
    },
    "higher-functions": {
        "title": "Higher Functions",
        "analogy": "Language processing in the brain is like a telegraph station: Wernicke's area is the translation clerk that decodes incoming code and drafts the response text (speech comprehension), while Broca's area is the telegraph operator that coordinates the finger taps and buttons (motor speech output) to transmit the message.",
        "concept": "Higher cortical functions include language, learning, memory, attention, and executive planning.",
        "anatomy": "Broca's area (inferior frontal gyrus), Wernicke's area (superior temporal gyrus), Arcuate Fasciculus (connecting tract), and Hippocampus (limbic system).",
        "physiology": "Language is localized in the dominant hemisphere (usually left). Memory consolidation (short-term to long-term) requires the hippocampus and is reinforced by Long-Term Potentiation (LTP).",
        "mechanism": "Long-Term Potentiation (LTP): 1. High-frequency stimulation releases glutamate, 2. AMPA receptors depolarize post-synaptic membrane, 3. Depolarization expels $Mg^{2+}$ block from NMDA receptors, 4. $Ca^{2+}$ enters via NMDA, activating kinases, 5. Apical insertion of new AMPA receptors increases synaptic weight.",
        "flowchart": """graph TD
    A[Glutamate released from Presynaptic Terminal] -->|Binds to| B[Postsynaptic AMPA Receptors]
    B -->|Na+ influx causes| C[Local Depolarization]
    C -->|Expels Mg2+ block from| D[NMDA Receptors]
    D -->|Allows Ca2+ influx through| E[NMDA Channels]
    E -->|Activates intracellular| F[Calmodulin & Kinases]
    F -->|Upregulates| G[AMPA Receptor density on membrane]
    G -->|Increases| H[Synaptic Strength - LTP]""",
        "correlation": "Damage to Broca's area causes expressive, non-fluent aphasia (patient can understand but cannot speak fluently). Damage to Wernicke's causes receptive, fluent aphasia (patient speaks fluently but in a meaningless 'word salad').",
        "disorders": "1. Broca's Aphasia: Motor speech deficit. 2. Wernicke's Aphasia: Sensory comprehension deficit. 3. Alzheimer's Disease: Progressive cortical and hippocampal atrophy leading to dementia.",
        "formula": "\\text{Synaptic Efficiency} \\propto \\text{Density of Postsynaptic AMPA Receptors}",
        "mnemonics": "Broca's is Broken speech, Wernicke's is Word salad (Broca's = expressive aphasia; Wernicke's = receptive fluent aphasia).",
        "viva": [
            "What is the function of the Arcuate Fasciculus? **Answer**: It is the white matter fiber tract connecting Wernicke's area to Broca's area; damage causes conduction aphasia (inability to repeat phrases).",
            "Explain the role of the hippocampus in memory. **Answer**: It consolidates short-term declarative memory into long-term memory in the neocortex; it does not store long-term memories permanently."
        ],
        "mcqs": [
            {
                "q": "A patient speaks fluently but the sentences make no sense, and they cannot understand spoken commands. This suggests damage to:",
                "a": "A) Broca's area", "b": "B) Wernicke's area", "c": "C) Arcuate fasciculus", "d": "D) Primary motor cortex",
                "ans": "B", "exp": "Wernicke's aphasia is a receptive aphasia with fluent but meaningless speech and impaired comprehension."
            }
        ],
        "case": "A patient recovers from a stroke. She can understand instructions perfectly but struggles to say words, speaking slowly and in short, halting phrases. **Analysis**: Broca's aphasia. The stroke damaged the left inferior frontal gyrus, leaving motor planning of speech impaired.",
        "flashcards": [
            {"f": "What receptor ion channel is blocked by Magnesium at resting membrane potentials?", "b": "The NMDA receptor channel."},
            {"f": "What brain structure is required for consolidating new declarative memories?", "b": "The Hippocampus."}
        ]
    },
    "csf-bbb": {
        "title": "CSF & Blood-Brain Barrier",
        "analogy": "The brain is like a fragile artifact inside a secure museum display: it floats inside a shock-absorbing liquid cushion (CSF) while the Blood-Brain Barrier acts as the strict security checkpoint, letting only essential visitors (glucose, oxygen) pass through while blocking toxins and bacteria.",
        "concept": "The cerebrospinal fluid (CSF) cushions the brain, while the Blood-Brain Barrier (BBB) regulates the interstitial microenvironment of the central nervous system.",
        "anatomy": "Choroid plexus (CSF production), arachnoid villi (CSF absorption), brain capillary endothelial cells with tight junctions, and astrocyte end-feet.",
        "physiology": "Normal CSF volume: 150 mL; daily production: 500 mL; normal pressure: 50-180 mmH2O. CSF has lower protein, lower potassium, and lower calcium than plasma. BBB is highly permeable to lipophilic molecules ($CO_2, O_2$, alcohol) but requires active transporters for glucose (GLUT1).",
        "mechanism": "CSF Flow: 1. Produced by choroid plexus in lateral ventricles, 2. Flows through foramina of Monro to third ventricle, 3. Through Aqueduct of Sylvius to fourth ventricle, 4. Out foramina of Luschka/Magendie to subarachnoid space, 5. Absorbed by arachnoid granulations into superior sagittal sinus.",
        "flowchart": """graph TD
    A[Choroid Plexus in Lateral Ventricles] -->|Produces CSF| B[Foramina of Monro]
    B -->|Third Ventricle| C[Aqueduct of Sylvius]
    C -->|Fourth Ventricle| D[Foramina of Luschka & Magendie]
    D -->|Subarachnoid Space| E[Cushions Brain & Spinal Cord]
    E -->|Absorbed via| F[Arachnoid Granulations]
    F -->|Enters| G[Superior Sagittal Venous Sinus]""",
        "correlation": "Bacterial meningitis disrupts the BBB, increasing CSF protein, lowering CSF glucose (consumed by bacteria), and raising opening pressure with elevated neutrophils.",
        "disorders": "1. Hydrocephalus: Excess CSF accumulation due to blocked flow (obstructive) or impaired absorption (communicating). 2. Idiopathic Intracranial Hypertension: Elevated CSF pressure without a mass.",
        "formula": "\\text{Cerebral Perfusion Pressure (CPP)} = \\text{Mean Arterial Pressure (MAP)} - \\text{Intracranial Pressure (ICP)}",
        "mnemonics": "Magendie is Midline, Luschka is Lateral (CSF exits the 4th ventricle via the single midline Foramen of Magendie and the two lateral Foramina of Luschka).",
        "viva": [
            "What anatomical structures form the Blood-Brain Barrier? **Answer**: 1. Non-fenestrated capillary endothelial cells with tight junctions, 2. Basement membrane, 3. Astrocyte foot processes.",
            "Why is CSF glucose lower in bacterial meningitis? **Answer**: Bacteria and recruited leukocytes actively consume glucose for metabolism, dropping levels below 40% of blood glucose."
        ],
        "mcqs": [
            {
                "q": "Through which opening does CSF flow from the third ventricle to the fourth ventricle?",
                "a": "A) Foramen of Monro", "b": "B) Foramen of Magendie", "c": "C) Aqueduct of Sylvius", "d": "D) Foramen of Luschka",
                "ans": "C", "exp": "The cerebral aqueduct of Sylvius connects the third and fourth ventricles in the midbrain."
            }
        ],
        "case": "A child presents with fever, stiff neck, and headache. Lumbar puncture reveals cloudy CSF with high protein, low glucose, and many neutrophils. **Analysis**: Acute Bacterial Meningitis. Bacteria disrupted the BBB, recruiting neutrophils and lowering CSF glucose.",
        "flashcards": [
            {"f": "What is the normal opening pressure of CSF in a lying adult?", "b": "50 to 180 mmH2O (or 5 to 15 mmHg)."},
            {"f": "What structures absorb CSF back into the venous system?", "b": "Arachnoid villi/granulations."}
        ]
    },
    "eeg-sleep": {
        "title": "EEG & Sleep",
        "analogy": "Brain waves during sleep are like the noise of a city: when awake and active, the noise is rapid, random, and high-frequency (desynchronized beta waves); during deep sleep, the city synchronizes as everyone starts clapping together slowly, producing large, slow rhythmic beats (synchronized delta waves).",
        "concept": "The Electroencephalogram (EEG) records cortical postsynaptic potentials. Sleep is an active, highly regulated cyclical process consisting of NREM and REM stages.",
        "anatomy": "Thalamus (pacemaker for cortical rhythmicity), reticular activating system (RAS, maintaining wakefulness), and suprachiasmatic nucleus (circadian clock).",
        "physiology": "EEG waves: Alpha (awake, relaxed, 8-13 Hz); Beta (awake, alert/focused, 14-30 Hz); Theta (light sleep, 4-7 Hz); Delta (deep sleep, <4 Hz). Sleep cycle repeats every 90-110 minutes, shifting from NREM (75%) to REM (25%).",
        "mechanism": "Sleep Cycle progression: 1. N1 (Theta waves), 2. N2 (Sleep Spindles and K-complexes), 3. N3 (Slow-Wave Sleep, Delta waves, growth hormone released), 4. REM (Desynchronized EEG resembling awake state, dreaming, muscle atonia, rapid eye movements).",
        "flowchart": """graph TD
    A[Awake, alert] -->|Beta Waves - 15-30 Hz| B[N1 Sleep]
    B -->|Theta Waves - 4-7 Hz| C[N2 Sleep]
    C -->|Sleep Spindles & K-Complexes| D[N3 Deep Sleep]
    D -->|Delta Waves - 1-3 Hz - Slow Wave| E[REM Sleep]
    E -->|Beta-like desynchronized EEG & Muscle Atonia| A
    F[Suprachiasmatic Nucleus] -->|Melatonin release via Pineal Gland| B""",
        "correlation": "Narcolepsy is characterized by sudden, uncontrollable entry into REM sleep directly from wakefulness, caused by a loss of orexin (hypocretin) producing neurons in the lateral hypothalamus.",
        "disorders": "1. Narcolepsy: Sleep attacks and cataplexy. 2. Somnambulism (Sleepwalking): Occurs during Stage N3 deep sleep, not during REM. 3. Insomnia: Difficulty falling or staying asleep.",
        "formula": "\\text{Total Sleep Cycle Duration} = \\text{N1} + \\text{N2} + \\text{N3} + \\text{REM} \\approx 90-100 \\text{ minutes}",
        "mnemonics": "At Night, Sleep Descends (EEG waves from alert to deep sleep: **A**lpha -> **N**2 [Spindles] -> **S**low wave [Theta/N1] -> **D**elta). Alternatively: BATS Drink Blood (Alert awake = **B**eta; Relaxed awake = **A**lpha; N1 = **T**heta; N2 = **S**pindles; N3 = **D**elta; REM = **B**eta).",
        "viva": [
            "What are sleep spindles and K-complexes, and where do they occur? **Answer**: Rhythmic bursts of activity (spindles) and high-voltage slow waves (K-complexes) diagnostic of Stage N2 NREM sleep.",
            "Why is REM sleep called 'paradoxical sleep'? **Answer**: Because the EEG is highly active, resembling an alert awake state, yet the person is asleep and their skeletal muscles are completely paralyzed (atonia)."
        ],
        "mcqs": [
            {
                "q": "Which sleep stage is characterized by Delta waves on the EEG?",
                "a": "A) Stage N1", "b": "B) Stage N2", "c": "C) Stage N3", "d": "D) REM sleep",
                "ans": "C", "exp": "Stage N3 (Slow-wave sleep) is characterized by high-voltage, low-frequency delta waves (<4 Hz)."
            }
        ],
        "case": "A patient experiences sudden loss of muscle tone when laughing (cataplexy) and falls asleep during meetings. Spinal tap reveals low hypocretin-1. **Analysis**: Narcolepsy. Hypocretin/orexin stabilization is lost, causing sudden, abnormal transitions directly into REM sleep.",
        "flashcards": [
            {"f": "What EEG wave is characteristic of a relaxed, awake state with eyes closed?", "b": "Alpha waves (8-13 Hz)."},
            {"f": "During which sleep stage does sleepwalking occur?", "b": "Stage N3 NREM (slow-wave sleep)."}
        ]
    },
    "pain-pathways": {
        "title": "Pain Pathways",
        "analogy": "Pain transmission is like a secure gate at a border crossing: nociceptor signals are the alarm signals trying to pass through the gate (spinal dorsal horn). If you rub the skin nearby, you activate friendly traffic (fast tactile fibers) that shuts the gate, preventing the pain alarm from reaching the main computer (brain).",
        "concept": "Nociception is the sensory detection of tissue damage. Pain is carried by two fiber types and modulated at the spinal cord level by the Gate Control Theory.",
        "anatomy": "Nociceptors (free nerve endings), A-delta fibers (myelinated, fast, sharp pain), C fibers (unmyelinated, slow, burning pain), Substantia Gelatinosa (spinal lamina II), Lateral Spinothalamic tract, and Periaqueductal Gray (PAG).",
        "physiology": "First-order pain fibers synapse in the dorsal horn. Second-order fibers decussate immediately in the anterior white commissure and ascend in the lateral spinothalamic tract to the VPL nucleus of the thalamus.",
        "mechanism": "Gate Control Theory: Large $A\\beta$ touch fibers stimulate inhibitory interneurons in the substantia gelatinosa, which presynaptically inhibit the transmission of pain signals from $A\\delta$ and $C$ fibers to second-order projection neurons, 'closing the gate' to pain.",
        "flowchart": """graph TD
    A[Nociceptive Stimulus] -->|Fires| B[Slow C / Fast A-delta fibers]
    B -->|Release Substance P & Glutamate in| C[Spinal Dorsal Horn Lamina II]
    C -->|Excites| D[Second-Order Spinothalamic Neurons]
    D -->|Decussates immediately in| E[Anterior White Commissure]
    E -->|Ascends via| F[Lateral Spinothalamic Tract]
    F -->|Synapses in Thalamus| G[VPL Nucleus]
    G -->|Projects to| H[Somatosensory Cortex]
    I[Rubbing skin activates A-beta fibers] -->|Excites| J[Inhibitory Interneuron in Substantia Gelatinosa]
    J -->|Inhibits| D""",
        "correlation": "Referred Pain occurs because visceral sensory nociceptors and somatic skin nociceptors synapse on the same second-order spinal projection neurons. The brain interprets the visceral signal as originating from the skin (e.g. cardiac ischemia referred to the left arm).",
        "disorders": "1. Neuropathic Pain: Pain caused by a lesion or disease of the somatosensory nervous system (e.g. diabetic neuropathy). 2. Hyperalgesia: Increased sensitivity to pain.",
        "formula": "\\text{Pain Perception} = \\text{Nociceptive Input} \\times (1 - \\text{Endogenous Analgesia Activity})",
        "mnemonics": "A-delta is Acute, C is Chronic (A-delta fibers carry fast, sharp, localized pain; C fibers carry slow, dull, aching, diffuse pain).",
        "viva": [
            "Explain the Gate Control Theory of Pain. **Answer**: Activation of large myelinated touch fibers ($A\\beta$) stimulates inhibitory interneurons in the spinal cord, blocking the transmission of pain signals from smaller $A\\delta$/$C$ fibers to the brain.",
            "What neurotransmitters are involved in descending pain inhibition? **Answer**: Enkephalins, Serotonin, and Norepinephrine, which inhibit primary afferents in the dorsal horn."
        ],
        "mcqs": [
            {
                "q": "Which fibers are unmyelinated and carry slow, burning, poorly-localized pain?",
                "a": "A) A-alpha fibers", "b": "B) A-beta fibers", "c": "C) A-delta fibers", "d": "D) C fibers",
                "ans": "D", "exp": "C fibers are slow, unmyelinated fibers that conduct dull, aching, or burning pain."
            }
        ],
        "case": "A patient with a myocardial infarction presents with pain radiating to his left shoulder and jaw. **Analysis**: Referred pain. Sensory fibers from the heart and somatic dermatomes of the left arm converge on the same spinal second-order spinothalamic neurons (dermatomes T1-T5).",
        "flashcards": [
            {"f": "In which tract does pain and temperature information ascend to the brain?", "b": "The lateral spinothalamic tract."},
            {"f": "What brainstem area is the primary center for descending pain suppression?", "b": "The Periaqueductal Gray (PAG) matter."}
        ]
    }
}

# Directory path
target_dir = "f:/Physiology-app/docs/curriculum"
os.makedirs(target_dir, exist_ok=True)

# Generate rich medical curriculum files for these 34 chapters
for chapter_id, data in chapters_rich_data.items():
    # Deduce section number from filename pattern or mapping
    section_num = "4"
    if chapter_id in ["gas-exchange", "gas-transport", "breathing-regulation", "high-altitude", "pft"]:
        section_num = "5"
    elif chapter_id in ["tubular-reabsorption", "countercurrent", "acid-base", "micturition"]:
        section_num = "6"
    elif chapter_id in ["gi-secretions", "digestion-absorption", "liver-biliary", "gi-hormones"]:
        section_num = "7"
    elif chapter_id in ["hypothalamus-pituitary", "adrenal-gland", "pancreas-diabetes", "calcium-bone", "growth-hormone"]:
        section_num = "8"
    elif chapter_id in ["male-repro", "pregnancy", "lactation"]:
        section_num = "9"
    elif chapter_id in ["motor-system", "sensory-system", "cerebellum", "ans", "higher-functions", "csf-bbb", "eeg-sleep", "pain-pathways"]:
        section_num = "10"
        
    filepath = f"{target_dir}/section{section_num}-{chapter_id}.md"
    
    # Generate content using structured data
    content = f"""# {data['title']}

### 1. Introduction
This chapter covers the physiological principles of {data['title']}.

### 2. Daily Life Analogy
{data['analogy']}

### 3. Basic Concept
{data['concept']}

### 4. Anatomy Review
{data['anatomy']}

### 5. Physiology
{data['physiology']}

### 6. Mechanism
{data['mechanism']}

### 7. Animation
Observe the dynamic changes in this physiological process.
<animation-placeholder />

### 8. Interactive 3D Model
Explore the structural components involved in this process.
<3d-model-placeholder />

### 9. Flowchart
{data['flowchart']}

### 10. Clinical Correlation
{data['correlation']}

### 11. Disorders
{data['disorders']}

### 12. Summary
- Detailed understanding of {data['title']}.
- Review the core feedback mechanisms and regulatory systems.

### 13. Important Formula
$$ {data['formula']} $$

### 14. Mnemonics
- {data['mnemonics']}

### 15. Viva Questions
"""
    for idx, q in enumerate(data['viva']):
        content += f"{idx+1}. {q}\n"
    
    content += "\n### 16. MCQs\n"
    for idx, mcq in enumerate(data['mcqs']):
        content += f"{idx+1}. {mcq['q']}\n"
        content += f"   * {mcq['a']}\n"
        content += f"   * {mcq['b']}\n"
        content += f"   * {mcq['c']}\n"
        content += f"   * {mcq['d']}\n"
        content += f"   *Answer*: {mcq['ans']} ({mcq['exp']})\n\n"
        
    content += f"""### 17. Case-Based Learning
{data['case']}

### 18. Flashcards
"""
    for flash in data['flashcards']:
        content += f"- **Front**: {flash['f']}\n  **Back**: {flash['b']}\n"
        
    content += """
### 19. Revision Notes
- Review clinical correlations and values.

### 20. Practice Quiz
<quiz-placeholder />
"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {chapter_id}.md with complete clinical content.")

print("All 34 remaining chapters successfully fully populated!")
