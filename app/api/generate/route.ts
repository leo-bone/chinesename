import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

interface GenerateRequest {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
  desiredMeaning: string;
  more?: boolean; // If true, generate 9 names instead of 5
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { englishName, gender, age, personality, interests, profession, desiredMeaning, more } = body;

    const count = more ? 9 : 5;

    const prompt = `You are an expert in Chinese naming culture with deep knowledge of classical Chinese literature, philosophy, and character meanings.

Create ${count} personalized Chinese names for a person with the following profile:
- English Name: ${englishName}
- Gender: ${gender}
- Age: ${age}
- Personality: ${personality}
- Interests/Hobbies: ${interests || "Not specified"}
- Profession/Field: ${profession || "Not specified"}
- Desired Meaning: ${desiredMeaning || "Not specified"}

For each name, provide:
1. characters: The Chinese characters (2-3 characters)
2. pinyin: Pinyin with tone marks (e.g., "Zhì Yuǎn")
3. meaning: Brief English meaning (1 sentence)
4. culturalSignificance: Detailed cultural explanation of each character and its significance (2-3 sentences)
5. personalityMatch: Why this name fits the person's personality (1-2 sentences)

Requirements:
- Names should be elegant, meaningful, and culturally appropriate
- Avoid characters with negative connotations or difficult pronunciations
- Consider the person's personality traits and desired meaning
- Include a mix of traditional and modern names
- Ensure names sound harmonious and have good visual balance
${more ? '- These are PREMIUM names - make them EXTRAORDINARY and unique!' : ''}

Return ONLY a valid JSON array in this exact format:
[
  {
    "characters": "志远",
    "pinyin": "Zhì Yuǎn",
    "meaning": "Ambitious and far-reaching",
    "culturalSignificance": "志 (Zhì) represents ambition and willpower...",
    "personalityMatch": "Perfect for someone with big dreams..."
  }
]`;

    const completion = await openai.chat.completions.create({
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
    });

    const content = completion.choices[0].message.content;
    
    // Parse the JSON response
    let names;
    try {
      // Remove any markdown code block markers if present
      const cleanContent = content?.replace(/```json\n?|```\n?/g, "").trim();
      names = JSON.parse(cleanContent || "[]");
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Failed to generate valid names. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ names });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate names. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
