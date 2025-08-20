import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoggerService {
  private LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

  /**
   * Sends a log entry to the external Log API
   * @param stack "backend" | "frontend"
   * @param level "debug" | "info" | "warn" | "error" | "fatal"
   * @param pkg see allowed packages in API docs
   * @param message human-readable context message
   */
  async log(stack: string, level: string, pkg: string, message: string) {
    const body = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };

    try {
      // Swap to class-validator for stricter data handling in production!
      const resp = await firstValueFrom(
        new HttpService().post(this.LOG_API_URL, body)
      ) as { data: any };
      return resp.data; // {logID, message}
    } catch (err) {
      // Ideally handle/report failures here (console, fallback, ...).
      console.warn('Log API Error:', err?.response?.data || err.message);
      return null;
    }
  }
}
