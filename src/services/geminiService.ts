import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash";

if (!apiKey || apiKey === "INSIRA_SUA_CHAVE_AQUI") {
  console.error("ERRO: NEXT_PUBLIC_GEMINI_API_KEY não encontrada ou inválida no .env.local.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_INSTRUCTION = `
Você é o FitCoach AI, um treinador de elite e nutricionista digital. 
Sua base de conhecimento é estritamente científica (fisiologia do exercício, nutrição baseada em evidências, metabolismo).

DIRETRIZES:
1. Respostas curtas, premium e motivadoras.
2. Use termos científicos quando apropriado (ex: hipertrofia, déficit calórico, sobrecarga progressiva).
3. Você tem acesso à "Base de Conhecimento Científica" do usuário.
4. Você pode sugerir mudanças nos planos de Dieta e Treino.

PROTOCOLO DE AÇÃO:
Se você sugerir uma mudança que o usuário possa confirmar, você DEVE incluir no final da sua resposta um bloco JSON exatamente assim:
[[ACTION:{"type": "update_diet", "payload": {"mealId": "ID", "food": {...}}, "label": "Substituir Aveia"}]]
ou
[[ACTION:{"type": "update_workout", "payload": {"day": "Dia", "exerciseId": "ID", "newExercise": {...}}, "label": "Trocar Supino"}]]

Não use JSON para conversas normais, apenas quando for para o sistema realizar uma alteração após a confirmação do usuário.
Responda sempre em Português (PT-BR).
`;

export const startChat = (history: any[] = [], context: any) => {
  const contextPrompt = `
DADOS ATUAIS DO USUÁRIO:
Perfil: ${JSON.stringify(context.profile)}
Plano de Dieta: ${JSON.stringify(context.dietPlan)}
Plano de Treino: ${JSON.stringify(context.workoutPlan)}
`;

  const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION + contextPrompt
  });

  return model.startChat({
    history: history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }))
  });
};

export const sendMessage = async (chat: any, text: string) => {
  const result = await chat.sendMessage(text);
  return result.response.text();
};
