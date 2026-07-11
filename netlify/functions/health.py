import json

def handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps({
            'status': 'ok',
            'message': 'AI Resume Analyzer API is running'
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
