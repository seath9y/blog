var ajax = function (request) {
  /*
  request 是一个 object, 有如下属性
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

// var blogAll = function () {
//   var request = {
//     method: 'GET',
//     url: '/api/blog/all',
//     contentType: 'application/json',
//     callback: function (response) {
//       console.log('响应', response)
//       var res = JSON.parse(response)
//       if (res.success) {
//         // window.location.href = '/'
//       } else {
//         // alert('登录失败')
//       }
//     }
//   }
//   ajax(request)
// }

var init = function () {
  var request = {
    method: 'GET',
    url: '/api/blog/all',
    contentType: 'application/json',
    callback: function (response) {
      // console.log('响应', response)
      var blogs = JSON.parse(response)
      window.blogs = blogs
      let blogId = window.window.location.search.slice(-1)
      let blog = blogs[blogId - 1]
      window.blog = blog
      insertBlog(blog)
      insertComment(blog.comments)
      console.log(blog);
    }
  }
  ajax(request)
}

var blogContentTemplate = function (blog) {
  var id = blog.id
  var title = blog.title
  var author = blog.author
  var tag = blog.tag
  var d = new Date(blog.created_time * 1000)
  var time = d.toLocaleString()

  var content = blog.content
  var converter = new showdown.Converter() //初始化转换器
  var htmlcontent = converter.makeHtml(content) //将MarkDown转为html格式的内容

  var t = `
    <div class="blog">
      <h1 class="blog-title" href="/blog?id=${id}" data-id="${id}">
        ${title}
      </h1>
      <hr>
      <div class="blog-author">
        <span>作者：${author}</span>
      </div>
      <div class="blog-time">
        <time>日期：${time}</time>
      </div>
      <div class="blog-tag">
        <time>标签：${tag}</time>
      </div>
      <p class="blog-content">
        <span>${htmlcontent}</span>
      </p>
    </div>
    `
  return t
}

var blogCommentTemplate = function (comment) {
  var id = comment.id
  var author = comment.author
  var content = comment.content
  var d = new Date(comment.created_time * 1000)
  var time = d.toLocaleString()
  var t = `
    <div class="comment-cell">
        <div class="">
            <span>${author}</span> @ <time>${time}</time>
        </div>
        <div class="">
            <span>${content}</span>
        </div>
    </div>
    `
  return t
}

var insertBlog = function (blog) {
  var html = ''
  var t = blogContentTemplate(blog)
  html = t
  var div = document.querySelector('.blog-content')
  div.innerHTML = html
}

var insertComment = function (comments) {
  var html = ''
  for (var i = 0; i < comments.length; i++) {
    var b = comments[i]
    var t = blogCommentTemplate(b)
    html += t
  }
  // 把数据覆盖式写入 blogs 中
  var div = document.querySelector('.blog-comments')
  div.innerHTML = html
}

var commentNew = function (form) {
  var data = JSON.stringify(form)
  var request = {
    method: 'POST',
    url: '/api/comment/add',
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
  let button = document.querySelector('#id-comment-add')
  button.addEventListener('click', function (event) {
    let form = {
      author: document.querySelector('#new-comment-author').value,
      content: document.querySelector('#new-comment-comtent').value,
      blog_id: parseInt(window.location.search.slice(-1))
    }
    if (form.content == "") {
      alert('内容不能为空！')
    } else if (form.author == "") {
      alert('作者不能为空！')
    } else {
      commentNew(form)
    }
    console.log(form)
  })
}

var __main = function () {
  init()
  bindEvents()
}
__main()