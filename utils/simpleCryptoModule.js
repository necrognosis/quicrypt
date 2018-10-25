const { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } = require("crypto"),
    { createReadStream, createWriteStream } = require("fs"),
    { question } = require("readline-sync"),
    { verifyPath } = require("../utils/verifyPath");

function createPassphrase() {
    const key = question("Please enter a new passphrase ==>  ", { hideEchoBack: true }),
        verify = question("Please re-enter your new passphrase ==>  ", { hideEchoBack: true });
    if (key !== verify) {
        console.error("Passphrases do not match!");
        return createPassphrase(); 
    };
    return key;
};

function promptPassphrase() {
    return question("Please your passphrase for this data ==>  ", { hideEchoBack: true });
};

function encrypt(data, masterkey) {
    const iv = randomBytes(16),
    salt = randomBytes(64),
    key = pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512'),
    cipher = createCipheriv('aes-256-gcm', key, iv),

    encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]),
    tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

function decrypt(encData, masterkey) {
    const encBuf = Buffer.from(encData, 'base64');

    const salt = encBuf.slice(0, 64),
        iv = encBuf.slice(64, 80),
        tag = encBuf.slice(80, 96),
        data = encBuf.slice(96),
        key = pbkdf2Sync(masterkey, salt , 2145, 32, 'sha512'),
        decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        return decipher.update(data, 'binary', 'utf8') + decipher.final('utf8');
};

function simpleCryptoModule(_yargs, cryptoMethod) {
    const input = (!_yargs.input) ? process.stdin : createReadStream(verifyPath(_yargs.input, "input")),
        output = (!_yargs.output) ? process.stdout : createWriteStream(verifyPath(_yargs.output, "output"));

    const data = [];
    input.on('readable', () => {
        const chunk = input.read();
        if (chunk !== null) data.push(chunk);
    }).on("end", () => {
        switch (cryptoMethod) {
            case "encrypt":
                output.write(encrypt(data.join(), createPassphrase()));
                break;
            case "decrypt":
                output.write(decrypt(data.join(), promptPassphrase()));
                break;
            default:
                console.error("SimpleCryptoModule error, quitting...") || process.exit(1);
        };
    });
};

module.exports = { simpleCryptoModule };