import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash";

if (!apiKey || apiKey === "INSIRA_SUA_CHAVE_AQUI") {
  console.error("ERRO: NEXT_PUBLIC_GEMINI_API_KEY não encontrada ou inválida no .env.local.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

import { KNOWLEDGE_BASE } from "./knowledgeBase";

const SYSTEM_INSTRUCTION = `
Você é o FitCoach AI, um treinador de elite e nutricionista digital. 
Sua base de conhecimento é estritamente científica e você DEVE seguir as diretrizes abaixo:

${KNOWLEDGE_BASE}

DIRETRIZES DE COMPORTAMENTO:
1. Respostas curtas, premium e motivadoras.
2. Use termos científicos (ex: hipertrofia, déficit calórico, sobrecarga progressiva).
3. SEMPRE baseie suas sugestões de treino no ACSM/NSCA e dieta no KRAUSE.
4. Você tem acesso total ao perfil e planos atuais do usuário.

CONVERSA INICIAL E AVALIAÇÃO:
- Sua primeira mensagem para novos usuários deve ser "Vamos definir sua dieta e treino!".
- Se o usuário não tiver um plano completo, você deve agir como um avaliador, fazendo perguntas sobre: idade, peso, altura, objetivo, alergias, orçamento e número de refeições/horários.
- Não faça todas as perguntas de uma vez. Mantenha o diálogo fluido.

PROTOCOLO DE AÇÃO:
Se você sugerir uma mudança ou gerar um plano completo após a avaliação, você DEVE incluir no final da sua resposta um bloco JSON:
Para trocar um item:
[[ACTION:{"type": "update_diet", "payload": {"mealId": "ID", "food": {...}}, "label": "Substituir Aveia"}]]

Para aplicar uma DIETA COMPLETA (especialmente após a conversa de definição):
[[ACTION:{"type": "apply_full_diet", "payload": [{"id": "meal1", "name": "Café da Manhã", "foods": [...]}, ...], "label": "Aplicar Dieta Personalizada"}]]

Responda sempre em Português (PT-BR).
`;

import { Message } from "@/components/tabs/AICoach";
import { UserProfile, Meal, Workout } from "@/store/useStore";

export interface ChatContext {
  profile: UserProfile;
  dietPlan: Meal[];
  workoutPlan: Workout[];
}

export const startChat = (history: Message[] = [], context: ChatContext) => {
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

export const sendMessage = async (chat: { sendMessage: (text: string) => Promise<any> }, text: string) => {
  const result = await chat.sendMessage(text);
  return result.response.text();
};
