from flask import Flask, request, jsonify
from flask_cors import CORS
from nova_act import NovaAct
import re

app = Flask(__name__)
CORS(app)


def parse_numbered_lines(text):
    numbered_lines = []
    for line in text.splitlines():
        if re.match(r"^\d+", line):
            numbered_lines.append(line)
    return numbered_lines


def execute_instructions(instructions, record_video: bool = False) -> dict:
    """Execute a list of instructions using NovaAct"""
    with NovaAct(
        starting_page="https://www.google.com",
        record_video=record_video,
    ) as nova:
        # Split instructions by newlines and filter out empty lines
        instruction_lines = parse_numbered_lines(instructions)

        results = []

        for instruction in instruction_lines:
            clean_instruction = instruction
            if "." in instruction.split(" ")[0]:
                clean_instruction = " ".join(instruction.split(" ")[1:])

            try:
                results.append(nova.act(clean_instruction))
            except Exception:
                print(f"I wasn't able to do:{clean_instruction}")

            results.append(nova.act(clean_instruction))

    return jsonify({"status": "ok", "message": results})


@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({"status": "ok", "message": "Flask backend is running"})


@app.route("/", methods=["POST"])
def handle_instructions():
    data = request.get_json()

    if not data or "instructions" not in data:
        return jsonify({"status": "error", "message": "No instructions provided"}), 400

    instructions = data["instructions"]
    result = execute_instructions(instructions)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
