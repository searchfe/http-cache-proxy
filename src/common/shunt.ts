import { Writable } from 'stream';

export class Shunt extends Writable {
    private streams: Writable[] = [];
    constructor() {
        super();
        this.streams = [];
    }
    _write(buf, encoding, callback) {
        this.streams.forEach((stream) => {
            stream.write(buf);
        });
        callback();
    }
    pipeTo(stream) {
        this.streams.push(stream);
        this.on('finish', () => {
            stream.emit('finish');
        });
    }
}
