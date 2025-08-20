import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ShorturlService } from './shorturl.service';
import { CreateShortUrlDto } from './dto/create-shorturl.dto';

@Controller()
export class ShorturlController {
  constructor(private readonly shorturlService: ShorturlService) {}

  @Post('shorturls')
  createShortUrl(@Body() createShortUrlDto: CreateShortUrlDto) {
    try {
      return this.shorturlService.create(createShortUrlDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('shorturls/:shortcode')
  getStatistics(@Param('shortcode') shortcode: string) {
    try {
      return this.shorturlService.findStats(shortcode);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':shortcode')
  redirect(@Param('shortcode') shortcode: string, @Res() res: Response) {
    const originalUrl = this.shorturlService.getOriginalUrl(shortcode);
    if (!originalUrl) {
      throw new NotFoundException('Short URL not found or expired.');
    }

    this.shorturlService.simulateClick(shortcode, 'direct', 'unknown');
    return res.redirect(originalUrl);
  }
}
