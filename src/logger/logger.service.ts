import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoggerService {
  private readonly LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

  private readonly BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE1MDQyQG5lYy5lZHUuaW4iLCJleHAiOjE3NTU2NzQ4MjQsImlhdCI6MTc1NTY3MzkyNCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImEzMGEyMjEyLTllNGEtNDUyYy04YTY4LWU3ZGYyZDQwNDEyMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InZpc2h3YSByIiwic3ViIjoiMWNjYTAzM2ItOTJkZC00ZDBjLTk4NzMtNTBjMjg4N2RkNzMyIn0sImVtYWlsIjoiMjIxNTA0MkBuZWMuZWR1LmluIiwibmFtZSI6InZpc2h3YSByIiwicm9sbE5vIjoiMjIxNTA0MiIsImFjY2Vzc0NvZGUiOiJ4c1pUVG4iLCJjbGllbnRJRCI6IjFjY2EwMzNiLTkyZGQtNGQwYy05ODczLTUwYzI4ODdkZDczMiIsImNsaWVudFNlY3JldCI6IkJEREVoSk55ckpZdEt5dmEifQ.P88_IgQV1KYIW746MjxMp0YsIkt-xiLr0E-o8_9FQsI';

  constructor(private readonly httpService: HttpService) {}

  async log(stack: string, level: string, pkg: string, message: string) {
    const body = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };

    try {
      const resp = await firstValueFrom(
        this.httpService.post(this.LOG_API_URL, body, {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        }),
      );
      return resp.data;
    } catch (err) {
      console.warn('Log API Error:', err?.response?.data || err.message);
      return null;
    }
  }
}
