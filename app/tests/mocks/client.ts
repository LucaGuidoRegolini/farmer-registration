import { ConnectionDb } from '../../src/infra/database/connection';

const prisma = ConnectionDb.getPrisma();

export default prisma;
