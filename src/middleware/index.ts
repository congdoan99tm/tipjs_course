import Logger from '../loggers/discord.log.v2';

const pushToLogDiscord = async (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      title: `method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originUrl}`,
    });
    console.log('send');
    return next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default pushToLogDiscord;
