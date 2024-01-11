import { ConnectionDb } from '@infra/database/connection';
import { express_port_http } from '@configs/express';
import { Logger } from '@infra/logger';
import 'dotenv/config';

(async () => {
  const logger = Logger.init();
  Logger.info('✅ Server starting');

  ConnectionDb.connect().then(() => {
    import('@infra/express').then(async ({ ExpressServer }) => {
      const httpPort = express_port_http;
      const httpServer = new ExpressServer(httpPort, logger);

      httpServer.start();
    });
  });
})();
