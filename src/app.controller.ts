import { Controller, Get, Req, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { of } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getList(@Req() req: Request): string {
    // tslint:disable-next-line:no-console
    return this.appService.getList();
  }

  @Get('*')
  proxy(@Req() req: Request, @Res() res: Response) {
    const url = this.appService.getOriginUrl(req.url);
    if (url) {
      this.appService.getResource(url).pipe(res);
    } else {
      res.end(this.appService.getList());
    }
  }
}
