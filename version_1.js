const fs = require('fs');
const cheeiro = require('cheerio')

//顶层目录.这里的路径换一下就可以运行
const MyPath = 'F:\\data\\PHP_Pro01';

const readDirSync = (path) =>
{
    let pathArray = fs.readdirSync(path);

    pathArray.forEach((element, index) =>
    {
        let info = fs.statSync(path + "\\" + element);

        if (info.isDirectory()) {
            readDirSync(path + "\\" + element);
        }
        else {
            let filepath = path + "\\" + element;
            let fileNameReg = /\.html/g;
            let isHTML = fileNameReg.test(filepath);

            if (isHTML) {
                fs.readFile(filepath, (err, data) =>
                {
                    if (err) { console.error(err); return }
                    // <--- cheeiro --->
                    $ = cheeiro.load(data.toString())
                    $("script").remove()
                    writeFile(filepath, $.html().toString())
                })
            }
        }
    });
};
function writeFile(path, code)
{
    fs.writeFile(path, code, (err) =>
    {
        if (err) {
            console.error(err)
        }
        else {
            console.log("format file success :", path);
        }
    })
}
readDirSync(MyPath);
