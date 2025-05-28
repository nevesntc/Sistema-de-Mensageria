import { Message } from '../entities/Message';

export interface IMessageQueue {
  publish(queue: string, message: Message): Promise<void>;
  subscribe(queue: string, callback: (message: Message) => Promise<void>): Promise<void>;
} 