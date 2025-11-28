const { normalizeProduct } = require('../../src/utils/product-normalizer');
const { validProduct } = require('../fixtures/products');

describe('Product Normalizer unit tests', () => {

    it('should throw an error when product is missing', () => {
        expect(() => normalizeProduct(undefined)).toThrow();
        expect(() => normalizeProduct(null)).toThrow();
    });

    it('should return unchanged object for a valid product', () => {
        expect(normalizeProduct(validProduct)).toEqual(validProduct);
    });

    it('should strip tags from description', () => {
        const descriptionWithTags = `<html>${validProduct.description.replace("jeans", "<b>jeans</b>")}</html>`;
        const product = {
            ...validProduct,
            description: descriptionWithTags
        };
        expect(normalizeProduct(product)).toEqual(validProduct);
    });

    it('should strip tags from title', () => {
        const product = {
            ...validProduct,
            title: `<html>${validProduct.title}</html>`
        };
        expect(normalizeProduct(product)).toEqual(validProduct);
    });

    it('should trim leading and trailing whitespaces from description', () => {
        const product = {
            ...validProduct,
            description: `   ${validProduct.description}   `
        };
        expect(normalizeProduct(product)).toEqual(validProduct);
    });

    it('should trim leading and trailing whitespaces from title', () => {
        const product = {
            ...validProduct,
            title: `   ${validProduct.title}   `
        };
        expect(normalizeProduct(product)).toEqual(validProduct);
    });

    it('should add description and set it to an empty string if description is missing', () => {
        const product = {
            id: validProduct.id,
            title: validProduct.title
        };

        const expectedProduct = {
            ...product,
            description: ''
        }
        expect(normalizeProduct(product)).toEqual(expectedProduct);
    });

    it('should set description to an empty string if description contains whitespaces only', () => {
        const product = {
            id: validProduct.id,
            title: validProduct.title,
            description: '     '
        };

        const expectedProduct = {
            ...product,
            description: ''
        }
        expect(normalizeProduct(product)).toEqual(expectedProduct);
    });

});