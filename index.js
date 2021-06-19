//使用http模块 使用API
const http = require("http")
http.createServer((request,response)=>{
    response.writeHead(200,
        {'Content-Type':"text/plain"}
    )

    response.end("Hello NodeJS")
}).listen(8081)
console.log("localhost:8081")