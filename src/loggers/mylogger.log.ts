import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, printf, align } = format;
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

class MyLogger {
  logger: Logger;
  constructor() {
    const formatPrint = printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          level: 'info',
          dirname: 'src/logs',
          filename: '%DATE%.info.log',
          datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true,
          maxSize: '1m',
          maxFiles: '14d',
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            formatPrint
          ),
        }),
        new transports.DailyRotateFile({
          level: 'error',
          dirname: 'src/logs',
          filename: '%DATE%.error.log',
          datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true,
          maxSize: '1m',
          maxFiles: '14d',
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            formatPrint
          ),
        }),
      ],
    });
  }
  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }
    const requestId = req?.requestId || uuidv4();
    return {
      requestId,
      context,
      metadata,
    };
  }
  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.info(logObject);
  }
  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    console.log(logObject);
    this.logger.error(logObject);
  }
}

export default new MyLogger();
