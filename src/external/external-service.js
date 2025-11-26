class ExternalService {
    constructor() {
        this.ONE_MEGA_BYTE = 1_048_576.0;
        this.batch_num = 0;
    }

    call(batch) {
        this.batch_num += 1;
        this._prettyPrint(batch);
    }

    _prettyPrint(batch) {
        const products = JSON.parse(batch);

        console.log(`\x1b[1mReceived batch${String(this.batch_num).padStart(4)}\x1b[22m`);
        console.log(`Size: ${((Buffer.byteLength(batch) / this.ONE_MEGA_BYTE)).toFixed(2)}MB`);
        console.log(`Products: ${String(products.length).padStart(8)}`);
        console.log('\n');
    }
}

module.exports = ExternalService;