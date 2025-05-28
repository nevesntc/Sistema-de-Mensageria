import express from 'express';
import { InMemoryMessageQueue } from './infrastructure/services/InMemoryMessageQueue';
import { MessageConsumer } from './infrastructure/services/MessageConsumer';
import { ReceiveMessageUseCase } from './application/useCases/ReceiveMessageUseCase';
import { InMemoryMessageRepository } from './infrastructure/repositories/InMemoryMessageRepository';
import { SendMessageUseCase } from './application/useCases/SendMessageUseCase';
import { Logger } from './infrastructure/services/Logger';
import { MessageController } from './interfaces/controllers/MessageController';
import { createMessageRoutes } from './interfaces/routes/messageRoutes';
import { environment } from './config/environment';

async function bootstrap() {
  try {
    Logger.info('Iniciando aplicação...');

    // Inicializa os serviços em memória
    const messageQueue = new InMemoryMessageQueue();
    const messageRepository = new InMemoryMessageRepository();

    // Inicializa os casos de uso
    const sendMessageUseCase = new SendMessageUseCase(messageRepository, messageQueue);
    const receiveMessageUseCase = new ReceiveMessageUseCase(messageRepository);

    // Inicializa o consumidor de mensagens
    const messageConsumer = new MessageConsumer(messageQueue, receiveMessageUseCase);
    await messageConsumer.start();

    Logger.success('Consumidor de mensagens iniciado com sucesso');

    // Inicializa a API
    const app = express();
    app.use(express.json());

    // Configura as rotas
    const messageController = new MessageController(sendMessageUseCase, messageRepository);
    app.use('/api', createMessageRoutes(messageController));

    // Inicia o servidor
    app.listen(environment.app.port, () => {
      Logger.success(`API iniciada na porta ${environment.app.port}`);
    });

    // Exemplos de envio de mensagens
    const messages = [
      {
        content: 'Olá, mundo!',
        sender: 'user1',
        recipient: 'user2'
      },
      {
        content: 'Como vai?',
        sender: 'user2',
        recipient: 'user1'
      },
      {
        content: 'Tudo bem!',
        sender: 'user1',
        recipient: 'user2'
      }
    ];

    Logger.info('Enviando mensagens de exemplo...');
    
    for (const message of messages) {
      await sendMessageUseCase.execute(message);
      // Pequeno delay entre as mensagens para melhor visualização
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Lista todas as mensagens após o processamento
    const allMessages = await messageRepository.findAll();
    Logger.info('Estado final das mensagens:', allMessages);

    // Tratamento de encerramento gracioso
    process.on('SIGTERM', async () => {
      Logger.info('SIGTERM recebido. Encerrando graciosamente...');
      await messageQueue.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      Logger.info('SIGINT recebido. Encerrando graciosamente...');
      await messageQueue.close();
      process.exit(0);
    });
  } catch (error) {
    Logger.error('Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}

bootstrap(); 