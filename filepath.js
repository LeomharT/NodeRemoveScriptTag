const fs = require('fs');
const path = require("path");
const cheeiro = require('cheerio')

const MyPath = 'F:\\data\\PHP_Pro01';

const readDirSync = (path) =>
{
    let ps = fs.readdirSync(path);
    ps.forEach((element, index) =>
    {
        let info = fs.statSync(path + "\\" + element);
        if (info.isDirectory()) {
            readDirSync(path + "\\" + element);
        }
        else {
            let filepath = path + "\\" + element;
            let fileNameReg = /\.html/g;
            //filepath是否满足fileNameReg的正则表达式
            let shouldFormat = fileNameReg.test(filepath);
            if (shouldFormat) {
                console.log("find html file:" + filepath);
                fs.readFile(filepath, (err, data) =>
                {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        // <---cheeiro--->
                        $ = cheeiro.load(data.toString())
                        $("script").remove()
                        console.log($.html())
                        writeFile(filepath, $.html().toString())


                        //<---正则表达式的方式--->
                        // let codeText = data.toString()
                        // let ScriptRegExp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
                        // while (ScriptRegExp.test(codeText)) {
                        //     codeText = codeText.replace(ScriptRegExp, "")
                        // }
                        // writeFile(filepath, codeText)
                        // console.log(codeText)
                    }

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
