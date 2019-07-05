import { Injectable } from '@nestjs/common';
import { existsSync, renameSync, readdirSync } from 'fs';
import { HttpSource, FileSource } from 'dmr-source';
import { resolve } from 'path';
import { Shunt } from './common/shunt';
import { Connector } from './common/conecter';
const Base64 = require('js-base64').Base64;
const folderPath = resolve(process.cwd(), './cache/');

@Injectable()
export class AppService {
  getList(): string {
    const files = readdirSync(folderPath);
    const list: string[] = [];
    files.forEach((file) => {
      let info = '';
      let f = Base64.decode(file);
      if (file.indexOf('.tmp') > 0) {
        f = Base64.decode(file.replace('.tmp', ''));
        info += '[failed] ';
      } else {
        info += '[cached] ';
      }
      if (f.indexOf('http') === 0) {
        list.push(info + f + '   [' + file + ']');
      }
    });
    return list.join('\r\n');
  }
  getResource(url: string) {
    const key = Base64.encode(url, true);
    const filePath = resolve(folderPath, key);
    if (existsSync(filePath)) {
      return new FileSource().createReadableStream({path: filePath});
    } else {
      // tslint:disable-next-line:no-console
      console.log('no-cache', url);
      const reader = new HttpSource().createReadableStream({url});
      const shunt = new Shunt();
      const connector = new Connector();

      const writer = new FileSource().createWritableStream({path: filePath + '.tmp'});
      shunt.pipeTo(writer);
      writer.on('finish', () => {
        process.nextTick(() => {
          renameSync(filePath + '.tmp', filePath);
        });
      });

      shunt.pipeTo(connector);
      reader.pipe(shunt);
      return connector;
    }
  }
  getOriginUrl(query: string) {
    if (query.match(/^\/cypress/)) {
      return query.replace('/cypress', 'https://download.cypress.io');
    }
    return false;
  }
}
