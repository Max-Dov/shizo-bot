import * as ChatAPI from 'openai/src/resources/chat/chat';
import { SpeechCreateParams } from 'openai/src/resources/audio/speech';
import { ImageGenerateParams } from 'openai/src/resources/images';

type ChatModel = ChatAPI.ChatModel;
type VoiceModel = SpeechCreateParams['model'];
type ImageModel = ImageGenerateParams['model'];

export const CHAT_GPT_TEXT_VERSION: ChatModel  = 'gpt-4-turbo';
export const CHAT_GPT_VOICE_VERSION: VoiceModel = 'tts-1';
export const CHAT_GPT_VISION_VERSION: ChatModel = 'gpt-4-vision-preview';
export const CHAT_GPT_IMAGE_VERSION: ImageModel = 'dall-e-3';