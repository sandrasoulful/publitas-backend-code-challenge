const fs = require('fs');
const { pipeline } = require('node:stream');
const ProductNormalizer = require('./product-normalizer');
const BatchSender = require('./batch-sender');
const ProductFeedParser = require('./product-feed-parser');
const ProductValidator = require('./product-validator');

const productFeedFilePath = process.argv[2];
if (!productFeedFilePath) {
    console.error('Missing XML file path argument');
    process.exit(1);
}

pipeline(
    fs.createReadStream(productFeedFilePath, 'utf8'),
    new ProductFeedParser(),
    new ProductValidator(),
    new ProductNormalizer(),
    new BatchSender(),
    (err) => {
        if (err) console.error('Pipeline failed:', err);
        else console.log('Pipeline finished successfully');
    }
);