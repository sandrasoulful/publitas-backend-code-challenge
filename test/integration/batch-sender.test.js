const { validProduct } = require('../fixtures/products');
const { setupBatchSender } = require('../helpers/set-up-batch-sender');

describe('BatchSender integration tests', () => {
    let batchSender;
    let externalService;

    beforeEach(() => ({ batchSender, externalService } = setupBatchSender()));

    const writeToBatchSenderAndEnd = (batchSender, product) => {
        return new Promise(resolve => {
            batchSender.write(product, () => {
                batchSender.end(resolve);
            });
        });
    };

    it('should send one product in a batch', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProduct);

        expect(batchSender.batch.length).toBe(0);
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(1);
        expect(batch[0].id).toBe(validProduct.id);
    });

    it('should flush remaining products on stream end', async () => {
        batchSender.write(validProduct);
        batchSender.write({ ...validProduct, id: '123' });

        await new Promise(resolve => batchSender.end(resolve));
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(2);
    });
});