const { Transform } = require('stream');
const he = require('he');

class Normalizer extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(product, _, done) {
        if (product.title) product.title = this._clean(product.title);
        if (product.description) product.description = this._clean(product.description);
        done(null, product);
    }

    _clean(text) {
        text = he.decode(text);
        text = text.replace(/<[^>]+>/g, '');
        return text.trim();
    }
}

module.exports = Normalizer;