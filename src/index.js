const fs = require('fs');
const { pipeline } = require('node:stream');
const BatchSender = require('./lib/batch-sender');
const ProductFeedParser = require('./lib/product-feed-parser');

const productFeedFilePath = process.argv[2];
if (!productFeedFilePath) {
    console.error('Missing XML file path argument');
    process.exit(1);
}

pipeline(
    fs.createReadStream(productFeedFilePath, 'utf8'),
    new ProductFeedParser(),
    new BatchSender(),
    (err) => {
        if (err) console.error('Pipeline failed:', err);
        else console.log('Pipeline finished successfully');
    }
);