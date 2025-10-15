import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      message: 'Welcome to Stayra API 🚀',
      timestamp: new Date().toISOString(),
      data: {
        version: '1.0.0',
        author: 'Stayra Team',
      },
    };
  }
}
