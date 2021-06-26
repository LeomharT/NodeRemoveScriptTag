const FS = require("fs");
const PATH = require('path');
const CHEEIRO = require('cheerio');

const getFileList = (fs, folder, fileList, fileSeparator) => {

    if (!(fs.statSync(folder).isDirectory())) { return; }

    let pathArray = fs.readdirSync(folder);

    return pathArray.reduce((prev, curr) => {
        if (fs.statSync(folder + fileSeparator + curr).isDirectory()) {
            return prev.concat(getFileList(fs, (folder + fileSeparator + curr), fileList, fileSeparator));
        }
        else {
            return prev.concat(folder + fileSeparator + curr);
        }
    }, []);
};

const getHtmlFileList = (fielList, regexFilter) => {
    let htmlFileList = new Array();

    fielList.map(file => {
        if (!regexFilter.test(file)) { return; }
        htmlFileList = htmlFileList.concat(file);
    });

    return htmlFileList;
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

    // let allFiles = getFileList(FS, rootPath, new Array(), PATH.sep);

    // let htmlFiles = getHtmlFileList(allFiles, /\.html/g);

    let htmlFiles = getHtmlFileList(getFileList(FS, rootPath, new Array(), PATH.sep), /\.html/g);

    htmlFiles.map(item => {
        removeTag(item, "script", FS, CHEEIRO);
    });
};
main();
