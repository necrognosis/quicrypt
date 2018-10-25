const { simpleCryptoModule } = require("../utils/simpleCryptoModule");

module.exports = {
    command: "encrypt [input|i] [output]",
    aliases: ["enc", "e"],
    describe: "Simple AES-256-GCM data encryption",
    builder: {
        "input": {
            describe: "Data input to be encrypted. May be a file path, string, or recieved from stdin",
            alias: "i",
            type: "string",
            default: null
        },
        "output": {
            describe: "Output destination for encrypted data, may be file path or output to stdout",
            alias: "o",
            type: "string",
            default: null
        }
    },
    handler: yargs => { simpleCryptoModule(yargs, "encrypt") }
};