// For response shape
export class ShortUrlStatisticsDto {
  shortLink: string;
  expiry: string; // ISO8601 timestamp
  url: string;
  creationDate: string;
  clickCount: number;
  clicks: {
    timestamp: string;
    referrer: string;
    location: string;
  }[];
}
