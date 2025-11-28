const BatchSender = require('../../src/lib/batch-sender');
const ExternalService = require('../../src/service/external-service');

jest.mock('../../src/service/external-service');

const setupBatchSender = () => {
    const externalService = new ExternalService();
    const batchSender = new BatchSender();
    batchSender.externalService = externalService;
    return { batchSender, externalService };
};

module.exports = { setupBatchSender };