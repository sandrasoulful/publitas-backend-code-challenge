const { Writable } = require('node:stream');
const ExternalService = require('../external/external-service');
const { isValidProduct } = require('../utils/product-validator');
const { normalizeProduct } = require('../utils/product-normalizer');


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
            if (!isValidProduct(product)) {
                console.warn('Skipping invalid product:', product);
                return done();
            }
            const normalizedProduct = normalizeProduct(product);
            const size = this._estimate(normalizedProduct);
            if (this.batchBytes + size >= MAX_BYTES) {
                console.log('Size limit reached, flushing current batch.');
                this._flush();
            }
            this.batch.push(normalizedProduct);
            this.batchBytes = Buffer.byteLength(JSON.stringify(this.batch));
            return done();
        } catch (e) {
            console.error('Error processing a product for batch sending', e);
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