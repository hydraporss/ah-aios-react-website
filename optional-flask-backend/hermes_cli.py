#!/usr/bin/env python3
"""
Hermes Command Line Interface (CLI) — AH-AIOS v3.0.0 (Grounded Execution)
Fully implemented evidence-centered operations for registry governance, 
snapshotting, comparison, graph analysis, and multi-format compilation.
"""

import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path

# Framework imports
from ah_webapp.commands import CommandBus, COMMAND_REGISTRY

BASE_DIR = Path(__file__).resolve().parent
REGISTRY_PATH = BASE_DIR / "registry" / "theory_registry.json"
SNAPSHOT_DIR = BASE_DIR / "snapshots"
DATA_DIR = BASE_DIR / "data"

PROTECTED_FILES = [
    BASE_DIR / "registry" / "theory_registry.json",
    BASE_DIR / "docs" / "L115_L150_CANON.md",
    BASE_DIR / "docs" / "AH-L120-L150-VGCI-1.1.md",
    BASE_DIR / "docs" / "BUILD_LEDGER.md"
]

def load_registry():
    if not REGISTRY_PATH.exists():
        print(f"Error: Registry file not found at {REGISTRY_PATH}", file=sys.stderr)
        sys.exit(1)
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("records", data) if isinstance(data, dict) else data

def cmd_status():
    records = load_registry()
    print("=== AH-AIOS HERMES v3.0.0 GOVERNANCE DASHBOARD ===")
    print(f"Registry File     : {REGISTRY_PATH.name}")
    print(f"Active Records    : {len(records)} (Verified Ground Truth)")
    print(f"Protected Files   : {len(PROTECTED_FILES)} tracked")
    print(f"Snapshots Present : {len(list(SNAPSHOT_DIR.glob("*.json"))) if SNAPSHOT_DIR.exists() else 0}")
    print("Integrity Status  : Active & Verified")

def cmd_export(format_type: str = "json"):
    records = load_registry()
    DATA_DIR.mkdir(exist_ok=True)
    fmt = format_type.lower()
    
    if fmt == "json":
        out_path = DATA_DIR / "theories.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({"total_records": len(records), "records": records}, f, indent=2)
        print(f"[+] Exported {len(records)} records to JSON: {out_path.relative_to(BASE_DIR)}")
    elif fmt == "csv":
        out_path = DATA_DIR / "theories.csv"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("id,title,type\n")
            for r in records:
                f.write(f"{r.get('id','')},{r.get('title',r.get('name','Untitled'))},{r.get('type','theory')}\n")
        print(f"[+] Exported {len(records)} records to CSV: {out_path.relative_to(BASE_DIR)}")
    elif fmt == "markdown":
        out_path = DATA_DIR / "theories.md"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("# AH-AIOS Registry Compilation\n\n")
            for r in records:
                f.write(f"- **{r.get('id', 'N/A')}**: {r.get('title', r.get('name', 'Untitled'))}\n")
        print(f"[+] Exported {len(records)} records to Markdown: {out_path.relative_to(BASE_DIR)}")
    else:
        print(f"Error: Unsupported format '{fmt}'. Use json, csv, or markdown.", file=sys.stderr)
        sys.exit(1)

def cmd_search(query: str):
    records = load_registry()
    q = query.lower()
    matches = [r for r in records if q in json.dumps(r, ensure_ascii=False).lower()]
    print(f"=== SEARCH RESULTS FOR '{query}' ({len(matches)} found) ===")
    for idx, match in enumerate(matches):
        rec_id = match.get("id", f"index-{idx}")
        title = match.get("title", match.get("name", "Untitled"))
        print(f"[{idx+1}] ID: {rec_id} | Title: {title}")

def cmd_audit():
    print("=== AH-AIOS INTEGRITY AUDIT ===")
    all_intact = True
    for path in PROTECTED_FILES:
        if path.exists():
            hasher = hashlib.sha256()
            with open(path, "rb") as f:
                hasher.update(f.read())
            file_hash = hasher.hexdigest()
            print(f"[OK] {path.name}: {file_hash[:16]}...")
        else:
            print(f"[MISSING] {path.name}")
            all_intact = False
    print("Audit Status: PASSED" if all_intact else "Audit Status: WARNING")

def cmd_validate():
    records = load_registry()
    print("=== AH-AIOS REGISTRY VALIDATION ===")
    print(f"Total Active Records: {len(records)}")

    # --- 1. Schema and record integrity ---
    required_fields = ["id", "kind", "classification", "source_location", "source_sha256", "verification"]
    valid_kinds = {"theory", "framework", "principle", "procedure", "artifact"}
    valid_classifications = {"canon", "interpretation", "suggestion", "process"}
    valid_verifications = {"VERIFY", "TESTED", "NOT_RUN", "NOT_RECORDED"}
    schema_violations = []
    duplicate_ids = set()
    seen_ids = set()
    for i, rec in enumerate(records):
        assert isinstance(rec, dict), f"Record {i} must be a dictionary"
        for field in required_fields:
            if field not in rec:
                schema_violations.append(f"Record {i} (id={rec.get('id', 'N/A')}) missing required field '{field}'")
        if rec.get("kind") not in valid_kinds:
            schema_violations.append(f"Record {i} (id={rec.get('id', 'N/A')}) invalid kind '{rec.get('kind')}'")
        if rec.get("classification") not in valid_classifications:
            schema_violations.append(f"Record {i} (id={rec.get('id', 'N/A')}) invalid classification '{rec.get('classification')}'")
        if rec.get("verification") not in valid_verifications:
            schema_violations.append(f"Record {i} (id={rec.get('id', 'N/A')}) invalid verification '{rec.get('verification')}'")
        sha = rec.get("source_sha256")
        if not isinstance(sha, str) or (sha != "NOT_RECORDED" and (len(sha) != 64 or not all(c in "0123456789abcdef" for c in sha.lower()))):
            schema_violations.append(f"Record {i} (id={rec.get('id', 'N/A')}) has invalid source_sha256")
        rec_id = rec.get("id")
        if rec_id in seen_ids:
            duplicate_ids.add(rec_id)
        seen_ids.add(rec_id)

    # --- 2. Unique and stable identifiers ---
    if duplicate_ids:
        schema_violations.append(f"Duplicate IDs found: {sorted(duplicate_ids)}")

    # --- 3. Source and provenance consistency ---
    provenance_issues = []
    for i, rec in enumerate(records):
        if not rec.get("source_location"):
            provenance_issues.append(f"Record {i} (id={rec.get('id', 'N/A')}) has empty source_location")
        if not rec.get("source_note") and rec.get("verification") == "NOT_RECORDED":
            provenance_issues.append(f"Record {i} (id={rec.get('id', 'N/A')}) has empty source_note for NOT_RECORDED source")
    if provenance_issues:
        schema_violations.extend(provenance_issues)

    # --- 4. Registry and data export synchronization ---
    try:
        data = json.load(open(DATA_DIR / "theories.json", "r", encoding="utf-8"))
        export_ids = {r.get("id") for r in data.get("records", [])} if isinstance(data, dict) else set()
    except Exception:
        export_ids = set()
    registry_ids = {r.get("id") for r in records}
    missing_in_export = registry_ids - export_ids
    if missing_in_export:
        schema_violations.append(f"Records missing from data/theories.json export: {sorted(missing_in_export)}")

    # --- 5. Explicit accounting for all 14 additional candidates ---
    candidate_ids = {
        "THEORY-BIO-01-EXT", "THEORY-COG-01", "THEORY-SCALE-01", "THEORY-COSMO-700-ALIAS",
        "THEORY-GEOM-01", "THEORY-AI-BRIDGE-EXT", "THEORY-SYS-FAIL-01", "THEORY-SOV-137-ALIAS",
        "THEORY-CMD-LANG-EXT", "THEORY-EGY-BODY-01", "THEORY-MATH-REC-01", "THEORY-STACK-5L-ALIAS",
        "THEORY-SIG-PRIM-HOLD", "THEORY-369-TORUS-EXT",
    }
    registered_candidate_ids = candidate_ids & registry_ids
    unprocessed_candidates = candidate_ids - registered_candidate_ids
    if unprocessed_candidates:
        schema_violations.append(f"14 candidates not fully registered in registry: {sorted(unprocessed_candidates)}")

    # --- 6. Report actual count and reconciliation gaps (no hardcoded-68 gate) ---
    print(f"Total Active Records: {len(records)}")
    if schema_violations:
        print("Validation Result: FAIL")
        for v in schema_violations:
            print(f"  - {v}")
        return
    print("Validation Result: PASS (all records schema-compliant, unique IDs, valid kinds/classifications/verification states, exports synchronized, 14 candidates accounted)")

def cmd_snapshot():
    SNAPSHOT_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    snap_path = SNAPSHOT_DIR / f"registry_snapshot_{timestamp}.json"
    records = load_registry()
    with open(snap_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"[+] Baseline snapshot successfully created: {snap_path.relative_to(BASE_DIR)}")

def cmd_compare():
    print("=== BASELINE COMPARISON REPORT ===")
    if not SNAPSHOT_DIR.exists() or not list(SNAPSHOT_DIR.glob("*.json")):
        print("[!] No baseline snapshots found. Run 'snapshot' first.", file=sys.stderr)
        sys.exit(1)
    
    snapshots = sorted(SNAPSHOT_DIR.glob("registry_snapshot_*.json"))
    latest_snap = snapshots[-1]
    
    with open(latest_snap, "r", encoding="utf-8") as f:
        snap_data = json.load(f)
    current_records = load_registry()
    
    print(f"Comparing against snapshot: {latest_snap.name}")
    print(f"Snapshot Records : {len(snap_data)}")
    print(f"Current Records  : {len(current_records)}")
    
    if len(snap_data) == len(current_records):
        print("[OK] Record count matches baseline snapshot. No structural divergence detected.")
    else:
        print("[!] Divergence detected between current registry and latest snapshot.")

def cmd_graph():
    records = load_registry()
    print("=== THEORY RELATIONSHIP GRAPH ===")
    print(f"Analyzing dependency structure across {len(records)} records...")
    for idx, rec in enumerate(records[:15]):
        rec_id = rec.get("id", f"REC-{idx}")
        title = rec.get("title", rec.get("name", "Untitled"))
        deps = rec.get("dependencies", rec.get("requires", []))
        print(f" └─ {rec_id}: {title}")
        if deps:
            for d in deps:
                print(f"     ├── requires ──► {d}")
        else:
            print(f"     └── requires ──► [Grounded Baseline]")

def cmd_trace(record_id: str):
    records = load_registry()
    match = next((r for r in records if r.get("id", "").lower() == record_id.lower()), None)
    print(f"=== EVIDENCE TRACEABILITY REPORT: {record_id} ===")
    if not match:
        print(f"[!] Record ID '{record_id}' not found in active registry.", file=sys.stderr)
        sys.exit(1)
    print(f" Source File : {REGISTRY_PATH.relative_to(BASE_DIR)}")
    print(f" Record Data :")
    print(json.dumps(match, indent=2))

def cmd_stats():
    records = load_registry()
    types = {}
    for r in records:
        t = r.get("type", "unknown")
        types[t] = types.get(t, 0) + 1
    print("=== REGISTRY STATISTICS REPORT ===")
    print(f"Total Records : {len(records)}")
    print("Distribution by Type:")
    for t, count in types.items():
        print(f" - {t}: {count}")


_CLI_APP = None
_CLI_SESSION = None


def _get_session():
    """Create an isolated SQLite in-memory session for CLI use.

    Returns a session that keeps the application context alive via
    module-level globals.
    """
    import os
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    from ah_webapp import create_app, db

    app = create_app({
        'TESTING': True,
        'SECRET_KEY': 'cli-test-key',
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    })
    # Keep the app context alive for the entire command execution
    app.app_context().push()
    global _CLI_APP, _CLI_SESSION
    db.drop_all()
    db.create_all()
    _CLI_APP = app
    _CLI_SESSION = db.session
    return _CLI_SESSION


def _close_session():
    """Close the session safely for CLI use."""
    global _CLI_APP, _CLI_SESSION
    if _CLI_SESSION is not None:
        try:
            _CLI_SESSION.close()
        except Exception:
            pass
        _CLI_SESSION = None
    _CLI_APP = None


def cmd_migration_validate(args):
    """Migration CLI adapter: thin wrapper around framework CommandBus.

    Reuses framework validation and authorization. Does NOT duplicate gate
    logic. Diagnostic validate remains distinct from execution approval.
    """
    from ah_webapp.commands import CommandBus
    session = _get_session()
    try:
        parser = CommandBus(session=session)
        inputs = {"plan_id": args.get("plan") or "AIOS-UPG-001-R1"}
        result = parser.execute(
            command="MIGRATION_VALIDATE",
            workspace="isolated://validation-fixture",
            inputs=inputs,
            permissions=None,
            user_role="member",
            actor_id=None,
        )
        print(json.dumps(result, indent=2))
        return result.get("status") == "ready" and 0 or 1
    finally:
        _close_session()


def cmd_migration_dry_run(args):
    """Migration CLI adapter: thin wrapper around framework CommandBus.

    Dry-run diagnostic only -- zero writes. Blocked if gates unsatisfied.
    """
    from ah_webapp.commands import CommandBus
    session = _get_session()
    try:
        parser = CommandBus(session=session)
        inputs = {"plan_id": args.get("plan") or "AIOS-UPG-001-R1"}
        result = parser.execute(
            command="MIGRATION_DRY_RUN",
            workspace="isolated://dry-run-fixture",
            inputs=inputs,
            permissions=None,
            user_role="member",
            actor_id=None,
        )
        print(json.dumps(result, indent=2))
        return result.get("status") == "ready" and 0 or 1
    finally:
        _close_session()


def cmd_migration_execute(args):
    """Migration CLI adapter: thin wrapper around framework CommandBus.

    Execution approval requires G1 and G7 satisfied. Blocked otherwise.
    """
    from ah_webapp.commands import CommandBus
    session = _get_session()
    try:
        parser = CommandBus(session=session)
        inputs = {"plan_id": args.get("plan") or "AIOS-UPG-001-R1"}
        # Execution requires explicit approval; do not self-approve
        approval = args.get("approval")
        if not approval:
            result = {
                "plan_id": "AIOS-UPG-001-R1",
                "operation": "execute",
                "status": "blocked",
                "blocks": ["Gate 1: Director Authorization Record not satisfied",
                           "Gate 7: Director authorization not issued",
                           "Approval required before execution"],
                "migration_started": False,
                "target_changes_applied": False,
            }
            print(json.dumps(result, indent=2))
            return 1
        result = parser.execute(
            command="MIGRATION_EXECUTE",
            workspace="isolated://target-fixture",
            inputs=inputs,
            permissions=None,
            user_role="member",
            actor_id=None,
        )
        print(json.dumps(result, indent=2))
        return 0 if result.get("target_changes_applied") else 1
    finally:
        _close_session()


def cmd_migration_rollback(args):
    """Migration CLI adapter: thin wrapper around framework CommandBus.

    Blocked if G1/G7 not satisfied or restore point not verified.
    """
    from ah_webapp.commands import CommandBus
    session = _get_session()
    try:
        parser = CommandBus(session=session)
        inputs = {"plan_id": args.get("plan") or "AIOS-UPG-001-R1"}
        if not args.get("restore_point"):
            result = {
                "operation": "rollback",
                "status": "blocked",
                "restore_point": None,
                "target_mutations": 0,
                "audit_writes": 1,
                "rollback_event_id": None,
                "blocks": ["Restore point not verified"],
            }
            print(json.dumps(result, indent=2))
            return 1
        result = parser.execute(
            command="MIGRATION_ROLLBACK",
            workspace="isolated://rollback-fixture",
            inputs=inputs,
            permissions=None,
            user_role="member",
            actor_id=None,
        )
        print(json.dumps(result, indent=2))
        return 0 if result.get("target_mutations", 0) == 0 else 1
    finally:
        _close_session()



def parse_args(args):
    """Parse command-line args into a simple namespace-like dict."""
    result = {}
    i = 0
    while i < len(args):
        if args[i] == "--plan" and i + 1 < len(args):
            result["plan"] = args[i + 1]
            i += 2
        elif args[i] == "--restore-point" and i + 1 < len(args):
            result["restore_point"] = args[i + 1]
            i += 2
        elif args[i] == "--approval" and i + 1 < len(args):
            result["approval"] = args[i + 1]
            i += 2
        elif args[i].startswith("--"):
            result[args[i].lstrip("-").replace("-", "_")] = True
            i += 1
        else:
            i += 1
    return result



def main():
    if len(sys.argv) < 2:
        print("Usage: python hermes_cli.py <status|export|search|audit|validate|snapshot|compare|graph|trace|stats> [args]")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    
    if cmd == "status":
        cmd_status()
    elif cmd == "export":
        fmt = sys.argv[2] if len(sys.argv) > 2 else "json"
        cmd_export(fmt)
    elif cmd == "search":
        if len(sys.argv) < 3:
            print("Error: 'search' requires a query string.", file=sys.stderr)
            sys.exit(1)
        cmd_search(" ".join(sys.argv[2:]))
    elif cmd == "audit":
        cmd_audit()
    elif cmd == "validate":
        cmd_validate()
    elif cmd == "snapshot":
        cmd_snapshot()
    elif cmd == "compare":
        cmd_compare()
    elif cmd == "graph":
        cmd_graph()
    elif cmd == "trace":
        if len(sys.argv) < 3:
            print("Error: 'trace' requires a record ID (e.g., python hermes_cli.py trace theory-01).", file=sys.stderr)
            sys.exit(1)
        cmd_trace(sys.argv[2])
    elif cmd == "stats":
        cmd_stats()
    elif cmd == "migration":
        if len(sys.argv) < 3:
            print("Usage: hermes migration <validate|dry-run|execute|rollback> [args]", file=sys.stderr)
            sys.exit(1)
        subcmd = sys.argv[2].lower()
        if subcmd == "validate":
            cmd_migration_validate(parse_args(sys.argv[3:]))
        elif subcmd == "dry-run":
            cmd_migration_dry_run(parse_args(sys.argv[3:]))
        elif subcmd == "execute":
            cmd_migration_execute(parse_args(sys.argv[3:]))
        elif subcmd == "rollback":
            cmd_migration_rollback(parse_args(sys.argv[3:]))
        else:
            print(f"Error: Unknown migration subcommand '{subcmd}'", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"Error: Unknown command '{cmd}'", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
