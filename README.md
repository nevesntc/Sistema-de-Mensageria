# Sistema de Mensageria

Um sistema de mensageria assíncrona implementado em Node.js com TypeScript, seguindo os princípios SOLID e Clean Architecture.

## 🚀 Funcionalidades

- Envio e recebimento de mensagens assíncronas
- API REST para interação com o sistema
- Armazenamento em memória para simplicidade e performance
- Logging detalhado de operações
- Tratamento de erros robusto
- Encerramento gracioso da aplicação

## 🛠️ Tecnologias

- Node.js
- TypeScript
- Express
- Jest (para testes)

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## 🚀 Executando o Projeto

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Para executar os testes:
```bash
npm test
```

## 📡 API REST

O sistema expõe os seguintes endpoints:

### Enviar Mensagem
```bash
POST /api/messages
Content-Type: application/json

{
  "content": "Olá!",
  "sender": "user1",
  "recipient": "user2"
}
```

### Listar Mensagens
```bash
GET /api/messages
```

### Buscar Mensagem por ID
```bash
GET /api/messages/:id
```

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture e SOLID:

### Camadas

1. **Domain**
   - Entidades (`Message`)
   - Interfaces dos repositórios
   - Casos de uso

2. **Application**
   - Implementação dos casos de uso
   - Lógica de negócio

3. **Infrastructure**
   - Implementações concretas
   - Serviços (InMemoryMessageQueue, Logger)
   - Repositórios (InMemoryMessageRepository)

4. **Interfaces**
   - Controllers
   - Rotas
   - Adaptadores

### Componentes Principais

- **Message**: Entidade principal que representa uma mensagem
- **InMemoryMessageQueue**: Serviço de mensageria em memória
- **MessageConsumer**: Consumidor de mensagens
- **MessageController**: Controlador da API REST
- **Logger**: Serviço de logging

## 📝 Logs

O sistema possui um sistema de logging detalhado que registra:
- Início e encerramento da aplicação
- Envio e recebimento de mensagens
- Erros e exceções
- Operações da API

## ⚠️ Limitações

Por ser uma implementação em memória:
- Dados são perdidos ao reiniciar a aplicação
- Não suporta distribuição entre múltiplas instâncias
- Não possui persistência de dados

## 🔄 Fluxo de Mensagens

1. Mensagem é enviada via API ou caso de uso
2. Mensagem é salva no repositório
3. Mensagem é publicada na fila
4. Consumidor processa a mensagem
5. Status da mensagem é atualizado

## 🛡️ Tratamento de Erros

- Validação de dados de entrada
- Tratamento de exceções em todas as camadas
- Logging de erros
- Respostas HTTP apropriadas

## 🔌 Encerramento Gracioso

O sistema implementa encerramento gracioso para:
- SIGTERM
- SIGINT

Garantindo que todas as operações sejam finalizadas adequadamente.
