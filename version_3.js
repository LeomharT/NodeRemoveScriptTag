const fs = require('fs');
const cheeiro = require('cheerio');
const PATH = require('path');
const htmlFiles = new Array();

const getFileList = (filePath, fileNameReg) => {

    let pathArray = fs.readdirSync(filePath);

    pathArray.forEach((path) => {
        let absPath = filePath + PATH.sep + path;
        let isDir = fs.statSync(absPath);

        //Recursion
        if (isDir.isDirectory()) { getFileList(absPath, fileNameReg); return; };

        if (fileNameReg.test(absPath)) { htmlFiles.push(absPath); };
    });
};
//传文件不是传数组
const removeTag = (filePath, tagName) => {
    fs.readFile(filePath, (err, data) => {

        if (err) { console.log(err); return; }

        let $ = cheeiro.load(data.toString());
        $(tagName).remove();

        fs.writeFile(filePath, $.html().toString(), (err) => {
            err ? console.error(err) : console.log("format file success :", filePath);
        });

    });
};

const main = () => {

    const rootPath = process.argv.slice(2).toString(); //get rootPath file from power shell

    getFileList(rootPath, /\.html/g);   //get all html files from rootPath save in htmlFiles

    htmlFiles.map(item => {
        removeTag(item, "script");
    });
};

main();
