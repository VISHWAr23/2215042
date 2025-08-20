export class CreateShortUrlDto {
  url: string;
  validity?: number; // in minutes
  shortcode?: string;
}
