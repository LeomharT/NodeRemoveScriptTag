const FS = require("fs");
const PATH = require('path');
const CHEEIRO = require('cheerio');


const getFileList = (fs, folder, regexFilte, fileList, fileSeparator) => {

    let pathArray = fs.readdirSync(folder);

    pathArray.forEach((path) => {

        let absPath = folder + fileSeparator + path;
        let isDir = fs.statSync(absPath);

        //Recursion
        if (isDir.isDirectory()) {
            getFileList(fs, absPath, regexFilte, fileList, fileSeparator);
            return;
        };

        if (regexFilte.test(absPath)) {
            fileList.push(absPath);
        };
    });
};
//fs use async
const removeTag = (filePath, tagName, fs, cheeiro) => {

    // fs.readFile is already async function
    // fs.readFileSync is Synchronize so the fs.writeFileSync as well
    fs.readFile(filePath, (err, data) => {

        if (err) {
            console.log(err);
            return;
        }

        let $ = cheeiro.load(data.toString());
        $(tagName).remove();

        // Must nesting otherwise $ is not define
        fs.writeFile(filePath, $.html().toString(), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};

const main = () => {

    const rootPath = process.argv.slice(2).toString();

    let htmlFiles = new Array();

    getFileList(FS, rootPath, /\.html/g, htmlFiles, PATH.sep);

    htmlFiles.map(item => {
        removeTag(item, "script", FS, CHEEIRO);
    });
};

main();
