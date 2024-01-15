import chalk from 'chalk';

/**
 * "DD/MM/YYYY, HH:MM:SS.MS"
 */
const timeFormat = Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw', // +01 STD, +02 DST
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3,
});

/**
 * Simple logger that adds log type and date to log messages.
 */
export class Logger {
  private static timeNow = () => timeFormat.format(new Date());
  static logTimeZone = () => Logger.info('Logger time zone:', timeFormat.resolvedOptions().timeZone);

  static info = (...messages: any[]) => console.info(
    chalk.bold(LogTypes.INFO),
    chalk.bgGray(Logger.timeNow()),
    ...messages,
  );

  /**
   * Prints info message in green for morale boost.
   * Expected use case is "success checkpoints", like successful request.
   */
  static goodInfo = (...messages: any[]) => console.info(
    chalk.bold.bgGreen(LogTypes.INFO),
    chalk.bgGray(Logger.timeNow()),
    ...messages,
  );

  static error = (...messages: any[]) => console.error(
    chalk.bold.bgRed(LogTypes.ERROR),
    chalk.bgGray(Logger.timeNow()),
    ...messages,
  );

  static warning = (...messages: any[]) => console.warn(
    chalk.bold.bgYellow(LogTypes.WARNING),
    chalk.bgGray(Logger.timeNow()),
    ...messages,
  );

  static command = (...messages: any[]) => console.log(
    chalk.bold.bgBlue(LogTypes.COMMAND),
    chalk.bgGray(Logger.timeNow()),
    ...messages,
  );
}

enum LogTypes {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  COMMAND = 'COMMAND'
}