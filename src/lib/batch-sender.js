const { Writable } = require('node:stream');
const ExternalService = require('../service/external-service');
const { isValidProduct } = require('../utils/product-validator');
const { normalizeProduct } = require('../utils/product-normalizer');

const ONE_MB = 1_048_576;
const MAX_BYTES = ONE_MB * 5;
const EMPTY_ARRAY_BYTE_SIZE = 2;
const COMMA_BYTE_SIZE = 1;

// NOTE (AK):
// This implementation is intentionally synchronous. The External Service for the purposes of the task
// runs locally and blocks the event loop anyway, so adding concurrency would not improve speed.
// If it was a real remote network service, I would implement a concurrent batch sender
// using a small worker queue to send multiple batches in parallel.
class BatchSender extends Writable {
    constructor() {
        super({ objectMode: true });
        this.externalService = new ExternalService();
        this.batch = [];
        this.batchBytes = EMPTY_ARRAY_BYTE_SIZE;
    }

    _measureProductBytes(product) {
        return Buffer.byteLength(JSON.stringify(product));
    }

    _write(product, _, done) {
        try {
            if (!isValidProduct(product)) {
                console.warn('Skipping invalid product:', product);
                return done();
            }
            const normalizedProduct = normalizeProduct(product);
            const jsonBytes = this._measureProductBytes(normalizedProduct);
            const overhead = this.batch.length === 0 ? 0 : COMMA_BYTE_SIZE;
            if (this.batchBytes + overhead + jsonBytes >= MAX_BYTES) {
                console.log('Size limit reached, flushing current batch.');
                this._flush();
            }
            this.batch.push(normalizedProduct);
            this.batchBytes += overhead + jsonBytes;
            return done();
        } catch (e) {
            console.error('Error processing a product for batch sending', e);
            done(e);
        }
    }

    _flush() {
        if (!this.batch.length) return;
        const json = JSON.stringify(this.batch);
        this.externalService.call(json);
        this.batch = [];
        this.batchBytes = EMPTY_ARRAY_BYTE_SIZE;
    }

    _final(done) {
        this._flush();
        done();
    }
}

module.exports = BatchSender;