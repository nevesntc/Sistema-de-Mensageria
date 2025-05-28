import { Message, MessageStatus } from '../../domain/entities/Message';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';

export class ReceiveMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(message: Message): Promise<void> {
    const existingMessage = await this.messageRepository.findById(message.id);
    
    if (!existingMessage) {
      throw new Error(`Message with id ${message.id} not found`);
    }

    await this.messageRepository.updateStatus(message.id, MessageStatus.DELIVERED);
  }
} 