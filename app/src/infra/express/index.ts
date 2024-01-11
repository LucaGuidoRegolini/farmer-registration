import { createServer, Server } from 'http';
import 'express-async-errors';
import express from 'express';
import winston from 'winston';
import cors from 'cors';

import { httpLogger } from '@infra/logger';
import { appRoutes } from './routes';

export class ExpressServer {
  private _express: express.Express;
  private _server: Server;
  private _port: number;
  private _logger: winston.Logger;
  constructor(port: number, logger: winston.Logger) {
    this._port = port;
    this._express = express();
    this._server = createServer(this._express);
    this._logger = logger;
    this.validate();
    this.config();
    this.handlers();

    this.handleParseErrors();
  }

  get server(): Server {
    return this._server;
  }

  private validate(): void {
    if (this._port < 1000 || this._port > 65535) {
      throw new Error('Invalid port number');
    }
  }

  private config(): void {
    this._express.use(
      cors({
        origin: '*',
      }),
    );
    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: true }));
    this._express.use(httpLogger.req_logger({ logger: this._logger }));
  }

  private handlers(): void {
    this._express.use(appRoutes);
  }

  private handleParseErrors() {
    this._express.use(httpLogger.err_logger({ logger: this._logger }));
  }

  public start(): void {
    this._server.listen(this._port);
    this._logger.info(`🚀 Server running on port ${this._port}`);
  }
}
