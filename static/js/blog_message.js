
function save() {
    localStorage.messages = JSON.stringify(window.messages)
}

function lode() {
    var savemessages = localStorage.messages
    if (savemessages == undefined) {
        savemessages = '[]'
    }
    return JSON.parse(savemessages)
}
window.messages = lode()
var blogMessageTemplate = function (message) {
    var id = message.id
    var content = message.content
    var t = `
      <div class="message-cell">
        <div class="message-content">
          <span>${content}</span>
        </div>
      </div>
      `
    return t
  }

var insertMessage = function (messages) {
    var html = ''
    for (var i = 0; i < messages.length; i++) {
      var b = messages[i]
      var t = blogMessageTemplate(b)
      html += t
    }
    if (messages.length == 0) {
      html += `
        <div class="message-content">
          <span>暂无评论</span>
        </div>
      `
    }
    var div = document.querySelector('.blog-messages')
    div.innerHTML = html
  }

var mditorConfig = function () {
    Mditor.fromTextarea(document.getElementById('id-input-content'))
    mditor.split = false
    mditor.height = '200px'
    mditor.width = '100%'
    
}

var bindEvents = function (param) {
    let button = document.querySelector('#id-message-submit')
    button.addEventListener('click', function (event) {
      let form = {
        content: document.querySelector('#id-input-content').value,
      }
      if (form.content == "") {
        alert('内容不能为空！')
      } else {
        window.messages.push(form)
        save()
        console.log(window.messages, localStorage.messages);
        location.reload()
    }
    })
  }



var init = function init(params) {
    mditorConfig()
    bindEvents()
    insertMessage(window.messages)
}

init()


