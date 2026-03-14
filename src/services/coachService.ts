import { sendMessage, startChat } from "./geminiService";
import { UserProfile, Meal } from "@/store/useStore";

export const generatePersonalizedDiet = async (evaluationData: any, context: { profile: UserProfile, dietPlan: Meal[] }) => {
  const prompt = `
GERAR DIETA PERSONALIZADA - REQUISIÇÃO DE ELITE

DADOS DE AVALIAÇÃO:
${JSON.stringify(evaluationData, null, 2)}

CONTEXTO DO PERFIL:
${JSON.stringify(context.profile, null, 2)}

INSTRUÇÕES OBRIGATÓRIAS:
1. Calcule a Taxa Metabólica Basal (TMB) e o Gasto Calórico Total (TDEE).
2. Respeite 100% das alergias e intolerâncias citadas: ${evaluationData.allergies}.
3. Dieta: ${evaluationData.preference}.
4. Orçamento: ${evaluationData.budget}.
5. Refeições por dia: ${evaluationData.mealCount}.
6. Use produtos baseados em alimentos reais. 

RETORNE APENAS UM JSON NO FORMATO ABAIXO (sem markdown extra):
{
  "summary": {
    "tmb": number,
    "tdee": number,
    "targetCalories": number,
    "macros": { "protein": number, "carbs": number, "fat": number }
  },
  "meals": [
    {
      "id": "string",
      "name": "string",
      "foods": [
        { "name": "string", "amount": "string", "protein": number, "carbs": number, "fat": number, "calories": number }
      ]
    }
  ]
}
`;

  // Usamos um chat limpo para esta tarefa específica de geração estruturada
  const chat = startChat([], context as any);
  const responseText = await sendMessage(chat, prompt);
  
  // Limpa possíveis marcações de markdown do JSON
  const jsonString = responseText.replace(/```json|```/g, '').trim();
  
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro ao processar JSON da dieta AI:", e);
    throw new Error("A IA gerou um formato inválido. Tente novamente.");
  }
};
