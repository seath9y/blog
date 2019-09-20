var ajax = function (request) {
  /*
      method, 请求的方法, string
      url, 请求的路径, string
      data, 请求发送的数据, 如果是 GET 方法则没这个值, string
      callback, 响应回调, function
  */
  var r = new XMLHttpRequest()
  r.open(request.method, request.url, true)
  if (request.contentType !== undefined) {
    r.setRequestHeader('Content-Type', request.contentType)
  }
  r.onreadystatechange = function (event) {
    if (r.readyState === 4) {
      request.callback(r.response)
    }
  }
  if (request.method === 'GET') {
    r.send()
  } else {
    r.send(request.data)
  }
}

var blogTemplate = function (blog) {
  var title = blog.title
  var author = blog.author
  var d = new Date(blog.created_time * 1000)
  var time = d.toLocaleString()
  var t = `
    <div class="sx-blog-cell">
        <div class="blog-title">${title}</div>
        <div class="">
            <span>${author}</span> @ <time>${time}</time>
        </div>
    </div>
    `
  return t
}

var insertBlogAll = function (blogs) {
  var html = ''
  for (var i = 0; i < blogs.length; i++) {
    var b = blogs[i]
    var t = blogTemplate(b)
    html += t
  }
  // 把数据覆盖式写入 blogs 中
  var div = document.querySelector('.blogs')
  div.innerHTML = html
}

var blogAll = function () {
  var request = {
    method: 'GET',
    url: '/api/blog/all',
    contentType: 'application/json',
    callback: function (response) {
      console.log('响应', response)
      var blogs = JSON.parse(response)
      insertBlogAll(blogs)
    }
  }
  ajax(request)
}

var blogNew = function () {
  var form = {
    title: "测试标题",
    author: "sx",
    content: "测试内容",
  }
  var data = JSON.stringify(form)
  var request = {
    method: 'POST',
    url: '/api/blog/add',
    data: data,
    contentType: 'application/json',
    callback: function (response) {
      console.log('响应', response)
      var res = JSON.parse(response)
    }
  }
  ajax(request)
}

var bindEvents = function (param) {
  //发表新博文事件
  let button = document.querySelector('#id-button-submit')
  button.addEventListener('click', function (event) {
    console.log('click')
  })
}
var __main = function () {
  // 载入博客列表
  blogAll()
  bindEvents()
}

__main()