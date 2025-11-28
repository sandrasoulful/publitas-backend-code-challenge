// mock for Jest to use in tests
const ExternalService = jest.fn().mockImplementation(() => {
    return {
        calls: [],
        call(batch) {
            this.calls.push(batch);
        }
    };
});

module.exports = ExternalService;