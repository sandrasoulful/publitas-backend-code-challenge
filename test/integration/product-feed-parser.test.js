const fs = require('fs');
const { once } = require('node:events');
const ProductFeedParser = require('../../src/lib/product-feed-parser');

const singleProductXML = require.resolve('../fixtures/product-feed-files/single-product-feed.xml');
const multipleProductsXML = require.resolve('../fixtures/product-feed-files/multiple-products-feed.xml');
const productFeedNoItems = require.resolve('../fixtures/product-feed-files/product-feed-no-items.xml');
const invalidProductFeedXML = require.resolve('../fixtures/product-feed-files/invalid-product-feed.xml');
const emptyProductFeedXML = require.resolve('../fixtures/product-feed-files/empty-product-feed.xml');

describe('Product Feed Parser integration tests', () => {
    it('should parse correctly when XML contains a single product (item)', async () => {
        const parserStream = new ProductFeedParser();
        const products = [];

        parserStream.on('data', (product) => products.push(product));

        fs.createReadStream(singleProductXML, 'utf8').pipe(parserStream);
        await once(parserStream, 'end');

        expect(products.length).toBe(1);

        const expectedProduct = {
            id: '9454971',
            title: 'Witte T-shirt met groene letters',
            description: '<html>Stay chic with me\'. Dit wit T-shirt van Elvira maakt jouw look compleet. ' +
                'Dit veelzijdig stuk kan je op heel wat manieren stylen om er helemaal jouw ding van te maken. ' +
                'Ga je voor een girly look met een rok of voor een sportief getinte outfit met een toffe jeans? ' +
                'Afgewerkt met zilveren bolletjes op de letters.<br><br>Lengte ca. 63 cm bij maat S.</html>'
        };

        expect(products[0]).toEqual(expectedProduct);
    });

    it('should parse correctly when XML contains multiple products (items)', async () => {
        const parserStream = new ProductFeedParser();
        const products = [];

        parserStream.on('data', (product) => products.push(product));

        fs.createReadStream(multipleProductsXML, 'utf8').pipe(parserStream);
        await once(parserStream, 'end');

        const expectedProducts = [{
            id: '4530607',
            title: 'Blauwe jeans - skinny fit',
            description: '<html>Deze donkerblauwe jeans met oranje stiksels van Angels is een echte klassieker. Deze jeans kan je met elke blouse en elke trui uit je kleerkast dragen. De skinny fit, sluit mooi aan rond de benen. De broek is gemaakt van een elastische stof, waardoor hij als gegoten zit rond jouw lichaam. 5-pocketmodel met knop en rits.<br><br>Lengte binnenbeen ca. 77 cm bij maat 34. Skinny fit.</html>'
        }, {
            id: '4532526',
            title: 'Donkerblauwe denim met slangenprint - straight fit',
            description: '<html>Funky, deze donkerblauwe stretchdenim met subtiele slangenprint. De print in reliëf geeft de broek pit en karakter. Een handig 5-pocketmodel met zilverkleurige knop en rits. Straight fit.<br><br>Lengte binnenbeen ca. 80 cm bij W 34.</html>'
        }, {
            id: '4530405',
            title: 'Zwarte denim met strass - skinny fit',
            description: '<html>Een donkerblauwe denim met subtiele strass steentjes op de voorste steekzakken. Een handig 5-pocketmodel met zilverkleurige knop en rits. Skinny fit. <br><br>Lengte buitenbeen ca. 101 cm, binnenbeen ca. 74 cm bij W 34.</html>'
        }];

        expect(products.length).toBe(expectedProducts.length);
        expect(products).toEqual(expectedProducts);
    });

    it('should stop processing if XML contains no products (items)', async () => {
        const parserStream = new ProductFeedParser();
        const onData = jest.fn();

        parserStream.on('data', onData);

        const stream = fs.createReadStream(productFeedNoItems, 'utf8').pipe(parserStream);
        await once(stream, 'end');

        expect(onData).not.toHaveBeenCalled();
    });
    it('should stop processing if XML is empty', async () => {
        const parserStream = new ProductFeedParser();
        const onData = jest.fn();

        parserStream.on('data', onData);

        const stream = fs.createReadStream(emptyProductFeedXML, 'utf8').pipe(parserStream);
        await once(stream, 'end');

        expect(onData).not.toHaveBeenCalled();
    });

    it('should emit an error and stop processing if XML is invalid', async () => {
        const parserStream = new ProductFeedParser();
        let caughtError = null;

        parserStream.on('error', (err) => {
            caughtError = err;
        });

        const stream = fs.createReadStream(invalidProductFeedXML, 'utf8').pipe(parserStream);
        try {
            await once(stream, 'end');
        } catch (e) {}

        expect(caughtError).toBeInstanceOf(Error);
    });
});