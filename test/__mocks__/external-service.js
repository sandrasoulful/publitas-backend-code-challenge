// tests/__mocks__/externalService.js

class ExternalService {
    constructor() {
        this.batch_num = 0;
        this.ONE_MEGA_BYTE = 1_048_576.0;
        this.call = jest.fn((batch) => {
            this.batch_num += 1;
        });
    }
}

module.exports = ExternalService;