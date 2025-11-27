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

    console.log('Validation passed for product:', product);
    return true;

};

module.exports = { isValidProduct };