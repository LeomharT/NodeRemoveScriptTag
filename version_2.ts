const fs = require('fs');
const cheeiro = require('cheerio');

/*
    Because function (--- getFileList---) is a recursion function.
    So i have to create an empty array.
    Then i use this array inside of(--- getFileList---).
    This array will contain all files in the path.
*/
const Files: any[] = new Array();
const getFileList = (filePath: string, fileSuffix: RegExp) =>
{
    let pathArray = fs.readdirSync(filePath);

    pathArray.forEach((path: string) =>
    {
        let absPath = filePath + "\\" + path;

        let isDir = fs.statSync(absPath);

        //Recursion
        if (isDir.isDirectory()) { getFileList(absPath, fileSuffix); return; };

        Files.push(absPath);
    });

};

//This function return the specific files that you require
const getTargetFiles = (fileList: any[], fileNameReg: RegExp) =>
{
    getFileList(myPath, fileNameReg);

    let requiredFile: any[] = new Array();

    fileList.forEach((fileName, index) =>
    {
        let isRequired = fileNameReg.test(fileName);

        if (isRequired) requiredFile.push(fileName);
    });

    return requiredFile;
};

const removeScript = (htmlFiles: any[]) =>
{
    htmlFiles.forEach((file: any, index: number) =>
    {
        fs.readFile(file, (err: any, data: any) =>
        {
            if (err) { console.error(err); return; }
            let $ = cheeiro.load(data.toString());
            $("script").remove();
            writeFile(file, $.html().toString());
        });
    });
};

const writeFile = (path: any, code: any) =>
{
    fs.writeFile(path, code, (err: any) =>
    {
        if (err)
        {
            console.error(err);
        }
        else
        {
            console.log("format file success :", path);
        }
    });
};

//顶层目录.这里的路径换一下就可以运行
const myPath: string = "F:\\data\\PHP_Pro01";

removeScript(getTargetFiles(Files, /\.html/g));