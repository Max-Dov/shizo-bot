import { pathExists, readJson } from 'fs-extra';
import chalk from 'chalk';

export class ChatgptPresets {
  static presetsJson: { [key in string]: Array<string> } | null = null;

  static loadPresetsFile = (filePath: string): Promise<void> =>
    pathExists(filePath).then(exists => {
      if (exists) {
        return readJson(filePath).then(presetsJson => ChatgptPresets.presetsJson = presetsJson);
      } else {
        return Promise.reject(`Could not read chatgpt presets file! ${chalk.bgRed(filePath)}`);
      }
    });

  /**
   * Loads random preset (system message) for Chatgpt.
   */
  static getRandomPresetForSituation = (situation: SituationTypes) => {
    if (ChatgptPresets.presetsJson) {
      const presets = ChatgptPresets.presetsJson[situation];
      return presets[Math.trunc(
        Math.random() * presets.length
      )].trim().replaceAll('\n', '');
    } else {
      throw Error(`Can not load chatgpt presets: ${ChatgptPresets.presetsJson}. Try loading if first.`);
    }
  };
}

export enum SituationTypes {
  REPLY_TO_MESSAGE = 'REPLY_TO_MESSAGE',
  REACT_TO_MESSAGE = 'REACT_TO_MESSAGE',
  DRAWING = 'DRAWING',
  OWN_MESSAGE = 'OWN_MESSAGE',
  TEXT_OR_VOICE = 'TEXT_OR_VOICE',
}