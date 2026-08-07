import sys
import json
from ml_service import run_rf_prediction

def main():
    try:
        if len(sys.argv) > 1:
            input_str = sys.argv[1]
        else:
            input_str = sys.stdin.read()
        
        if not input_str.strip():
            print(json.dumps({"error": "No input JSON provided"}))
            sys.exit(1)

        payload = json.loads(input_str)
        result = run_rf_prediction(payload)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
