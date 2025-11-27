const { Transform } = require('stream');
const sax = require('sax');

class ProductFeedParser extends Transform {
    constructor() {
        super({ readableObjectMode: true });

        this.parser = sax.createStream(true);

        this.product = null;
        this.currentTag = null;

        this.parser.on('opentag', node => {
            if (node.name === 'item') this.product = {};
            this.currentTag = node.name;
        });

        this.parser.on('text', text => {
            if (!this.product || !this.currentTag) return;
            text = text.trim();
            if (!text) return;

            if (this.currentTag === 'g:id') this.product.id = text;
            if (this.currentTag === 'title') this.product.title = text;
            if (this.currentTag === 'description') this.product.description = text;
        });

        this.parser.on('closetag', name => {
            if (
                name === 'item' &&
                this.product?.id &&
                this.product?.title &&
                this.product?.description
            ) {
                this.push(this.product);
                console.log('product sent downstream:', this.product);
                this.product = null;
            }
            this.currentTag = null;
        });

        this.parser.on('error', err => this.destroy(err));
    }

    _transform(chunk, _, callback) {
        try {
            this.parser.write(chunk.toString());
            callback();
        } catch (err) {
            callback(err);
        }
    }

    _final(callback) {
        try {
            this.parser.end();
            callback();
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = ProductFeedParser;