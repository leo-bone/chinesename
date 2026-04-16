// Cloudflare Worker - API for Chinese Name Generator

export default {
  async fetch(request, env) {
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

    // Route: /api/generate
    if (url.pathname === '/api/generate' || url.pathname === '/api/generate/') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
          status: 405, 
          headers: corsHeaders 
        });
      }
      return handleGenerate(request, env, corsHeaders);
    }

    // Default: 404
    return new Response('Not Found', { 
      status: 404, 
      headers: corsHeaders 
    });
  },
};

async function handleGenerate(request, env, corsHeaders) {
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
              content: `你是一位精通中国古典文学、音韵学与现代命名美学的专家。请为外国友人取有格调、朗朗上口、令人过目难忘的中文名。

## 核心原则

**1. 音韵第一**
名字的读音必须优美动听，这是最重要的标准：
- 声调搭配：平仄相间，避免双三声（如"李雨羽"lǐ yǔ yǔ → 拗口）
- 尾音选择：优先开口音（ang, eng, ing, ong, ao, ou），响亮且有余韵
- 声母搭配：避免绕口组合（如"诗舒"shī shū → 不顺）
- 整体节奏：读起来像一句短诗，有抑扬顿挫之美

**2. 格调与气质**
- 男名：大气、沉稳、有格局，可略带书卷气或洒脱感
- 女名：优雅、灵动、有韵味，可飒爽可温婉，但绝不甜腻
- 避免：俗气字（伟、强、芳、丽）、网红字（梓、涵泛滥）、生僻字

**3. 意境与出处**
- 每个名字必须有明确的古典出处（诗经、楚辞、唐诗、宋词）
- 意境要美：或山水、或星辰、或品德、或才情
- 现代解读要贴切：让外国人能理解和认同这个名字的气质

**4. 书写美感**
- 字形结构平衡：左右结构+上下结构搭配
- 笔画适中：8-15画为佳
- 辨识度高：不选易混淆的字

## 音韵优美的秘诀

**好听的声调组合（按优先级）：**
1. 二声+一声（扬→平）：如"承宇"chéng yǔ
2. 四声+二声（降→扬）：如"牧遥"mù yáo
3. 一声+二声（平→扬）：如"知遥"zhī yáo
4. 三声+四声（转→降）：如"雨墨"yǔ mò

**好听的尾音字：**
- 男名：遥、行、深、澄、昂、朗、昀、辰、宇、墨
- 女名：瑶、言、溪、澄、昀、昭、然、初、宜、徽

## 格调范例

**男性（大气洒脱）：**
- 牧遥（mù yáo）→ 四声+二声，降后扬起，尾音悠扬。《清明》意境，自由洒脱
- 景澄（jǐng chéng）→ 三声+二声，转折上扬。"景星庆云，澄江如练"，光明磊落
- 闻溪（wén xī）→ 二声+一声，扬后平稳。王维诗意，清雅脱俗
- 承宇（chéng yǔ）→ 二声+三声，先扬后转。《楚辞》"云霏霏而承宇"，气度不凡
- 望舒（wàng shū）→ 四声+一声，降后平稳。《离骚》月神，诗意浪漫

**女性（优雅灵动）：**
- 知遥（zhī yáo）→ 一声+二声，平扬搭配。知性且心怀远方
- 云溪（yún xī）→ 二声+一声，悠扬流畅。山水意境，清新自然
- 念澄（niàn chéng）→ 四声+二声，降扬有致。心思澄明，通透智慧
- 昭宜（zhāo yí）→ 一声+二声，明亮温婉。光明磊落，宜家宜室
- 言徽（yán huī）→ 二声+一声，文雅动听。"弦徽"谐音，才情出众

## 输出要求

生成5个名字，每个包含：
1. characters: 汉字（2字）
2. pinyin: 拼音带声调
3. meaning: 英文释义（简洁有格调）
4. source: 古典出处（诗词篇名+原句）
5. personalityMatch: 为何适合此人（突出气质匹配）

只返回JSON数组。`
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
  }
