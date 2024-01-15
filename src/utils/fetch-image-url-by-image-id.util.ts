import { Logger } from './logger.util';

/**
 * Fetches image URL by image id.
 * DANGER: returns URL containing bot token. Should not be passed to 3rd party services.
 * TODO re-upload image to 3rd party and return safe URL.
 */
export const fetchImageUrlByImageId = async (imageId: string): Promise<string> | never => {
  Logger.info('Loading image by ID', { imageId });
  const botToken = process.env.BOT_TOKEN;
  const imageDataResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${imageId}`
  );
  Logger.info('Image load response:', imageDataResponse.status, imageDataResponse.statusText);
  if (imageDataResponse.status === 200) {
    const imageData = await imageDataResponse.json();
    return `https://api.telegram.org/file/bot${botToken}/${imageData.result.file_path}`;
  } else {
    throw new Error(`Can not fetch image data by imageId ${imageId}`);
  }
};