export class ShortUrlStatisticsDto {
  shortLink: string;
  expiry: string;
  url: string;
  creationDate: string;
  clickCount: number;
  clicks: {
    timestamp: string;
    referrer: string;
    location: string;
  }[];
}
