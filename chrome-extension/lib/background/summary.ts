import { appStorage } from '@chrome-extension-boilerplate/storage';

// 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
const CHAT_ROUTE = 'https://openrouter.ai';

export const summaryContents = async (contents: string[]) => {
  const { apiKey } = await appStorage.get();
  if (!apiKey) {
    return Promise.reject('Please config api key first');
  }

  const messages = [];
  for (let index = 0; index < contents.length; index++) {
    const content = contents[index];
    if (index === 0) {
      messages.push({
        role: 'system',
        content: `Summarize the following page content: ${contents} and paragraphs`,
      });
    } else {
      messages.push({
        role: 'system',
        content: `Paragraph ${index}: ${content}`,
      });
    }
  }
  console.log('messages', messages);

  const result = await fetch(`${CHAT_ROUTE}/api/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: messages,
    }),
  }).then(resp => resp.json());
  console.log('模型回包', result);
  const { choices } = result;
  const message = choices[0].message;
  return message;
};
