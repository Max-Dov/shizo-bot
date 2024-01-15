import { pathExists, readJson, writeJson } from 'fs-extra';
import { JsonStorage } from '@models';
import { JSON_STORAGE_INIT } from '@constants';
import { Logger } from '@utils';

const STORAGE_DIR = './storage.json';

/**
 * Provides static methods to access JSON storage.
 * TODO think of better (safer I guess) storage communication implementation.
 */
export class Storage {
  static storage: JsonStorage;

  /**
   * Loads storage file into Storage. Expected to be called only once in the app.
   */
  static loadStorage = async () => {
    const doesPathExists = await pathExists(STORAGE_DIR);
    if (!doesPathExists) {
      await writeJson(STORAGE_DIR, JSON_STORAGE_INIT, { spaces: 2 });
    }
    Storage.storage = readJson(STORAGE_DIR);
  };

  static saveStorage = async () => {
    await writeJson(STORAGE_DIR, Storage.storage, { spaces: 2 });
    Logger.info('Storage saved');
  };
}