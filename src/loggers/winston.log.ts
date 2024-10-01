import winston from 'winston';

const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'test.log',
    }),
  ],
});

// Định nghĩa kiểu cho các hàm log
type LogFunction = (message: string) => void;
type LogFunctionWithLevel = (level: string, message: string) => void;

// Tạo các hàm log phổ biến với kiểu
const log: LogFunctionWithLevel = (level, message) =>
  logger.log(level, message);
const logError: LogFunction = (message) => logger.error(message);
const warn: LogFunction = (message) => logger.warn(message);
const logInfo: LogFunction = (message) => logger.info(message);
const logHttp: LogFunction = (message) => logger.http(message);
const logVerbose: LogFunction = (message) => logger.verbose(message);
const logDebug: LogFunction = (message) => logger.debug(message);
const logSilly: LogFunction = (message) => logger.silly(message);

// Export các hàm log với kiểu
export {
  log,
  logError,
  warn,
  logInfo,
  logHttp,
  logVerbose,
  logDebug,
  logSilly,
};
