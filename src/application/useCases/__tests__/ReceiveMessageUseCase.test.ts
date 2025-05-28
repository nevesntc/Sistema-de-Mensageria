import { Message, MessageStatus } from '../../../domain/entities/Message';
import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { ReceiveMessageUseCase } from '../ReceiveMessageUseCase';

describe('ReceiveMessageUseCase', () => {
  let useCase: ReceiveMessageUseCase;
  let mockRepository: jest.Mocked<IMessageRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      findAll: jest.fn()
    };

    useCase = new ReceiveMessageUseCase(mockRepository);
  });

  it('should update message status to DELIVERED when message exists', async () => {
    const message: Message = {
      id: '123',
      content: 'Test message',
      sender: 'user1',
      recipient: 'user2',
      timestamp: new Date(),
      status: MessageStatus.PENDING
    };

    mockRepository.findById.mockResolvedValue(message);

    await useCase.execute(message);

    expect(mockRepository.findById).toHaveBeenCalledWith(message.id);
    expect(mockRepository.updateStatus).toHaveBeenCalledWith(message.id, MessageStatus.DELIVERED);
  });

  it('should throw error when message does not exist', async () => {
    const message: Message = {
      id: '123',
      content: 'Test message',
      sender: 'user1',
      recipient: 'user2',
      timestamp: new Date(),
      status: MessageStatus.PENDING
    };

    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(message)).rejects.toThrow(`Message with id ${message.id} not found`);
    expect(mockRepository.findById).toHaveBeenCalledWith(message.id);
    expect(mockRepository.updateStatus).not.toHaveBeenCalled();
  });
}); 