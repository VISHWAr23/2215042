import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-shorturl.dto';
import { ShortUrlStatisticsDto } from './dto/statistics.dto';

@Injectable()
export class ShorturlService {
  private links = new Map<string, any>(); // In-memory DB
  private clicks = new Map<string, any[]>(); // Click data

  create(createShortUrlDto: CreateShortUrlDto) {
    const validity = createShortUrlDto.validity || 30;
    let shortcode = createShortUrlDto.shortcode || Math.random().toString(36).substr(2, 6);
    if (this.links.has(shortcode)) {
      shortcode = Math.random().toString(36).substr(2, 6); // Ensures unique code
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
      shortLink: `https://localhost:3000/${shortcode}`,
      expiry,
    };
  }

  findStats(shortcode: string): ShortUrlStatisticsDto {
    const data = this.links.get(shortcode);
    if (!data) {
      throw new Error(`Shortcode '${shortcode}' not found.`);
    }
    return {
      shortLink: `https://hostname:port/${shortcode}`,
      expiry: data.expiry,
      url: data.url,
      creationDate: data.creationDate,
      clickCount: data.clickCount,
      clicks: this.clicks.get(shortcode) || [],
    };
  }

  // Simulate a click event for demonstration purposes
  simulateClick(shortcode: string, referrer: string, location: string) {
    if (!this.links.has(shortcode)) return;
    this.links.get(shortcode).clickCount += 1;
    const evt = {
      timestamp: new Date().toISOString(),
      referrer,
      location,
    };
    const clickArr = this.clicks.get(shortcode);
    if (clickArr) {
      clickArr.push(evt);
    }
  }
}
