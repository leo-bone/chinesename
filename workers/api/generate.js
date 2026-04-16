// Cloudflare Worker - API for Chinese Name Generator
// Deployed as: chinesename-api

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
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

    // Only handle /api/generate
    if (url.pathname !== '/api/generate') {
      return new Response(JSON.stringify({ error: 'Not Found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const data = await request.json();
      
      // Validate API key
      const apiKey = env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a Chinese naming expert. Generate 3-5 unique Chinese names based on the user's profile.

For each name, provide:
1. Chinese characters (中文名)
2. Pinyin pronunciation (拼音)
3. Meaning explanation (寓意)
4. Character analysis (字形分析)

Response format (JSON):
{
  "names": [
    {
      "chinese": "...",
      "pinyin": "...",
      "meaning": "...",
      "analysis": "..."
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Generate a Chinese name for someone with:
- English name: ${data.englishName || 'Unknown'}
- Gender: ${data.gender || 'Not specified'}
- Age: ${data.age || 'Not specified'}
- Personality: ${data.personality || 'Not specified'}
- Interests: ${data.interests || 'Not specified'}
- Profession: ${data.profession || 'Not specified'}
- Desired meaning: ${data.desiredMeaning || 'wisdom and good fortune'}
${data.more ? '\n- Generate more unique options' : ''}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
        return new Response(JSON.stringify({ 
          error: `DeepSeek API error: ${response.status}` 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || '';

      // Try to parse JSON from response
      let names;
      try {
        // Extract JSON from potential markdown code block
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const jsonStr = jsonMatch[1] || content;
        const parsed = JSON.parse(jsonStr);
        names = parsed.names || parsed;
      } catch (e) {
        console.error('JSON parse error:', e);
        // If JSON parsing fails, return as text
        names = [{ raw: content }];
      }

      return new Response(JSON.stringify({ names }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({
        error: error.message || 'Internal server error',
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
