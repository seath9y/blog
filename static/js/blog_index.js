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
  var id = blog.id
  var title = blog.title
  var author = blog.author
  var content = blog.content
  // var content = marked(blog.content)
  var tag = blog.tag
  var d = new Date(blog.created_time * 1000)
  var time = d.toLocaleString()

  var converter = new showdown.Converter() //初始化转换器
  var htmlcontent = converter.makeHtml(content) //将MarkDown转为html格式的内容

  var t = `
    <div class="blog-cell">
        <div class="div-blog-title">
          <a class="blog-title" href="/blog?id=${id}" data-id="${id}">
            ${title}
          </a>
        </div>
        <div class="blog-content">
            ${htmlcontent}
        </div>
        <div class="blog-bottom">
          <i class="iconfont icon">&#xe688;</i>
          <span class="blog-author">${author}</span>
          <i class="iconfont icon">&#xe661;</i>
          <time class="blog-time">${time}</time>
          <i class="iconfont icon">&#xe62c;</i>
          <time class="blog-tag">${tag}</time>
        </div>
    </div>
    `
  return t
}

var insertBlogs = function (blogs) {
  var html = ''
  for (var i = 0; i < blogs.length; i++) {
    var b = blogs[i]
    var t = blogTemplate(b)
    html += t
  }
  // 把数据覆盖式写入 blogs 中
  var div = document.querySelector('.blogs')
  div.innerHTML = html

  showContent()
}

var blogAll = function () {
  var request = {
    method: 'GET',
    url: '/api/blog/all',
    contentType: 'application/json',
    callback: function (response) {
      // console.log('响应', response)
      var blogs = JSON.parse(response)
      window.blogs = blogs
      insertBlogs(blogs)
    }
  }
  ajax(request)
}

var blogNew = function (form) {
  // var form = {
  //   title: "测试标题",
  //   author: "sx",
  //   content: "测试内容",
  // }
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
    let form = {
      title: document.querySelector('#id-input-title').value,
      author: document.querySelector('#id-input-author').value,
      content: document.querySelector('#id-input-content').value,
      tag: document.querySelector('#id-input-tag').value
    }
    blogNew(form)
    // console.log(form)
    location.reload()
  })
}

// content预览截取
var showContent = function () {
  let contents = document.querySelectorAll('.blog-content')
  for (let i = 0; i < contents.length; i++) {
    let e = contents[i].innerText
    if (e.length > 90) {
      e = e.slice(0, 75) + ' ...'
      contents[i].innerText = e
    }
  }
}

//选择标签加载对应blog
var tagBlog = function (tag) {
  if (tag == '全部') {
    insertBlogs(window.blogs)
  } else {
    var blogs = window.blogs.filter(function (item, index) {
      if (item.tag == tag) {
        return true
      }
    })
    insertBlogs(blogs)
  }
}

//标签选择切换
var changeTag = function () {
  let tagsList = document.querySelector('.tag-list')
  tagsList.addEventListener('click', function (e) {
    var e = e.target
    let tagsLi = document.querySelectorAll('.tag-list li')
    for (let i = 0; i < tagsLi.length; i++) {
      const element = tagsLi[i]
      element.classList.remove('active')
    }
    e.classList.add('active')
    if (e.innerText == 'git' || 'js' || 'vue' || 'node' || '全部') {
      tagBlog(e.innerText)
    }
  })
}


var mditorConfig = function () {
  Mditor.fromTextarea(document.getElementById('id-input-content'))
}

var __main = function () {
  // 载入博客列表
  blogAll()
  bindEvents()
  changeTag()
  mditorConfig()
}
__main()

// var editor = new Mditor(document.getElementById('id-input-content'), {
//   //自定义显示效果class
//   previewClass: 'article'
// });