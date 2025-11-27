const { Writable } = require('node:stream');
const ExternalService = require('./external/external-service');

const ONE_MB = 1_048_576;
const MAX_BYTES = ONE_MB * 5;

class BatchSender extends Writable {
    constructor() {
        super({ objectMode: true });
        this.externalService = new ExternalService();
        this.batch = [];
        this.batchBytes = 0;
    }

    _estimate(product) {
        return Buffer.byteLength(JSON.stringify([product]));
    }

    _write(product, _, done) {
        try {
            const size = this._estimate(product);
            if (this.batchBytes + size >= MAX_BYTES) {
                this._flush();
            }
            this.batch.push(product);
            this.batchBytes = Buffer.byteLength(JSON.stringify(this.batch));
            return done();
        } catch (e) {
            done(e);
        }
    }

    _flush() {
        if (!this.batch.length) return;
        const json = JSON.stringify(this.batch);
        console.log('FLUSHING BATCH, calling external service with size:', (Buffer.byteLength(json) / ONE_MB).toFixed(2), 'MB');
        this.externalService.call(json);
        this.batch = [];
        this.batchBytes = 0;
    }

    _final(done) {
        this._flush();
        done();
    }
}

module.exports = BatchSender;