interface Env {
  DEEPSEEK_API_KEY: string;
}

interface GenerateRequest {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
  desiredMeaning: string;
  more?: boolean;
}

function getPersonalityKeywords(personality: string): string {
  const personalityMap: Record<string, string> = {
    "creative": "artistic expression, imagination, innovation, beauty",
    "adventurous": "courage, exploration, freedom, journey",
    "intellectual": "wisdom, knowledge, learning, insight",
    "compassionate": "kindness, love, harmony, empathy",
    "confident": "strength, leadership, achievement, excellence",
    "peaceful": "tranquility, harmony, balance, nature",
    "ambitious": "achievement, success, aspiration, determination",
    "playful": "joy, happiness, vitality, spontaneity",
    "reserved": "wisdom, depth, contemplation, inner strength",
    "energetic": "vitality, dynamism, enthusiasm, action",
    "analytical": "clarity, precision, insight, reason",
    "intuitive": "perception, wisdom, insight, spiritual depth",
    "practical": "stability, reliability, groundedness, wisdom",
    "romantic": "love, beauty, passion, emotion",
    "logical": "wisdom, clarity, order, reason",
    "empathetic": "compassion, kindness, harmony, understanding",
    "bold": "courage, strength, leadership, determination",
    "gentle": "grace, kindness, beauty, tranquility",
    "witty": "intelligence, humor, cleverness, insight",
    "serious": "depth, wisdom, commitment, dedication"
  };
  
  const lowerPersonality = personality.toLowerCase();
  for (const key of Object.keys(personalityMap)) {
    if (lowerPersonality.includes(key)) {
      return personalityMap[key];
    }
  }
  return "unique character, positive virtue, personal strength";
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const body: GenerateRequest = await request.json();
    const { englishName, gender, age, personality, interests, profession, desiredMeaning, more } = body;

    const count = more ? 9 : 5;

    const prompt = `You are a master of Chinese naming traditions with deep expertise in classical poetry, philosophy, mythology, and modern naming trends.

Create ${count} highly personalized Chinese names that are TAILORED specifically to this individual:
- English Name: ${englishName}
- Gender: ${gender}
- Age: ${age}
- Personality: ${personality}
- Interests/Hobbies: ${interests || "Not specified"}
- Profession/Field: ${profession || "Not specified"}
- Desired Meaning: ${desiredMeaning || "Not specified"}

## Naming Strategy

For FREE names (5 names):
- Choose characters that directly relate to: ${personality} personality, ${interests || "interests"}, ${profession || "profession"}
- Use common but meaningful characters
- Focus on straightforward positive meanings

${more ? `For PREMIUM names (9 names) - make them EXTRAORDINARY:
- Explore niche, literary characters not commonly used
- Incorporate classical poetry references
- Use metaphor and symbolism from nature, mythology, or virtue
- Create names that sound unique and memorable
- Consider characters with multiple layers of meaning
- Include at least 2-3 names with rare/elegant character combinations
- Each name should feel like a precious discovery, not a common choice` : ''}

## Character Selection Guidelines

For each name, pick characters based on these PERSONAL traits:
${personality ? `- Personality "${personality}": Choose characters representing: ${getPersonalityKeywords(personality)}` : ""}
${interests ? `- Interests "${interests}": Incorporate themes related to: ${interests}` : ""}
${profession ? `- Profession "${profession}": Consider characters that reflect wisdom, skill, or ambition related to: ${profession}` : ""}
${desiredMeaning ? `- Desired meaning "${desiredMeaning}": Find characters embodying: ${desiredMeaning}` : ""}

## Output Format
Return ONLY a valid JSON array with ${count} names:
[
  {
    "characters": "志远",
    "pinyin": "Zhì Yuǎn",
    "meaning": "Ambitious and far-reaching",
    "culturalSignificance": "志 represents ambition and willpower; 远 means distant/future-oriented. Together, it embodies the virtue of aspiring to great things while maintaining vision.",
    "personalityMatch": "Perfect for someone with ${personality} personality who desires ${desiredMeaning || "ambition and achievement"}"
  }
]

## Critical Rules
- EVERY name must directly connect to the person's UNIQUE traits (personality, interests, profession)
- Avoid generic names that could fit anyone
- Each name should feel personally crafted for this individual
- Ensure variety: different themes, different tones, different character structures`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a Chinese naming expert. Always respond with valid JSON only, no markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const completion = await response.json();
    const content = completion.choices[0].message.content;
    
    let names;
    try {
      const cleanContent = content?.replace(/```json\n?|```\n?/g, "").trim();
      names = JSON.parse(cleanContent || "[]");
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to generate valid names. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ names }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate names. Please check your API key and try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
