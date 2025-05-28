export interface Message {
  id: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: Date;
  status: MessageStatus;
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
} 