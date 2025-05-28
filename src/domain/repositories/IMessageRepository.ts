import { Message } from '../entities/Message';

export interface IMessageRepository {
  save(message: Message): Promise<void>;
  findById(id: string): Promise<Message | null>;
  updateStatus(id: string, status: Message['status']): Promise<void>;
  findAll(): Promise<Message[]>;
} 