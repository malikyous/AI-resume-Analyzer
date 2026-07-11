const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export async function analyzeResume(resumeText) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to environment variables.')
  }

  const prompt = `Analyze this resume and respond ONLY with valid JSON (no markdown):
{
  "skills": ["skill1", "skill2", ...],
  "weak_points": ["weakness1", "weakness2", ...],
  "interview_questions": ["question1", "question2", ...],
  "overall_score": 75,
  "summary": "Brief 2-3 sentence overall assessment"
}

Rules:
- Extract 5-15 relevant skills (technical and soft skills)
- List 3-6 specific weak points or improvement areas
- Generate 5-8 tailored interview questions based on resume content
- overall_score: 0-100 based on resume quality
- Be constructive and professional

Resume:
${resumeText.slice(0, 8000)}
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert HR analyst and career coach. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    let content = data.choices[0].message.content.trim()
    
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }
    
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`)
  }
}
