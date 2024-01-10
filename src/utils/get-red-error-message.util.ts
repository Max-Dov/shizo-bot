import chalk from 'chalk';

/**
 * Attempts to extract error message and paints background into red.
 * @param error - "try-catch" or "Promise.catch" error.
 */
export const getRedErrorMessage = (error: unknown): string => {
  const message = (error as Error)?.message;
  return message
    ? chalk.bgRed(message)
    : chalk.redBright('Can not extract Error.message');
};