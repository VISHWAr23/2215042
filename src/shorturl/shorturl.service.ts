import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-shorturl.dto';
import { ShortUrlStatisticsDto } from './dto/statistics.dto';

@Injectable()
export class ShorturlService {
  private links = new Map<string, any>();
  private clicks = new Map<string, any[]>();

  create(createShortUrlDto: CreateShortUrlDto) {
    const validity = createShortUrlDto.validity ?? 30;
    let shortcode = createShortUrlDto.shortcode || this.generateShortCode();

    while (this.links.has(shortcode)) {
      shortcode = this.generateShortCode();
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60000).toISOString();

    this.links.set(shortcode, {
      url: createShortUrlDto.url,
      expiry,
      creationDate: now.toISOString(),
      clickCount: 0,
      shortcode,
    });
    this.clicks.set(shortcode, []);

    return {
      shortLink: `http://localhost:3000/${shortcode}`,
      expiry,
    };
  }

  findStats(shortcode: string): ShortUrlStatisticsDto {
    const data = this.links.get(shortcode);
    if (!data) {
      throw new NotFoundException(`Shortcode '${shortcode}' not found.`);
    }
    return {
      shortLink: `http://localhost:3000/${shortcode}`,
      expiry: data.expiry,
      url: data.url,
      creationDate: data.creationDate,
      clickCount: data.clickCount,
      clicks: this.clicks.get(shortcode) || [],
    };
  }

  getOriginalUrl(shortcode: string): string | null {
    const data = this.links.get(shortcode);
    if (!data) return null;

    if (new Date() > new Date(data.expiry)) {
      return null;
    }

    return data.url;
  }

  simulateClick(shortcode: string, referrer: string, location: string) {
    if (!this.links.has(shortcode)) return;

    const data = this.links.get(shortcode);
    data.clickCount++;
    let clickArr = this.clicks.get(shortcode);
    if (!clickArr) {
      clickArr = [];
      this.clicks.set(shortcode, clickArr);
    }
    clickArr.push({
      timestamp: new Date().toISOString(),
      referrer,
      location,
    });
  }

  private generateShortCode(length = 6): string {
    return Math.random().toString(36).substr(2, length);
  }
}
