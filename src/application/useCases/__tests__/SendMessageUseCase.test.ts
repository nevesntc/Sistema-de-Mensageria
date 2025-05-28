import { Message, MessageStatus } from '../../../domain/entities/Message';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IMessageQueue } from '../../../domain/services/IMessageQueue';
import { SendMessageUseCase } from '../SendMessageUseCase';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockRepository: jest.Mocked<IMessageRepository>;
  let mockQueue: jest.Mocked<IMessageQueue>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      findAll: jest.fn()
    };

    mockQueue = {
      publish: jest.fn(),
      subscribe: jest.fn()
    };

    useCase = new SendMessageUseCase(mockRepository, mockQueue);
  });

  it('should create and send a message', async () => {
    const messageData = {
      content: 'Test message',
      sender: 'user1',
      recipient: 'user2'
    };

    await useCase.execute(messageData);

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        content: messageData.content,
        sender: messageData.sender,
        recipient: messageData.recipient,
        status: MessageStatus.PENDING
      })
    );

    expect(mockQueue.publish).toHaveBeenCalledWith(
      'messages',
      expect.objectContaining({
        content: messageData.content,
        sender: messageData.sender,
        recipient: messageData.recipient,
        status: MessageStatus.PENDING
      })
    );
  });
}); 