
import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure API keys are handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCastingFeedback = async (name: string, bio: string): Promise<string> => {
  try {
    const prompt = `
      You are an elite Hollywood Casting Director for a futuristic sci-fi franchise.
      The applicant's name is ${name}.
      Their bio/experience is: "${bio}".
      
      Provide a brief, encouraging, yet professional assessment (max 3 sentences) on how they might fit into a futuristic/cyberpunk setting. 
      Use a futuristic, slightly dramatic tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Feedback generation complete.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Transmission interrupted. AI Analysis offline.";
  }
};

export const generateSponsorResponse = async (companyName: string, message: string): Promise<string> => {
    try {
        const prompt = `
            Draft a formal, professional, and polite acknowledgement email response for a potential corporate sponsor named "${companyName}".
            They wrote: "${message}".
            The tone must be formal business communication.
            Keep it under 50 words. Mention "AI Impact Media".
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Thank you for your submission.";
    } catch (e) {
        return "Thank you for contacting AI Impact Media. We have received your inquiry.";
    }
}

export const generateMotivationalQuote = async (): Promise<string> => {
    try {
        const prompt = "Generate a short, powerful, 5-word motivational quote about the future, actors, cinema, or dreams. Futuristic tone. Plain text only.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text?.replace(/"/g, '') || "THE FUTURE IS YOURS";
    } catch (e) {
        return "CREATE YOUR DESTINY";
    }
}

// --- NEW INTELLIGENCE FEATURES ---

export const generateSystemHealthReport = async (stats: { submissions: number, platforms: any }): Promise<string> => {
  try {
    const prompt = `
      You are the AI System Administrator (Core AI) for "AI Impact Media".
      Analyze the current system telemetry:
      - Total Casting Submissions: ${stats.submissions}
      - Platform Distribution: ${JSON.stringify(stats.platforms)}
      - Server Latency: 42ms (Nominal)
      - Database Integrity: 100%

      Provide a high-level "System Intelligence Report" (max 60 words).
      Identify trends in the platform distribution (e.g., if Instagram is high, mention social engagement).
      Use a highly technical, sci-fi/cyberpunk tone (e.g., "Mainframe optimal", "Data flux detected").
    `;

    // Use Gemini 1.5 Pro (or latest Pro preview) for complex reasoning/analysis
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "System Nominal. AI Monitoring Active.";
  } catch (error) {
    console.error("Gemini System Report Error:", error);
    return "Error: Unable to interface with Core AI.";
  }
};

export const generateCandidateAnalysis = async (bio: string): Promise<string> => {
  try {
    const prompt = `
      Analyze this candidate bio for potential "Star Power" in a sci-fi universe: "${bio}".
      Give a concise, 1-sentence "Scout Assessment" highlighting their unique vibe.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "Assessment pending.";
  } catch (e) {
    return "Data corrupted.";
  }
};

export const generateMonologueScript = async (): Promise<string> => {
  try {
    const prompt = `
      Write a short, intense 3-line sci-fi monologue for an actor to perform.
      Context: A rogue hacker warning the resistance about an imminent system purge.
      No stage directions, just the dialogue.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "System failure. Improvise.";
  } catch (e) {
    return "Could not generate script.";
  }
};
