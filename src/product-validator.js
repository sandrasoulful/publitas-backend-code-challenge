const { Transform } = require('node:stream');

class ProductValidator extends Transform {
    constructor(options = {}) {
        super({ objectMode: true });
    }

    _transform(product, _, done) {
        if (!product.id || !product.title) {
            // skip invalid product
            return done();
        }
        if (!product.description) {
            product.description = '';
        }
        done(null, product);
    }
}

module.exports = ProductValidator;