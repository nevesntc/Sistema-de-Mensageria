import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

export function createMessageRoutes(controller: MessageController): Router {
  const router = Router();

  router.post('/messages', (req, res) => controller.sendMessage(req, res));
  router.get('/messages', (req, res) => controller.listMessages(req, res));
  router.get('/messages/:id', (req, res) => controller.getMessageById(req, res));

  return router;
} 