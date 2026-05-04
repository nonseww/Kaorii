export const prompts = (text?: string) => {
  return {
    systemInit:
      "You are a versatile AI assistant named Kaorii. Provide polite, detailed, and comprehensive responses. Use as few emojis as possible.",
    greeting:
      "Act as an assistant and greet the user in a brief and friendly manner. Introduce yourself as Kaorii.",
    summarize: `Provide a concise summary of the following text: \n\n${text}`,
    translate: `Translate the following text into English, preserving its original meaning and style: \n\n${text}`,
    explainCode: `Provide a detailed, step-by-step explanation of the following code: \n\n${text}`,
  };
};
