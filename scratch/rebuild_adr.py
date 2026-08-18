import re
import os

def read_adr_file():
    with open('docs/ADR.md', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    return text

def main():
    text = read_adr_file()
    pattern = r'(?=(?:^|\n)(?:#\s+Part\s+[IVXLCDM]+[^\n]*\n+)?#\s+ADR-\d+\s+[—–-][^\n]+)'
    raw_sections = [s.strip() for s in re.split(pattern, text) if s.strip()]

    by_id = {}
    for sec in raw_sections:
        m = re.search(r'#\s+(ADR-\d+)\s+[—–-]\s*([^\n]+)', sec)
        if m:
            adr_id = m.group(1)
            title = m.group(2).strip()
            # Clean title
            title = re.sub(r'\s*-\s*Part\s+\d+\s+Complete.*$', '', title, flags=re.IGNORECASE)
            title = re.sub(r'\s*COMPLETE\s*\??', '', title, flags=re.IGNORECASE).strip()
            if adr_id not in by_id:
                by_id[adr_id] = []
            by_id[adr_id].append((title, len(sec), sec))

    print(f"Total raw sections: {len(raw_sections)}")
    print(f"Unique ADR IDs parsed: {len(by_id)}")
    for k in sorted(by_id.keys(), key=lambda x: int(x.split('-')[1])):
        copies = by_id[k]
        best = sorted(copies, key=lambda x: x[1], reverse=True)[0]
        print(f"{k}: chosen title='{best[0]}', length={best[1]}, total_copies={len(copies)}")

if __name__ == '__main__':
    main()
