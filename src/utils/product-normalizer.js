const clean = (text) => {
    if (!text) return '';
    const tagsRegex = /<[^>]+>/g;
    text = text.replace(tagsRegex, '');
    return text.trim();
};

const normalizeProduct = (product) => {
    if (!product) throw new Error('Failed to normalize, product is missing');

    if (!product.description) {
        product.description = '';
    }
        product.title = clean(product.title);
        product.description = clean(product.description);
    return product;
};

module.exports = { normalizeProduct };