const FS = require("fs");
const PATH = require('path');
const CHEEIRO = require('cheerio');

const getFileList = (fs, folder, fileList, fileSeparator) => {
    try {
        if (!(fs.statSync(folder).isDirectory())) { return; }

        let pathArray = fs.readdirSync(folder);

        return pathArray.reduce((prev, curr) => {
            let absPath = folder + fileSeparator + curr;
            if (fs.statSync(absPath).isDirectory()) {
                return prev.concat(getFileList(fs, absPath, fileList, fileSeparator));
            }
            else {
                return prev.concat(absPath);
            }
        }, []);
    }
    catch (e) {
        console.log(e);
        return;
    }

};

const getTargetFile = (fielList, regexFilter) => {
    try {
        let targetFileList = new Array();

        fielList.map(file => {
            if (!regexFilter.test(file)) { return; }
            targetFileList = targetFileList.concat(file);
        });

        return targetFileList;
    }
    catch (e) {
        console.log(e);
        return;
    }

};

const removeTag = (filePath, tagName, fs, cheeiro) => {

    //If you dont want callback then synchronize
    try {
        let fileData = fs.readFileSync(filePath);
        let $ = cheeiro.load(fileData.toString());

        $(tagName).remove();

        if (fs.writeFileSync(filePath, $.html().toString())) {
            console.log("Write Failed");
        }
    }
    catch (e) {
        console.log(e);
        return;
    }
};

const main = () => {

    const rootPath = process.argv.slice(2).toString();

    let htmlFiles = getTargetFile(getFileList(FS, rootPath, new Array(), PATH.sep), /\.html/g);

    htmlFiles.map(item => {
        removeTag(item, "script", FS, CHEEIRO);
    });
};
main();
