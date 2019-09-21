var fs = require('fs')


var blogFilePath = 'blog.json'


// 用来存储 Blog 数据的对象
const ModelBlog = function(form) {
  this.title = form.title || ''
  this.author = form.author || ''
  this.content = form.content || ''
  // 生成一个 unix 时间
  this.created_time = Math.floor(new Date() / 1000)
}

const loadBlogs = function() {
  var content = fs.readFileSync(blogFilePath, 'utf8')
  var blogs = JSON.parse(content)
  return blogs
}

var b = {
  data: loadBlogs()
}

b.all = function() {
  let blogs = this.data
  
  const comment = require('./comment')
  let comments = comment.all()
  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i]
    let cs = []
    for (let j = 0; j < comments.length; j++) {
      const c = comments[j]
      if (b.id == c.blog_id) {
        cs.push(c)
      }
    }
    b.comments = cs
  }
  
  return this.data
}

b.new = function(form) {
  var m = new ModelBlog(form)
  // console.log('new blog', form, m)
  // 设置新数据的 id
  var d = this.data[this.data.length-1]
  if (d == undefined) {
      m.id = 1
  } else {
      m.id = d.id + 1
  }
  // 把 数据 加入 this.data 数组
  this.data.push(m)
  // 把 最新数据 保存到文件中
  this.save()
  // 返回新建的数据
  return m
}

b.save = function() {
  var s = JSON.stringify(this.data)
  fs.writeFile(blogFilePath, s, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('保存成功')
    }
  })
}

module.exports = b
/*
b 对象
data 属性用来存储所有的 blogs 对象
all 方法返回一个包含所有 blog 的数组
new 方法来在数据中插入一个新的 blog 并且返回
save 方法来保存更改到文件中
*/