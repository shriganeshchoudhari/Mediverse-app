import os
import re

def audit_curriculum():
    curr_dir = 'docs/curriculum'
    files = [f for f in os.listdir(curr_dir) if f.endswith('.md')]
    print(f"Found {len(files)} curriculum markdown files in {curr_dir}.")

    stats = {
        'total_files': len(files),
        'total_lines': 0,
        'total_words': 0,
        'files_with_katex': 0,
        'files_with_competencies': 0,
        'files_with_clinical_vignettes': 0,
        'files_with_3d_references': 0
    }

    competencies_found = set()

    for f in sorted(files):
        p = os.path.join(curr_dir, f)
        with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
            text = fp.read()

        stats['total_lines'] += len(text.splitlines())
        stats['total_words'] += len(text.split())

        # Check KaTeX ($...$ or $$...$$)
        if re.search(r'\$[^\$]+\$', text):
            stats['files_with_katex'] += 1

        # Check NMC CBME Competencies (PY1.1..PY11.14 or similar)
        comps = re.findall(r'\b(PY\d+\.\d+|AN\d+\.\d+|BI\d+\.\d+|PA\d+\.\d+|PH\d+\.\d+|MED\d+\.\d+)\b', text)
        if comps:
            stats['files_with_competencies'] += 1
            for c in comps:
                competencies_found.add(c)

        # Check Clinical Vignettes / Cases
        if re.search(r'(clinical|vignette|case|patient|presentation|diagnosis)', text, re.IGNORECASE):
            stats['files_with_clinical_vignettes'] += 1

        # Check 3D / Organ references
        if re.search(r'(3d|organ|cardiovascular|heart|renal|kidney|respiratory|lung|neuron|glom|ventricle)', text, re.IGNORECASE):
            stats['files_with_3d_references'] += 1

    print("\n--- CURRICULUM AUDIT RESULTS ---")
    print(f"Total Curriculum Files: {stats['total_files']}")
    print(f"Total Lines: {stats['total_lines']:,}")
    print(f"Total Words: {stats['total_words']:,}")
    print(f"Files with KaTeX Math/Biochemical Formulas: {stats['files_with_katex']} / {stats['total_files']} ({stats['files_with_katex']/stats['total_files']*100:.1f}%)")
    print(f"Files with NMC CBME Competency Codes: {stats['files_with_competencies']} / {stats['total_files']} ({stats['files_with_competencies']/stats['total_files']*100:.1f}%)")
    print(f"Files with Clinical Case Scenarios: {stats['files_with_clinical_vignettes']} / {stats['total_files']} ({stats['files_with_clinical_vignettes']/stats['total_files']*100:.1f}%)")
    print(f"Files with 3D Organ / Anatomical Bindings: {stats['files_with_3d_references']} / {stats['total_files']} ({stats['files_with_3d_references']/stats['total_files']*100:.1f}%)")
    print(f"Unique Competencies Mapped: {len(competencies_found)}")
    print(f"Sample Competencies: {sorted(list(competencies_found))[:10]}")

if __name__ == '__main__':
    audit_curriculum()
