const clean = (text) => {
    if (!text) return '';
    text = text.replace(/<[^>]+>/g, '');
    return text.trim();
};

const normalizeProduct = (product) => {
    if (!product) throw new Error('Normalization: product is missing');

    if (!product.description) {
        product.description = '';
    }
        product.title = clean(product.title);
        product.description = clean(product.description);
    return product;
};


module.exports = { normalizeProduct };