var fs = require('fs')


var filePath = 'comment.json'


// 用来存储 Comment 数据的对象
const ModelComment = function (form) {
  this.author = form.author || ''
  this.content = form.content || ''
  this.blog_id = form.blog_id || 0
  // 生成一个 unix 时间
  this.created_time = Math.floor(new Date() / 1000)
}

const loadData = function () {
  var content = fs.readFileSync(filePath, 'utf8')
  var data = JSON.parse(content)
  return data
}

var b = {
  data: loadData()
}

b.all = function () {
  return this.data
}

b.new = function (form) {
  var m = new ModelComment(form)
  // console.log('new blog', form, m)
  // 设置新数据的 id
  var d = this.data[this.data.length - 1]
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

b.save = function () {
  var s = JSON.stringify(this.data)
  fs.writeFile(filePath, s, (err) => {
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
data 属性用来存储所有的 comment 对象
all 方法返回一个包含所有 comment 的数组
new 方法来在数据中插入一个新的 comment 并且返回
save 方法来保存更改到文件中
*/