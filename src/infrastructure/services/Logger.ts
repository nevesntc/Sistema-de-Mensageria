export class Logger {
  static info(message: string, data?: any): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  static error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  }

  static success(message: string, data?: any): void {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
} 