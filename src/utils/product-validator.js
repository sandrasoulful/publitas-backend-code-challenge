const isValidProduct = (product) => {
    if (!product) {
        console.error('Validation: product is missing');
        return false;
    }
    if (!product.id || product.id === '') {
        console.error('Validation: id is missing for product:', product);
        return false;
    }
    if (!product.title || product.title === '') {
        console.error('Validation: title is missing for product:', product);
        return false;
    }
    return true;
};

module.exports = { isValidProduct };