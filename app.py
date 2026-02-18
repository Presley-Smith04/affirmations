#general imports
from flask import Flask, render_template, request, jsonify
import json
import random


app = Flask(__name__)


#load affirmations once
with open("affirmations.json", "r") as f:
    affirmations = json.load(f)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    category = data.get("category")
    mode = data.get("mode", "angel")

    filename = "negative-affirmations.json" if mode == "devil" else "affirmations.json"

    with open(filename, "r") as f:
        affirmations_data = json.load(f)

    affirmation_list = affirmations_data.get(category, [])

    if not affirmation_list:
        return jsonify({"error": f"Invalid category: {category}"}), 400

    affirmation = random.choice(affirmation_list)
    return jsonify({"affirmation": affirmation})

if __name__ == "__main__":
    app.run(debug=True)