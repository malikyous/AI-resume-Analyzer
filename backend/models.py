from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ResumeAnalysis(db.Model):
    __tablename__ = "resume_analyses"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    candidate_name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    resume_text = db.Column(db.Text, nullable=True)
    skills = db.Column(db.JSON, nullable=True)
    weak_points = db.Column(db.JSON, nullable=True)
    interview_questions = db.Column(db.JSON, nullable=True)
    overall_score = db.Column(db.Integer, nullable=True)
    summary = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "candidate_name": self.candidate_name,
            "email": self.email,
            "skills": self.skills or [],
            "weak_points": self.weak_points or [],
            "interview_questions": self.interview_questions or [],
            "overall_score": self.overall_score,
            "summary": self.summary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
