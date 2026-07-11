import json
import os
import sys
from io import BytesIO

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from utils.pdf_parser import extract_contact_info, extract_text_from_pdf
from services.ai_analyzer import analyze_resume

def handler(event, context):
    try:
        if event['httpMethod'] != 'POST':
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        # Parse body
        body = json.loads(event['body'])
        
        # For now, we'll need the file content in a specific format
        # This is a simplified version - in production you'd handle multipart properly
        if 'resume_text' not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'resume_text is required'})
            }
        
        resume_text = body['resume_text']
        
        if not resume_text or len(resume_text) < 50:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Resume text too short'})
            }
        
        contact = extract_contact_info(resume_text)
        analysis = analyze_resume(resume_text)
        
        result = {
            'success': True,
            'data': {
                'candidate_name': contact.get('candidate_name'),
                'email': contact.get('email'),
                'skills': analysis.get('skills', []),
                'weak_points': analysis.get('weak_points', []),
                'interview_questions': analysis.get('interview_questions', []),
                'overall_score': analysis.get('overall_score'),
                'summary': analysis.get('summary')
            }
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
