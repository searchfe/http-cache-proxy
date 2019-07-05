import { Controller, Get, Req, Request, Res, Header, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { of } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @HttpCode(200)
  @Header('Content-Type', 'text/html')
  getList(@Req() req: Request): string {
    // tslint:disable-next-line:no-console
    return this.appService.getList();
  }

  @Get('*')
  proxy(@Req() req: Request, @Res() res: Response) {
    const url = this.appService.getOriginUrl(req.url);
    if (url) {
      this.appService.getResource(url, res).pipe(res);
    } else {
      return this.appService.getList();
    }
  }
}
