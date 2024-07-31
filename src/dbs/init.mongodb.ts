import mongoose, { ConnectOptions } from 'mongoose';
import * as config from '../configs/config.mongodb';
import { countConnect } from '../helpers/check.connect';

interface Config {
  default: {
    db: {
      host: string;
      port: number;
      name: string;
    };
  };
}

const host: string = (config as Config).default.db.host;
const port: number = (config as Config).default.db.port;
const name: string = (config as Config).default.db.name;

const connectString: string = `mongodb://${host}:${port}/${name}`;

class Database {
  private static instance: Database;

  private constructor() {}

  public connect(type: string = 'mongodb'): Promise<void> {
    // Dev
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    const options: ConnectOptions = { maxPoolSize: 5 };

    return mongoose
      .connect(connectString, options)
      .then(() => {
        console.log(`Connected Mongoose Success:`, countConnect());
      })
      .catch((err: Error) => {
        console.log(`Error connect Mongoose: ${err}`);
        throw err;
      });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
