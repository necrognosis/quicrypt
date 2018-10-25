const { existsSync, lstatSync } = require("fs");
const { posix } = require("path");
const { keyInYN, question } = require("readline-sync");

function mkPathAbs(pathStr) {
    // pathStr = posix.parse(pathStr);
    return posix.normalize(posix.join(process.cwd(), "/", pathStr));
};

function restart() {
    return verifyPath(question("Enter desired path ==>  "));
};

function verifyPath(pathStr, typeStr) {
    if (!posix.isAbsolute(pathStr)) pathStr = mkPathAbs(pathStr);

    const parsedPath = posix.parse(pathStr),
        destination =  (!existsSync(pathStr)) ? false : lstatSync(pathStr);

    if (!destination) {
        if (!existsSync(parsedPath.dir)) {
            console.error(`Given directory "${parsedPath.dir}" does not exist!`) || process.exit(1);
        };
        return (keyInYN(`Use ${typeStr} file "${parsedPath.base}" in "${parsedPath.dir}?"`)) ? pathStr : restart();

    } else if (destination.isFile()) {
        if (!keyInYN(`Are you sure you want to use "${parsedPath.base}" as ${typeStr}?`)) return restart();
        return pathStr;
        
    } else if (destination.isDirectory()) {
        if (!keyInYN(`Given path "${pathStr}" is a directory, use file in here as ${typeStr}?`)) return restart();
        const fileName = question("Enter desired file name ==>  ");
        return posix.join(pathStr, fileName);
    };
};

module.exports = { verifyPath };