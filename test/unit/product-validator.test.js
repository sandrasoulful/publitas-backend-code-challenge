/*
tese cases
- if product has no id - product not passed down the stream, keep processing the rest
- if product has no title - product not passed down the stream, keep processing the rest
- if product has no id AND no title - product not passed down the stream, keep processing the rest
- if product has no description element - description set to empty string
- if product has empty description - description set to empty string
- Description is multiple whitespace only -  description set to empty string
 */

const fs = require('fs');
const { once } = require('node:events');
const { Readable } = require('node:stream');
const { isValidProduct } = require('../../src/utils/product-validator');


describe('isValidProduct', () => {
    const validProduct = {
        id: '9454971',
        title: 'Witte T-shirt met groene letters',
        description: 'Deze donkerblauwe jeans met oranje stiksels van Angels is een echte klassieker'
    };

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

    it('should return false when title is an empty string', () => {
        const product = {
            id: validProduct.id,
            title: '',
            description: validProduct.description
        };
        expect(isValidProduct(product)).toBe(false);
    });

    it('should return true if description is missing', () => {
        const product = {
            id: validProduct.id,
            title: validProduct.title,
        };
        expect(isValidProduct(product)).toBe(true);
    });
});