const isValidProduct = (product) => {
    if (!product) {
        console.error('Validation: product is missing');
        return false;
    }

    const { id, title } = product;

    if (!id || id === '') {
        console.error(`Validation: id is missing for product '${title}'`);
        return false;
    }
    if (!title || title === '') {
        console.error(`Validation: title is missing for product #${id}`);
        return false;
    }
    return true;
};

module.exports = { isValidProduct };