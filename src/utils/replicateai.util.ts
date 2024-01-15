import Replicate from 'replicate';
import { fetchImageUrlByImageId } from './fetch-image-url-by-image-id.util';
import { Logger } from './logger.util';

// why exactly that model? idk: https://replicate.com/rmokady/clip_prefix_caption?input=nodejs
const model = 'rmokady/clip_prefix_caption:9a34a6339872a03f45236f114321fb51fc7aa8269d38ae0ce5334969981e4cd8';

/**
 * Util to explain images. Enables bot to understand images (memes).
 */
export class Replicateai {
  static instance: Replicate;

  static initialize = () => {
    Replicateai.instance = new Replicate({
      auth: process.env.REPLICATE_AI_KEY,
    });
  };

  /**
   * Explains image via Replicate API.
   *
   * DANGER: sends URL containing bot token to service. According to TOS & Privacy Policy it should be ok for now.
   * Realistically "it's fine" to send token to that legit webservice.
   */
  static explainImage = async (imageId: string) => {
    const imageUrl = await fetchImageUrlByImageId(imageId);
    Logger.info('Sending request to Replicate AI.', { imageId });
    const description = await Replicateai.instance.run(
      model,
      { input: { image: imageUrl, model: 'coco', use_beam_search: false } }
    )
    Logger.info('Request completed!', { imageId });
    return description;
  };
}