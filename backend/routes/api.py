import os
from io import BytesIO
from uuid import uuid4

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from config import Config
from models import ResumeAnalysis, db
from services.ai_analyzer import analyze_resume
from utils.pdf_parser import extract_contact_info, extract_text_from_pdf

api = Blueprint("api", __name__)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS


@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "AI Resume Analyzer API is running"})


@api.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided. Use field name 'resume'."}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        file_bytes = file.read()
        resume_text = extract_text_from_pdf(BytesIO(file_bytes))

        if not resume_text or len(resume_text) < 50:
            return jsonify({"error": "Could not extract enough text from PDF. Try a text-based PDF."}), 400

        contact = extract_contact_info(resume_text)
        analysis = analyze_resume(resume_text)

        safe_name = secure_filename(file.filename) or f"resume_{uuid4().hex}.pdf"
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        save_path = os.path.join(Config.UPLOAD_FOLDER, f"{uuid4().hex}_{safe_name}")
        with open(save_path, "wb") as f:
            f.write(file_bytes)

        record = ResumeAnalysis(
            filename=safe_name,
            candidate_name=contact.get("candidate_name"),
            email=contact.get("email"),
            resume_text=resume_text[:10000],
            skills=analysis.get("skills", []),
            weak_points=analysis.get("weak_points", []),
            interview_questions=analysis.get("interview_questions", []),
            overall_score=analysis.get("overall_score"),
            summary=analysis.get("summary"),
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({"success": True, "data": record.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@api.route("/history", methods=["GET"])
def history():
    limit = min(int(request.args.get("limit", 20)), 100)
    records = (
        ResumeAnalysis.query.order_by(ResumeAnalysis.created_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"success": True, "data": [r.to_dict() for r in records]})


@api.route("/history/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    record = ResumeAnalysis.query.get_or_404(analysis_id)
    return jsonify({"success": True, "data": record.to_dict()})


@api.route("/history/<int:analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    record = ResumeAnalysis.query.get_or_404(analysis_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"success": True, "message": "Analysis deleted"})
