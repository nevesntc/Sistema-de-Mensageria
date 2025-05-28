import { Request, Response } from 'express';
import { SendMessageUseCase } from '../../application/useCases/SendMessageUseCase';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { Logger } from '../../infrastructure/services/Logger';

export class MessageController {
  constructor(
    private sendMessageUseCase: SendMessageUseCase,
    private messageRepository: IMessageRepository
  ) {}

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, sender, recipient } = req.body;

      if (!content || !sender || !recipient) {
        res.status(400).json({
          error: 'Dados inválidos. É necessário fornecer content, sender e recipient.'
        });
        return;
      }

      await this.sendMessageUseCase.execute({ content, sender, recipient });
      
      Logger.success('Mensagem enviada via API', { content, sender, recipient });
      res.status(201).json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
      Logger.error('Erro ao enviar mensagem via API', error);
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  }

  async listMessages(req: Request, res: Response): Promise<void> {
    try {
      const messages = await this.messageRepository.findAll();
      Logger.info('Listando mensagens via API', { count: messages.length });
      res.json(messages);
    } catch (error) {
      Logger.error('Erro ao listar mensagens via API', error);
      res.status(500).json({ error: 'Erro ao listar mensagens' });
    }
  }

  async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.messageRepository.findById(id);

      if (!message) {
        res.status(404).json({ error: 'Mensagem não encontrada' });
        return;
      }

      Logger.info('Buscando mensagem via API', { messageId: id });
      res.json(message);
    } catch (error) {
      Logger.error('Erro ao buscar mensagem via API', error);
      res.status(500).json({ error: 'Erro ao buscar mensagem' });
    }
  }
} 