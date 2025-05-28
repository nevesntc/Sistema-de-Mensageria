import { Message, MessageStatus } from '../../domain/entities/Message';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { Logger } from '../services/Logger';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Map<string, Message> = new Map();

  async save(message: Message): Promise<void> {
    Logger.info('Salvando mensagem', message);
    this.messages.set(message.id, message);
    Logger.success('Mensagem salva com sucesso', { messageId: message.id });
  }

  async findById(id: string): Promise<Message | null> {
    Logger.info('Buscando mensagem por ID', { id });
    const message = this.messages.get(id) || null;
    if (message) {
      Logger.success('Mensagem encontrada', { messageId: id });
    } else {
      Logger.info('Mensagem não encontrada', { id });
    }
    return message;
  }

  async updateStatus(id: string, status: MessageStatus): Promise<void> {
    Logger.info('Atualizando status da mensagem', { id, status });
    const message = this.messages.get(id);
    if (message) {
      this.messages.set(id, { ...message, status });
      Logger.success('Status atualizado com sucesso', { messageId: id, status });
    } else {
      Logger.error('Mensagem não encontrada para atualização', { id });
    }
  }

  async findAll(): Promise<Message[]> {
    Logger.info('Buscando todas as mensagens');
    const messages = Array.from(this.messages.values());
    Logger.success(`${messages.length} mensagens encontradas`);
    return messages;
  }
} 