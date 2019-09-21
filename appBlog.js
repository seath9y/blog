var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))

const blog = require('./blog')
const comment = require('./comment')


var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}


app.get('/', function(request, response) {
    var path = 'blog_index.html'
    sendHtml(path, response)
})

app.get('/blog', function(request, response) {
    console.log('query', request.query)
    var path = 'blog_detail.html'
    sendHtml(path, response)
})



// api
app.get('/api/blog/all', function(request, response) {
    // console.log(typeof blog, blog, Object.keys(blog))
    var blogs = blog.all()
    var r = JSON.stringify(blogs)
    response.send(r)
})

app.post('/api/blog/add', function(request, response) {
    var form = request.body
    var b = blog.new(form)
    var r = JSON.stringify(b)
    response.send(r)
})

app.post('/api/comment/add', function(request, response) {
    var form = request.body
    var c = comment.new(form)
    var r = JSON.stringify(c)
    response.send(r)
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
