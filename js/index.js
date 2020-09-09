$(function () {
  // 监听输入内容的实时输入
  $("body").delegate(".comment", "propertychange input", function () {
    // 当输入框没有内容时，默认按钮无法点击。当输入内容时，才可以点击
    if ($(this).val.length > 0) {
      // 按钮可点击
      $(".send").prop("disabled", false)
    } else {
      // 按钮不可点击
      $(".send").prop("disabled", true)
    }
  })

  // 通过cookie获取页码
  // let number = $.getCookie("pageNum") || 1
  // 通过hash获取页码
  let number = window.location.hash.substring(1) || 1

  // 获取页码
  getMsgPage()

  function getMsgPage() {
    $(".page").html("")
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=get_page_count",
      success: function (msg) {
        let obj = eval("(" + msg + ")")
        for (var i = 0; i < obj.count; i++) {
          let $a = $(`<a href="javascript:;">` + (i + 1) + `</a>`)
          if (i === number - 1) {
            $a.addClass("cur")
          }
          $(".page").append($a)
        }
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
  }

  // 获取第几页的数据
  getMsgList(number)

  function getMsgList(num) {
    $(".messageList").html("")
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=get&page=" + num,
      success: function (msg) {
        let obj = eval("(" + msg + ")")
        $.each(obj, function (key, value) {
          // 创建节点
          const $weiBo = createEle(value)
          $weiBo.get(0).obj = value
          // 将节点插入messageList中去
          $(".messageList").append($weiBo)
        })
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
  }

  // 监听发布按钮的点击
  $(".send").click(function () {
    // 拿到用户输入的内容
    const $comment = $(".comment").val()
    // 向服务器发送请求
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=add&content=" + $comment,
      success: function (msg) {
        // 解析JSON对象
        // 使用eval将返回的字符串转为JSON对象
        var obj = eval("(" + msg + ")")
        obj.content = $comment
        // 创建节点
        const $weiBo = createEle(obj)
        $weiBo.get(0).obj = obj
        // 将节点插入messageList中去
        $(".messageList").prepend($weiBo)
        // 获取页码
        getMsgPage()
        // 清空输入框
        $(".comment").val("")
        // 当内容超出6条时，将最下面一条数据移出
        if ($(".info").length > 6) {
          $(".info:last-child").remove()
        }
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
  })

  // 监听点赞按钮的点击
  $("body").delegate(".infoUp", "click", function () {
    $(this).text(parseInt($(this).text()) + 1)
    let obj = $(this).parents(".info").get(0).obj
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=acc&id=" + obj.id,
      success: function (msg) {
        console.log(msg)
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
  })

  // 监听踩按钮的点击
  $("body").delegate(".infoDown", "click", function () {
    $(this).text(parseInt($(this).text()) + 1)
    let obj = $(this).parents(".info").get(0).obj
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=ref&id=" + obj.id,
      success: function (msg) {
        console.log(msg)
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
  })

  // 监听删除按钮的点击
  $("body").delegate(".infoDel", "click", function () {
    $(this).parents(".info").remove()
    let obj = $(this).parents(".info").get(0).obj
    $.ajax({
      type: "get",
      url: "weibo.php",
      data: "act=del&id=" + obj.id,
      success: function (msg) {
        console.log(msg)
      },
      error: function (xhr) {
        console.log(xhr.status)
      }
    })
    // 重新加载本页的数据
    getMsgList($(".cur").html())
  })

  // 监听页码的点击
  $("body").delegate(".page>a", "click", function () {
    getMsgList($(this).html())
    // 通过cookie保存页码
    // $.addCookie("pageNum", $(this).html())
    // 通过hash保存页码
    window.location.hash = $(this).html()
    $(this).addClass("cur")
    $(this).siblings().removeClass("cur")
  })

  // 创建节点方法
  function createEle(obj) {
    const $weiBo = $(`
    <div class="info">
      <p class="infoText">` + obj.content + `</p>
      <p class="infoOperation">
        <span class="infoTime">` + getTime(obj.time) + `</span>
        <span class="infoHandle">
          <a href="javascript:;" class="infoUp">` + obj.acc + `</a>
          <a href="javascript:;" class="infoDown">` + obj.ref + `</a>
          <a href="javascript:;" class="infoDel">删除</a>
        </span>
      </p>
    </div>
    `)
    return $weiBo
  }

  // 获取当前时间
  function getTime(time) {
    const date = new Date(time * 1000)
    let y = date.getFullYear()
    let mon = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let min = date.getMinutes()
    if (mon <= 9) {
      mon = "0" + mon
    }
    if (d <= 9) {
      d = "0" + d
    }
    if (h <= 9) {
      h = "0" + h
    }
    if (min <= 9) {
      min = "0" + min
    }
    return y + "-" + mon + "-" + d + " " + h + ":" + min;
  }
});