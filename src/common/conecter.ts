import {Transform} from 'stream';
/**
 * @hidden and @ignore
 */
export class Connector extends Transform {
  public _transform(chunk, encoding, callback) {
      this.push(chunk);
      callback();
  }
}
