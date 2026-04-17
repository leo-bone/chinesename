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

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        hasApiKey: !!env.DEEPSEEK_API_KEY 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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
        console.error('DEEPSEEK_API_KEY not configured');
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('Calling DeepSeek API for:', data.englishName);

      // Call DeepSeek API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

      try {
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
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('DeepSeek API error:', response.status, errorText);
          return new Response(JSON.stringify({ 
            error: `DeepSeek API error: ${response.status}`,
            details: errorText
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
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('DeepSeek API timeout');
          return new Response(JSON.stringify({
            error: 'DeepSeek API timeout',
            fallback: true,
            names: generateFallbackNames(data)
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({
        error: error.message || 'Internal server error',
        fallback: true,
        names: generateFallbackNames(data)
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  },
};

// Generate fallback names when API fails
function generateFallbackNames(data) {
  const gender = data.gender || 'neutral';
  const meaning = data.desiredMeaning || 'wisdom';
  
  const maleNames = [
    { chinese: '明远', pinyin: 'Míng Yuǎn', meaning: 'Bright and far-reaching', analysis: '明 means bright, 远 means distant/far' },
    { chinese: '浩然', pinyin: 'Hào Rán', meaning: 'Vast and righteous', analysis: '浩 means vast, 然 means natural/righteous' },
    { chinese: '子轩', pinyin: 'Zǐ Xuān', meaning: 'Son of honor', analysis: '子 means son, 轩 means pavilion/honor' }
  ];
  
  const femaleNames = [
    { chinese: '雨晴', pinyin: 'Yǔ Qíng', meaning: 'Rain clears to sunshine', analysis: '雨 means rain, 晴 means clear/sunny' },
    { chinese: '思雅', pinyin: 'Sī Yǎ', meaning: 'Elegant thoughts', analysis: '思 means think, 雅 means elegant' },
    { chinese: '梦琪', pinyin: 'Mèng Qí', meaning: 'Dream of beautiful jade', analysis: '梦 means dream, 琪 means fine jade' }
  ];
  
  const neutralNames = [
    { chinese: '文轩', pinyin: 'Wén Xuān', meaning: 'Cultural pavilion', analysis: '文 means culture/literature, 轩 means pavilion' },
    { chinese: '思源', pinyin: 'Sī Yuán', meaning: 'Think of the source', analysis: '思 means think, 源 means source/origin' },
    { chinese: '乐天', pinyin: 'Lè Tiān', meaning: 'Optimistic', analysis: '乐 means happy, 天 means sky/heaven' }
  ];
  
  if (gender === 'male') return maleNames;
  if (gender === 'female') return femaleNames;
  return neutralNames;
}
