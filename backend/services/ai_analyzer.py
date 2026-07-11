import json
import re

from openai import OpenAI

from config import Config

COMMON_SKILLS = [
    "python", "javascript", "react", "node.js", "java", "sql", "mysql",
    "mongodb", "aws", "docker", "kubernetes", "git", "html", "css",
    "typescript", "flask", "django", "fastapi", "rest api", "machine learning",
    "data analysis", "excel", "communication", "leadership", "project management",
    "agile", "scrum", "c++", "c#", ".net", "php", "laravel", "spring boot",
    "tensorflow", "pytorch", "pandas", "numpy", "tableau", "power bi",
]


def _fallback_analysis(resume_text: str) -> dict:
    text_lower = resume_text.lower()
    found_skills = [skill for skill in COMMON_SKILLS if skill in text_lower]

    weak_points = []
    if len(resume_text) < 500:
        weak_points.append("Resume is too short — add more detail about experience and achievements.")
    if not re.search(r"\d+%|\d+\+|increased|reduced|improved|saved", resume_text, re.I):
        weak_points.append("Missing quantifiable achievements — add metrics and numbers.")
    if not re.search(r"project|experience|work", resume_text, re.I):
        weak_points.append("Work experience section is unclear or missing.")
    if len(found_skills) < 3:
        weak_points.append("Very few technical skills detected — highlight relevant skills clearly.")

    questions = [
        "Walk me through your most recent project and your specific contributions.",
        "Describe a challenging problem you solved and how you approached it.",
        "Which skills from your resume do you feel strongest in, and why?",
        "Tell me about a time you had to learn something new quickly for work.",
        "Where do you see gaps in your experience, and how are you addressing them?",
    ]

    score = min(95, 40 + len(found_skills) * 5 + (10 if len(resume_text) > 800 else 0))

    return {
        "skills": found_skills[:15] or ["General professional skills"],
        "weak_points": weak_points or ["Consider adding more specific achievements."],
        "interview_questions": questions,
        "overall_score": score,
        "summary": "Resume analyzed using rule-based fallback. Connect OpenAI API key for deeper AI insights.",
    }


def analyze_resume(resume_text: str) -> dict:
    if not Config.OPENAI_API_KEY:
        return _fallback_analysis(resume_text)

    client = OpenAI(api_key=Config.OPENAI_API_KEY)

    prompt = f"""Analyze this resume and respond ONLY with valid JSON (no markdown):
{{
  "skills": ["skill1", "skill2", ...],
  "weak_points": ["weakness1", "weakness2", ...],
  "interview_questions": ["question1", "question2", ...],
  "overall_score": 75,
  "summary": "Brief 2-3 sentence overall assessment"
}}

Rules:
- Extract 5-15 relevant skills (technical and soft skills)
- List 3-6 specific weak points or improvement areas
- Generate 5-8 tailored interview questions based on resume content
- overall_score: 0-100 based on resume quality
- Be constructive and professional

Resume:
{resume_text[:8000]}
"""

    try:
        response = client.chat.completions.create(
            model=Config.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert HR analyst and career coach. Respond only with valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=1500,
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = re.sub(r"^```(?:json)?\n?", "", content)
            content = re.sub(r"\n?```$", "", content)
        return json.loads(content)
    except Exception:
        return _fallback_analysis(resume_text)
