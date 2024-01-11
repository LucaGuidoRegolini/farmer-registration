import { randomUUID } from 'crypto';

export function generateV4Id() {
  return randomUUID();
}
