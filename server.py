from flask import Flask, request, send_from_directory, jsonify
from pathlib import Path
import csv
import json
from datetime import datetime

BASE_DIR  = Path(__file__).resolve().parent
CSV_FILE  = BASE_DIR / "evenements.csv"
LOG_FILE  = BASE_DIR / "events_log.jsonl"

app = Flask(__name__)

def ensure_csv():
    if not CSV_FILE.exists():
        with CSV_FILE.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["nom", "date", "duree_min", "type", "fait", "logged_at"])

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/log", methods=["POST"])
def log_event():
    ensure_csv()
    data  = request.get_json(silent=True) or {}
    items = data.get("events", [])

    if not isinstance(items, list):
        return jsonify({"ok": False, "error": "events must be a list"}), 400

    logged_count = 0

    with CSV_FILE.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for item in items:
            nom    = str(item.get("name",     "")).strip()
            date   = str(item.get("date",     "")).strip()
            duree  = item.get("duration", "")
            evtype = str(item.get("type",     "")).strip()
            fait   = bool(item.get("done",   False))
            logged_at = datetime.now().isoformat(timespec="seconds")

            if not nom or not date:
                continue

            writer.writerow([nom, date, duree, evtype, "oui" if fait else "non", logged_at])

            with LOG_FILE.open("a", encoding="utf-8") as logf:
                logf.write(json.dumps({
                    "name": nom, "date": date, "duration": duree,
                    "type": evtype, "done": fait, "logged_at": logged_at
                }, ensure_ascii=False) + "\n")

            logged_count += 1

    return jsonify({"ok": True, "logged": logged_count})

@app.route("/health")
def health():
    return jsonify({"ok": True})

if __name__ == "__main__":
    ensure_csv()
    print("\n✅  Serveur démarré → http://127.0.0.1:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=False)
