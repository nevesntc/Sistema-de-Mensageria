import { Message } from '../../domain/entities/Message';
import { IMessageQueue } from '../../domain/services/IMessageQueue';
import { Logger } from './Logger';

type QueueCallback = (message: Message) => Promise<void>;

export class InMemoryMessageQueue implements IMessageQueue {
  private queues: Map<string, QueueCallback[]> = new Map();
  private messages: Map<string, Message[]> = new Map();

  async publish(queue: string, message: Message): Promise<void> {
    Logger.info(`Publicando mensagem na fila ${queue}`, message);

    // Armazena a mensagem
    if (!this.messages.has(queue)) {
      this.messages.set(queue, []);
    }
    this.messages.get(queue)!.push(message);

    // Notifica os consumidores
    const callbacks = this.queues.get(queue) || [];
    Logger.info(`Notificando ${callbacks.length} consumidores`);

    for (const callback of callbacks) {
      try {
        await callback(message);
        Logger.success(`Mensagem processada com sucesso`, { messageId: message.id });
      } catch (error) {
        Logger.error(`Erro ao processar mensagem`, error);
      }
    }
  }

  async subscribe(queue: string, callback: QueueCallback): Promise<void> {
    Logger.info(`Registrando novo consumidor para a fila ${queue}`);

    if (!this.queues.has(queue)) {
      this.queues.set(queue, []);
    }
    this.queues.get(queue)!.push(callback);

    // Processa mensagens existentes
    const messages = this.messages.get(queue) || [];
    Logger.info(`Processando ${messages.length} mensagens existentes`);

    for (const message of messages) {
      try {
        await callback(message);
        Logger.success(`Mensagem existente processada com sucesso`, { messageId: message.id });
      } catch (error) {
        Logger.error(`Erro ao processar mensagem existente`, error);
      }
    }
  }

  async close(): Promise<void> {
    Logger.info('Fechando serviço de mensageria');
    this.queues.clear();
    this.messages.clear();
  }
} 