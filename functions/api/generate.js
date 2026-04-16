// Cloudflare Pages Function - API for Chinese Name Generator

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST for /api/generate
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const data = await request.json();

    // Get API key from environment
    const apiKey = env.DEEPSEEK_API_KEY || env.DEEP_SEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
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
- English name: ${data.englishName}
- Gender: ${data.gender}
- Age: ${data.age}
- Personality: ${data.personality}
- Interests: ${data.interests}
- Profession: ${data.profession}
- Desired meaning: ${data.desiredMeaning || 'wisdom and good fortune'}
${data.more ? '\n- Generate more unique options' : ''}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
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
    } catch {
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
};
