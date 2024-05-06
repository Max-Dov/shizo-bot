import { Context } from 'grammy';
import { Message } from '@grammyjs/types';
import { Logger } from '@utils';


/**
 * Verifies that object consisting of fields from ctx (action handler context) contains no undefined fields;
 * otherwise logs error and throws exception.
 */
export const verifyCtxFields = (
  objectToVerify: ObjectToVerify,
  ctx: Context | Message.TextMessage
): void | never => {
  const isInvalid = isObjectWithUndefined(objectToVerify);
  if (isInvalid) {
    Logger.error(
      'Could not figure out necessary fields:',
      objectToVerify,
      'from ctx:',
      ctx,
    );
    throw new Error('Could not figure out necessary fields from context!');
  }
};

// todo double check if it works or make it work
type ObjectToVerify = { [key in string]: unknown };
type ObjectWithUndefined = { [key in string]: undefined | unknown };

const isObjectWithUndefined = (objectToVerify: ObjectToVerify): objectToVerify is ObjectWithUndefined => {
  for (let key in objectToVerify) {
    if (objectToVerify[key] === undefined) {
      return true;
    }
  }
  return false;
};