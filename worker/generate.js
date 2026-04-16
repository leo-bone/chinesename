// Cloudflare Worker - API for Chinese Name Generator

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle /api/generate
    if (url.pathname !== '/api/generate') {
      return new Response('Not Found', { status: 404 });
    }

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
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      
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
              content: `You are a Chinese naming expert. Generate 3-5 unique Chinese names based on the user's profile.
For each name, provide: Chinese characters, Pinyin, Meaning, and Character analysis.
Respond in JSON format: {"names": [{"chinese": "...", "pinyin": "...", "meaning": "...", "analysis": "..."}]}`
            },
            {
              role: 'user',
              content: `Generate a Chinese name for: ${JSON.stringify(data)}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.8,
        }),
      });

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || '';
      
      let names;
      try {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        names = JSON.parse(jsonMatch[1] || content).names || [];
      } catch {
        names = [{ raw: content }];
      }

      return new Response(JSON.stringify({ names }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
