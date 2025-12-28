
import { GoogleGenAI, Type } from "@google/genai";
import { Booking, TicketType } from "../types";

// Initialize with direct process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseBookingImage = async (base64Image: string): Promise<Booking[]> => {
  const prompt = `
    Extract all booking details from this table image into a JSON list.
    Ignore "S.NO" and "TAX".
    
    Mapping rules:
    - Guest Name -> name
    - Contact No -> phone
    - PAX -> totalPax (integer, represents total heads)
    - Group Type -> Parse into a dictionary called "tickets". 
      Examples: 
      "1 couple 2stag" -> tickets: { "Couple": 1, "Stag": 2 }
      "Angels" -> tickets: { "Angels": 1 } (Note: Angels usually implies 2 pax)
      "couples" -> tickets: { "Couple": 1 }
    - Advance -> amountPaid (number)
    - Remarks -> use to find total value. 
      "fully paid" means amountPaid = totalCost.
      "bal 2000 pending" means totalCost = amountPaid + 2000.
    
    Return a JSON array of objects fitting this structure:
    { "name": string, "phone": string, "tickets": { "Stag"?: number, "Couple"?: number, "Angels"?: number }, "totalPax": number, "amountPaid": number, "totalCost": number, "amountPending": number }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Updated to correct contents object structure with parts array
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image.split(',')[1] || base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              tickets: {
                type: Type.OBJECT,
                properties: {
                  [TicketType.STAG]: { type: Type.INTEGER },
                  [TicketType.COUPLE]: { type: Type.INTEGER },
                  [TicketType.ANGELS]: { type: Type.INTEGER },
                }
              },
              totalPax: { type: Type.INTEGER },
              amountPaid: { type: Type.NUMBER },
              totalCost: { type: Type.NUMBER },
              amountPending: { type: Type.NUMBER },
            },
            required: ["name", "phone", "tickets", "totalPax", "amountPaid", "totalCost", "amountPending"],
          },
        },
      },
    });

    // .text is a property
    const responseText = response.text;
    const parsedData = JSON.parse(responseText || '[]');
    return parsedData.map((item: any) => ({
      ...item,
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error("Vision API Error:", error);
    throw new Error("Failed to scan. Ensure image is clear.");
  }
};
