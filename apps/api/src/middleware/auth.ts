import type { FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config.js';

export async function internalAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const key = request.headers['x-api-key'];
  if (key !== config.internalApiKey) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
