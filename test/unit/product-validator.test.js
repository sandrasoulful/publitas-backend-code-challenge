const { isValidProduct } = require('../../src/utils/product-validator');
const { validProduct } = require('../fixtures/products');

describe('Product Validator unit tests', () => {

    it('should return true for a valid product', () => {
        expect(isValidProduct(validProduct)).toBe(true);
    });

    it('should return false when product is missing', () => {
        expect(isValidProduct(undefined)).toBe(false);
        expect(isValidProduct(null)).toBe(false);
    });

    it('should return false when product has no id', () => {
        const product = {
            title: validProduct.title,
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return false when id is an empty string', () => {
        const product = {
            id: '',
            title: validProduct.title,
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return false when product has no title', () => {
        const product = {
            id: validProduct.id,
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return false when product has no id and title', () => {
        const product = {
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return false when title is an empty string', () => {
        const product = {
            id: validProduct.id,
            title: '',
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return true when a product has no description', () => {
        const product = {
            id: validProduct.id,
            title: validProduct.title
        };
        expect(isValidProduct(product)).toBe(true);
    });

    it('should return true when description is an empty string', () => {
        const product = {
            id: validProduct.id,
            title: validProduct.title,
            description: ''
        };
        expect(isValidProduct(product)).toBe(true);
    });
});