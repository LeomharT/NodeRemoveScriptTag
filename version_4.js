/**
 * @param {Is your root path} fileFolder
 * @param {Regular expression} regFilter
 * @param {The specific file list you require} result
 * @param {Hsa defualt if you dont enter a one} fileSeparator
 */
const getFileList = (fileFolder, regFilter, result, fileSeparator = require("path").sep) => {
    const fs = require('fs');

    let pathArray = fs.readdirSync(fileFolder);

    pathArray.forEach((path) => {

        let absPath = fileFolder + fileSeparator + path;
        let isDir = fs.statSync(absPath);

        //Recursion
        if (isDir.isDirectory()) {
            getFileList(absPath, regFilter, result, fileSeparator);
            return;
        };

        if (regFilter.test(absPath)) {
            //use concat wont effect the original array.but i need effect the origin array
            //Because is recursion function
            result.push(absPath);
        };
    });
};
//fs use async
const removeTag = (filePath, tagName) => {

    const fs = require('fs');
    const cheeiro = require('cheerio');

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

    getFileList(rootPath, /\.html/g, htmlFiles);

    htmlFiles.map(item => {
        removeTag(item, "script");
    });
};

main();
