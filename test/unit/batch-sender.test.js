const { normalizeProduct } = require('../../src/utils/product-normalizer');
const { validProduct, invalidProduct } = require('../fixtures/products');
const { setupBatchSender } = require('../helpers/set-up-batch-sender');

const EMPTY_ARRAY_BYTE_SIZE = 2;

describe('Batch Sender unit tests', () => {
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

    it('should skip invalid product', async () => {
        await writeToBatchSenderAndEnd(batchSender, invalidProduct);
        expect(externalService.calls.length).toBe(0);
    });

    it('should send a valid product and skip invalid', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProduct);

        expect(batchSender.batch.length).toBe(0);
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(1);
        expect(batch[0].id).toBe(validProduct.id);
    });

    it('should flush when product would exceed 5MB', () => {
        const oneMb = 1_048_576;
        const maxBytes = oneMb * 5;
        const safeMarginBytes = 10;
        jest.spyOn(batchSender, '_measureProductBytes')
            .mockReturnValue(maxBytes - safeMarginBytes);

        const flushSpy = jest.spyOn(batchSender, '_flush');

        batchSender.write(validProduct);

        expect(batchSender.batch.length).toBe(1);
        expect(flushSpy).not.toHaveBeenCalled();

        batchSender.write(validProduct);
        expect(flushSpy).toHaveBeenCalled();
        expect(batchSender.batch.length).toBe(1);

        flushSpy.mockRestore();
        batchSender._measureProductBytes.mockRestore();
    });

    it('should not flush when batch is less than 5MB', async () => {
        batchSender.write(validProduct);
        expect(externalService.calls.length).toBe(0);
    });

    it('should reset internal state after flush', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProduct);

        expect(batchSender.batch.length).toBe(0);
        expect(batchSender.batchBytes).toBe(EMPTY_ARRAY_BYTE_SIZE);
    });

    it('should calculate batch size correctly', async () => {
        const jsonBytesSize = Buffer.byteLength(JSON.stringify(normalizeProduct(validProduct)));
        batchSender.write(validProduct);

        expect(batchSender.batchBytes).toBe(EMPTY_ARRAY_BYTE_SIZE + jsonBytesSize);
    });

    it('should handle empty batch and not call external service', () => {
        expect(() => batchSender._flush()).not.toThrow();
        expect(externalService.calls.length).toBe(0);
    });
});