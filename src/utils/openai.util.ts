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

    Logger.info('Sending request to OpenAI (DIVINATION)..');
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
    Logger.info('Request completed (DIVINATION)! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchChatMessageReply = async (userMessage: string) => {
    const replyPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.REPLY_TO_MESSAGE);

    Logger.info('Sending request to OpenAI (REPLY_TO_MESSAGE)..');
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
    Logger.info('Request completed (REPLY_TO_MESSAGE)! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchDrawingName = async () => {
    const replyPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.DRAWING);

    Logger.info('Sending request to OpenAI (DRAWING)..');
    const response = await Openai.instance.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ 'role': 'system', 'content': replyPreface, }],
      temperature: 1,
      max_tokens: 550,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    Logger.info('Request completed (DRAWING)!');

    return response.choices[0].message.content;
  };

  static fetchChatMessageReaction = async (userMessage: string) => {
    const replyPreface = ChatgptPresets.getRandomPresetForSituation(SituationTypes.REACT_TO_MESSAGE);

    Logger.info('Sending request to OpenAI (REACT_TO_MESSAGE)..');
    const response = await Openai.instance.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 'role': 'system', 'content': replyPreface, },
        { 'role': 'user', 'content': userMessage, }
      ],
      temperature: 0.8,
      max_tokens: 10,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    Logger.info('Request completed (REACT_TO_MESSAGE)! Tokens: ', response.usage);

    return response.choices[0].message.content;
  };

  static fetchVoiceMessage = async (userMessage: string) => {
    const botResponse = await Openai.fetchChatMessageReply(userMessage);
    Logger.info('Sending voice request to OpenAI (VOICE)..');
    const voiceMessage = await Openai.instance.audio.speech.create({
      input: botResponse || 'Взрыв кабачка в коляске с поносом!',
      voice: 'onyx',
      response_format: 'opus',
      model: 'tts-1'
    });
    Logger.info('Request completed (VOICE)!');
    const fileName = `./temp/voice-${new Date().getTime()}.ogg`;
    await createFile(fileName);
    Logger.info('Voice file created!', fileName);
    await writeFile(fileName, Buffer.from(await voiceMessage.arrayBuffer()));
    Logger.info('Voice file saved!', fileName);
    return fileName;
  };

  static fetchDrawing = async (drawingName: string) => {
    Logger.info('Sending image request to OpenAI (IMAGE)..');
    const imageUrl = await Openai.instance.images.generate({
      model: 'dall-e-3',
      prompt: drawingName,
      size: '1024x1024',
      n: 1,
    });
    Logger.info('Request completed (IMAGE)!');
    return imageUrl.data[0].url;
  };
}