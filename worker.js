// Cloudflare Worker - API for Chinese Name Generator

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const data = await request.json();
      
      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a Chinese name generation expert. Generate 5 personalized Chinese names based on user information.
              
For each name, provide:
1. characters: The Chinese characters (2 characters)
2. pinyin: Pinyin with tones (e.g., "Zhì Yuǎn")
3. meaning: Brief English meaning
4. culturalSignificance: Cultural/historical significance of the characters
5. personalityMatch: Why this name fits the person's personality

Return ONLY a JSON array in this exact format:
[
  {
    "characters": "志远",
    "pinyin": "Zhì Yuǎn",
    "meaning": "Ambitious and far-reaching",
    "culturalSignificance": "志 represents ambition, 远 represents distant goals",
    "personalityMatch": "Perfect for someone with big dreams"
  }
]`
            },
            {
              role: 'user',
              content: `Generate Chinese names for:
- English name: ${data.englishName}
- Gender: ${data.gender}
- Age: ${data.age}
- Personality: ${data.personality}
- Interests: ${data.interests}
- Profession: ${data.profession}
- Desired meaning: ${data.desiredMeaning}`
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${error}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      // Parse JSON from response
      let names;
      try {
        // Try to extract JSON if wrapped in markdown
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                         content.match(/```\n?([\s\S]*?)\n?```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        names = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse JSON:', content);
        throw new Error('Invalid response format from AI');
      }

      return new Response(JSON.stringify({ names }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
