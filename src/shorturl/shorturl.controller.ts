import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { ShorturlService } from './shorturl.service';
import { CreateShortUrlDto } from './dto/create-shorturl.dto';

@Controller('shorturls')
export class ShorturlController {
  constructor(private readonly shorturlService: ShorturlService) {}

  @Post()
  create(@Body() createShortUrlDto: CreateShortUrlDto) {
    return this.shorturlService.create(createShortUrlDto);
  }

  @Get(':shortcode')
  findStats(@Param('shortcode') shortcode: string) {
    const stats = this.shorturlService.findStats(shortcode);
    if (!stats) throw new NotFoundException('Shortcode not found');
    return stats;
  }
}
