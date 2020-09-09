;(function ($, window) {
  $.extend({
    // 添加cookie
    addCookie: function (key, value, day, path, domain) {
      // 处理默认保存的路径
      // 获取文件所在路径，该路径为path
      let index = window.location.pathname.lastIndexOf("/")
      let currentPath = window.location.pathname.slice(0, index)
      path = path || currentPath
      // 处理默认保存的domain
      domain = domain || document.domain
      // 处理默认的过期时间
      if (!day) {
        document.cookie = key + "=" + value + ";path=" + path + ";domain=" + domain + ";"
      } else {
        let date = new Date()
        date.setDate(date.getDate() + day)
        document.cookie = key + "=" + value + ";expires=" + date.toGMTString() + ";path=" + path + ";domain=" + domain + ";"
      }
    },

    // 获取cookie
    getCookie: function (key) {
      let arr = document.cookie.split(";")
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i].split("=")
        if (temp[0].trim() === key) {
          return temp[1]
        }
      }
    },

    // 删除cookie。当删除指定路径的cookie时，要添加指定路径
    delCookie: function (key, path) {
      addCookie(key, getCookie(key), -1, path)
    }
  })
})(jQuery, window);