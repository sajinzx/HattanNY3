
import { GoogleGenAI } from "@google/genai";
import { Booking } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartInsights = async (bookings: Booking[]) => {
  if (bookings.length === 0) return "Add some bookings to generate AI insights.";

  const dataSummary = bookings.map(b => ({
    type: b.ticketType,
    paid: b.amountPaid,
    pending: b.amountPending,
    total: b.totalCost
  }));

  const prompt = `
    I have a list of event ticket bookings. 
    Here is a summarized version of the data:
    ${JSON.stringify(dataSummary)}

    As a business analyst, provide a very brief (max 3 sentences) analysis of:
    1. Which ticket type is most popular?
    2. What is the overall payment health (ratio of paid to pending)?
    3. One strategic suggestion to improve sales or collection.
    
    Keep it professional and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at the moment. Please check your data or connection.";
  }
};
