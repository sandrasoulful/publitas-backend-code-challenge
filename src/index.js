const fs = require('fs');
const { pipeline } = require('stream');
const Normalizer = require('./normalizer');
const BatchSender = require('./batch-sender');
const ProductFeedParser = require('./product-feed-parser');

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node app.js <xml-file-path>');
    process.exit(1);
}

const productFeedStream =  fs.createReadStream(filePath, 'utf8');
const normalizer = new Normalizer();
const batchSender = new BatchSender();
const productFeedParser = new ProductFeedParser();

pipeline(
    productFeedStream,
    productFeedParser,
    normalizer,
    batchSender,
    (err) => {
        if (err) console.error('Pipeline failed:', err);
        else console.log('Pipeline finished successfully');
    }
);



