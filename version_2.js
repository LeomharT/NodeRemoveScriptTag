const fs = require('fs');
const cheeiro = require('cheerio');

/*
    Because function (--- getFileList---) is a recursion function.
    So i have to create an empty array.
    Then i use this array inside of(--- getFileList---).
    This array will contain all files in the path.
*/
const Files = new Array();
const getFileList = (filePath) =>
{
    let pathArray = fs.readdirSync(filePath);

    pathArray.forEach((path) =>
    {
        let absPath = filePath + "\\" + path;

        let isDir = fs.statSync(absPath);

        //Recursion
        if (isDir.isDirectory()) { getFileList(absPath); return; };

        Files.push(absPath);
    });

};

//This function return the specific files that you require
const getTargetFiles = (fileList, fileNameReg) =>
{
    getFileList(myPath);

    let requiredFile = new Array();

    fileList.forEach((fileName, index) =>
    {
        let isRequired = fileNameReg.test(fileName);

        if (isRequired) requiredFile.push(fileName);
    });

    return requiredFile;
};

const removeTag = (htmlFiles, tagName) =>
{
    htmlFiles.forEach((file, index) =>
    {
        fs.readFile(file, (err, data) =>
        {
            if (err) { console.error(err); return; }
            let $ = cheeiro.load(data.toString());
            $(tagName).remove();
            writeFile(file, $.html().toString());
        });
    });
};

const writeFile = (path, code) =>
{
    fs.writeFile(path, code, (err) =>
    {
        if (err) {
            console.error(err);
        }
        else {
            console.log("format file success :", path);
        }
    });
};


// const myPath: string = "F:\\data\\PHP_Pro01";
//顶层目录.从命令行读
const myPath = process.argv.slice(2).toString();
removeTag(getTargetFiles(Files, /\.html/g), "script");
