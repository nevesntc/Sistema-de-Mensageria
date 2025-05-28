import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development'
  }
}; 