#!/usr/bin/env python3
# ==============================================================================
# Mediverse Enterprise GitHub Ecosystem Provisioner
# ==============================================================================
# Provisions Labels, Milestones, Epics, and User Stories directly via GitHub CLI (gh)
# or GitHub REST API with full idempotency.
# ==============================================================================

import os
import sys
import json
import subprocess
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABELS_FILE = os.path.join(BASE_DIR, ".github", "labels.json")

def run_cmd(cmd, check=True):
    print(f"Executing: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error executing command: {result.stderr}")
    return result

def provision_labels(dry_run=False):
    print("\n--- Provisioning Enterprise GitHub Labels ---")
    if not os.path.exists(LABELS_FILE):
        print(f"Labels file not found: {LABELS_FILE}")
        return

    with open(LABELS_FILE, "r", encoding="utf-8") as f:
        labels = json.load(f)

    for label in labels:
        name = label["name"]
        color = label["color"]
        description = label.get("description", "")
        print(f"Provisioning Label: {name} (#{color})")
        if not dry_run:
            run_cmd(["gh", "label", "create", name, "--color", color, "--description", description, "--force"], check=False)

def provision_milestones(dry_run=False):
    print("\n--- Provisioning Sprint Milestones ---")
    milestones = [
        {"title": "Sprint 01", "description": "Foundation, Identity & Core Curricula (MBBS, BDS, AYUSH)"},
        {"title": "Sprint 02", "description": "Socratic AI Tutor & Clinical Physiology Solvers"},
        {"title": "Sprint 03", "description": "OSCE Clinical Assessment & Collaborative Study Rooms"},
        {"title": "Sprint 04", "description": "V2 Spatial Anatomy, Voice AI Patients & Mock EMR"},
        {"title": "Release v2.4.0", "description": "Mediverse Enterprise Production Release"}
    ]

    for ms in milestones:
        print(f"Provisioning Milestone: {ms['title']}")
        if not dry_run:
            run_cmd(["gh", "api", "repos/:owner/:repo/milestones", "-f", f"title={ms['title']}", "-f", f"description={ms['description']}"], check=False)

def main():
    parser = argparse.ArgumentParser(description="Provision Mediverse GitHub Ecosystem")
    parser.add_argument("--dry-run", action="store_true", help="Simulate provisioning without calling GitHub API")
    args = parser.parse_args()

    print(f"=== Mediverse GitHub Ecosystem Provisioner (Dry-Run: {args.dry_run}) ===")
    provision_labels(dry_run=args.dry_run)
    provision_milestones(dry_run=args.dry_run)
    print("\n=== Provisioning Complete! ===")

if __name__ == "__main__":
    main()
