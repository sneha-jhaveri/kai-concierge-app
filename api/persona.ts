export interface PersonaSummary {
  key_insights: string[];
  demographics: string;
  personality: string;
  interests: string;
  shopping: string;
  recommendations: string;
  total_sections: number;
}

export interface PersonaResponse {
  full_analysis: string;
  summary: PersonaSummary;
}

export const generatePersona = async (
  platform: 'instagram' | 'twitter' | 'linkedin',
  username: string
): Promise<PersonaResponse> => {
  const response = await fetch(
    `https://v0-brightdata-api-examples.vercel.app/api/scrape/${platform}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    }
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
