const { simpleCryptoModule } = require("../utils/simpleCryptoModule");

module.exports = {
    command: "decrypt [input] [output]",
    aliases: ["dec", "d"],
    describe: "Simple AES-256-GCM data decryption",
    builder: {
        "input": {
            describe: "Data input to be decrypted. May be a file path, string, or recieved from stdin",
            alias: "i",
            type: "string",
            default: null
        },
        "output": {
            describe: "Output destination for decrypted data, may be file path or output to stdout",
            alias: "i",
            type: "string",
            default: null
        }
    },
    handler: yargs => { simpleCryptoModule(yargs, "decrypt") }
};