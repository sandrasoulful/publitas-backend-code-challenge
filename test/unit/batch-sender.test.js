const BatchSender = require('../../src/lib/batch-sender');
const { normalizeProduct } = require('../../src/utils/product-normalizer');
const ExternalService = require('../../src/service/external-service');

const EMPTY_ARRAY_BYTE_SIZE = 2;

jest.mock('../../src/service/external-service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calls: [],
            call(batch) {
                this.calls.push(batch);
            }
        };
    });
});

describe('BatchSender', () => {
    let batchSender;
    let externalService;

    beforeEach(() => {
        externalService = new ExternalService();
        batchSender = new BatchSender();
        batchSender.externalService = externalService;
    });

    const validProductOne = {
        id: '9454971',
        title: 'Witte T-shirt met groene letters',
        description: 'Deze donkerblauwe jeans met oranje stiksels van Angels is een echte klassieker'
    };

    const validProductTwo = {
        id: '9454972',
        ...validProductOne,
    };

    const invalidProduct = {
        id: '',
        title: '',
        description: ''
    };

    const writeToBatchSenderAndEnd = (batchSender, product) => {
        return new Promise(resolve => {
            batchSender.write(product, () => {
                batchSender.end(resolve);
            });
        });
    };

    it('should send one product in a batch', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProductOne);

        expect(batchSender.batch.length).toBe(0);
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(1);
        expect(batch[0].id).toBe(validProductOne.id);
    });

    it('should skip invalid product', async () => {
        await writeToBatchSenderAndEnd(batchSender, invalidProduct);
        expect(externalService.calls.length).toBe(0);
    });

    it('should send a valid product and skip invalid', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProductOne);

        expect(batchSender.batch.length).toBe(0);
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(1);
        expect(batch[0].id).toBe(validProductOne.id);
    });

    it('should flush when product would exceed 5MB', () => {
        const oneMb = 1_048_576;
        const maxBytes = oneMb * 5;
        const safeMarginBytes = 10;
        jest
            .spyOn(batchSender, '_measureProductBytes')
            .mockReturnValue(maxBytes - safeMarginBytes);

        const flushSpy = jest.spyOn(batchSender, '_flush');

        batchSender.write(validProductOne);

        expect(batchSender.batch.length).toBe(1);
        expect(flushSpy).not.toHaveBeenCalled();

        batchSender.write(validProductOne);
        expect(flushSpy).toHaveBeenCalled();
        expect(batchSender.batch.length).toBe(1);

        flushSpy.mockRestore();
        batchSender._measureProductBytes.mockRestore();
    });

    it('should not flush when batch is less than 5MB', async () => {
        batchSender.write(validProductOne);
        expect(externalService.calls.length).toBe(0);
    });

    it('should flush remaining products on stream end', async () => {
        batchSender.write(validProductOne);
        batchSender.write(validProductTwo);

        await new Promise(resolve => batchSender.end(resolve));
        expect(externalService.calls.length).toBe(1);

        const batch = JSON.parse(externalService.calls[0]);
        expect(batch.length).toBe(2);
    });

    it('should reset internal state after flush', async () => {
        await writeToBatchSenderAndEnd(batchSender, validProductOne);

        expect(batchSender.batch.length).toBe(0);
        expect(batchSender.batchBytes).toBe(EMPTY_ARRAY_BYTE_SIZE);
    });

    it('should calculate batch size correctly', async () => {
        const jsonBytesSize = Buffer.byteLength(JSON.stringify(normalizeProduct(validProductOne)));
        batchSender.write(validProductOne);

        expect(batchSender.batchBytes).toBe(EMPTY_ARRAY_BYTE_SIZE + jsonBytesSize);
    });

    it('should handle empty batch and not call external service', () => {
        expect(() => batchSender._flush()).not.toThrow();
        expect(externalService.calls.length).toBe(0);
    });
});