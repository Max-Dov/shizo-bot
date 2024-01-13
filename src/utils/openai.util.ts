import { OpenAI } from 'openai';
import { ChatgptPresets, getDayStats, Logger, SituationTypes } from '@utils';
import { createFile, createFileSync, writeFile, writeFileSync } from 'fs-extra';

export class Openai {
  static instance: OpenAI;

  static initialize = () => Openai.instance = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });

  static fetchDivination = async () => {
    const { timeOfDay, dayOfWeek } = getDayStats();
    const divinationPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.DIVINATION);

    Logger.info('Sending request to openai..');
    const response = await Openai.instance.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 'role': 'system', 'content': divinationPreface, },
        { 'role': 'user', 'content': `Предскажи мой день. Сегодня ${timeOfDay} ${dayOfWeek}.` }
      ],
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    Logger.info('Request completed! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchChatMessageReply = async (userMessage: string) => {
    const replyPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.REPLY_TO_MESSAGE);

    Logger.info('Sending request to openai..');
    const response = await Openai.instance.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 'role': 'system', 'content': replyPreface, },
        { 'role': 'user', 'content': userMessage, }
      ],
      temperature: 1,
      max_tokens: 550,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    Logger.info('Request completed! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchChatMessageReaction = async (userMessage: string) => {
    const replyPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.REACT_TO_MESSAGE);

    Logger.info('Sending request to openai..');
    const response = await Openai.instance.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 'role': 'system', 'content': replyPreface, },
        { 'role': 'user', 'content': userMessage, }
      ],
      temperature: 1.2,
      max_tokens: 10,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    Logger.info('Request completed! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchVoiceMessage = async (userMessage: string) => {
    const botResponse = await Openai.fetchChatMessageReply(userMessage);
    Logger.info('Sending voice request to openai..');
    const voiceMessage = await Openai.instance.audio.speech.create({
      input: botResponse || 'Взрыв кабачка в коляске с поносом!',
      voice: 'onyx',
      response_format: 'opus',
      model: 'tts-1'
    });
    Logger.info('Request completed!');
    const fileName = `./temp/voice-${new Date().getTime()}.ogg`;
    await createFile(fileName);
    Logger.info('Voice file created!', fileName);
    await writeFile(fileName, Buffer.from(await voiceMessage.arrayBuffer()));
    Logger.info('Voice file saved!', fileName);
    return fileName;
  };
}