//对象转json
(function ($) {
  //json序列化
  $.fn.serializeJson = function () {
      var serializeObj = {};
      var array = this.serializeArray();
      $(array).each(function () {
          if (serializeObj[this.name]) {
              if ($.isArray(serializeObj[this.name])) {
                  serializeObj[this.name].push(this.value);
              } else {
                  serializeObj[this.name] = [serializeObj[this.name], this.value];
              }
          } else {
              serializeObj[this.name] = this.value;
          }
      });
      return serializeObj;
  };


})(jQuery);
//登录
var loginUrl = window.location.origin+ "/Account";
var Requests = {

  cacheDatas: {},//内容包括id,param

  /**
   * 默认为post  没loading  异步
   * @param {any} url 路径
   * @param {any} param 参数
   * @param {any} callback 放回值
   * @param {any} async 是否异步
   * @param {any} type 请求类型 GET|POST
   * @param {any} processData 必须false才会避开jQuery对 formdata 的默认处理XMLHttpRequest会对 formdata 进行正确的处理
   * @param {any} contentType !=false application/json;charset=utf-8
   * @param {any} isLoading 是否有loading
   */
  Ajax: function (url, param, callback, async, type, processData, contentType, isLoading) {
      type = type || "POST";
      async = async || true;
      isLoading = isLoading || true;
      if (contentType !== false) {
          contentType = "application/json;charset=utf-8";
      }
      if (processData !== false) {
          processData = true;
      }
      $.ajax({
          url: url,
          data: param,
          type: type,
          async: async,
          cache: false,
          headers: {
              Authorization: ("Bearer "+ localStorage.getItem("access_token"))
          },
          contentType: contentType,
          /**
              * 必须false才会避开jQuery对 formdata 的默认处理XMLHttpRequest会对 formdata 进行正确的处理
              */
          processData: processData,
          success: function (data) {
              if (500 === data.code)
              {
                  alert("请稍后再试 ~_~");
                  try {
                      removeLoading();
                  } catch (e) {
                      console.log("noLoading");
                      }
                  return;
              }
              if (10001 === data.code) {
                  alert("登录状态失效,请重新登录");
                  window.location.href = loginUrl +"?redirectUrl="+ window.location.href;
              }
              if (10004 === data.errorCode) {
                  if (confirm("您没此权限是否重新登录")) {
                      window.location.href = loginUrl + "?redirectUrl=" + window.location.href;
                  } else {
                      return;
                  }
              }
              callback(data);
              try {
                  removeLoading();
              } catch (e) {
                  console.log("noLoading");
              }
          },
          error: function () {
              if (isLoading) {
                  alert("请稍后再试 ~_~");
                  try {
                      removeLoading();
                  } catch (e) {
                      console.log("noLoading");
                  }
              }

          }
      });
  },
  //缓存没Loading异步
  CacheNoLoadingPost: function (url, param, callback) {
      var self = this;
      if (param in self.cacheDatas) {
          callback(self.cacheDatas[param + url]);
          return false;
      }
      self.Ajax(url, param, function (data) {
          self.cacheDatas[param + url] = data;
          callback(data);
      }, true, "POST", true, true, false);

      return false;
  },
  //缓存没Loading异步
  NoCacheNoLoadingPost: function (url, param, callback) {
      var self = this;

      self.Ajax(url, param, function (data) {
          self.cacheDatas[param + url] = data;
          callback(data);
      }, true, "POST", true, true, false);

      return false;
  },
  //缓存Loading异步
  CacheAsyncPost: function (url, param, callback) {
      var self = this;
      if (param in self.cacheDatas) {
          callback(self.cacheDatas[param]);
          return false;
      }
      loadingFunction();
      self.Ajax(url,
          param,
          function (data) {
              self.cacheDatas[param] = data;
              callback(data);
          });
  },
  AsyncLoadingPost: function (url, param, callback) {
      loadingFunction();
      this.Ajax(url, param, callback);
  },
  //用于传文件有loading
  FormDataPost: function (url, formData, callback) {
      loadingFunction();
      this.Ajax(url, formData, callback, true, "POST", false, false);
  }, //用于传文件有loading
  FormDataPostNoAsync: function (url, formData, callback) {
      loadingFunction();
      this.Ajax(url, formData, callback, false, "POST", false, false);
  },
  Get: function (url, callback) {
      loadingFunction();
      this.Ajax(url, "", callback, true, "GET");

  },
  AsyncGet: function (url, data, callback) {
      loadingFunction();
      this.Ajax(url, data, callback, true, "GET");
  },
  AsyncCacheGet: function (url, param, callback) {
      var self = this;
      if (param + url in self.cacheDatas) {
          callback(self.cacheDatas[param + url]);
          return false;
      }
      loadingFunction();
      this.Ajax(url, param, function (data) {
          self.cacheDatas[param + url] = data;
          callback(data);
      }, true, "GET");
  },
  AsyncCacheGetNoLoading: function (url, param, callback) {
      var self = this;
      if (param + url in self.cacheDatas) {
          callback(self.cacheDatas[param + url]);
          return false;
      }
      this.Ajax(url, param, function (data) {
          self.cacheDatas[param + url] = data;
          callback(data);
      }, true, "GET", true, true, false);
  }
};
//提取 收起 和 展开 公共部分
// myflip 点击 收起和展开的小图标的id[带'#']
// mypane 是要显示和隐藏的部分
function upOrDown(myflip, mypane) {

  var temp = $(myflip)[0].src.split('/');
  var srcUri = temp[temp.length - 1];
  var path = '/images/';

  if (srcUri === 'up.png') {
      $(myflip).attr('src', path + "down.png");
  } else {
      $(myflip).attr('src', path + "up.png");
  }
  $(mypane).slideToggle();
}

//判断权限
var Check= {
  checkMenuCode:function (codeStr) {
      var codes = localStorage.getItem("menuCode");
      if (codes === undefined||codes===null || codes === "") {
          return false;
      }
      return codes.includes(codeStr);
  }
}
//日期选择控件
$(function () {
  $(document).on('click', '#DateTimes', function () {
      DateChoice.datetime(this);
  });
  $(document).on('click', '#Dates', function () {
      DateChoice.date(this);
  });
  $(document).on('click', '#delayendtime', function () {
      DateChoice.datetimeformat(this);
  });
  $(document).on('click', '.DateTimes', function () {
      DateChoice.datetime(this);
  });
  $(document).on('click', '.Dates',
      function () {
          DateChoice.date(this);
          javascript: { $(this).trigger('change'); }

      });
  $(document).on('click', '.delayendtime', function () {
      DateChoice.datetimeformat(this);
  });




  $(document).on('focus', '#DateTimes', function () {
      DateChoice.datetime(this);
  });
  $(document).on('focus', '#Dates', function () {
      DateChoice.date(this);
  });
  $(document).on('focus', '#delayendtime', function () {
      DateChoice.datetimeformat(this);
  });
  $(document).on('focus', '.DateTimes', function () {
      DateChoice.datetime(this);
  });
  $(document).on('focus', '.Dates',
      function () {
          DateChoice.date(this);
          javascript: { $(this).trigger('change'); }

      });
  $(document).on('focus', '.delayendtime', function () {
      DateChoice.datetimeformat(this);
  });

});
var DateChoice = {
  datetime: function (elem) {

      laydate.render({
          elem: elem
          , theme: "molv"
          , type: 'datetime'
      });
  },
  date: function (elem) {
      laydate.render({
          elem: elem
          , theme: "molv"

          , format: 'yyyy-MM-dd'
      });
  },
  datetimeformat: function (elem) {
      laydate.render({
          elem: elem
          , theme: "molv"
          , format: 'yyyy/MM/dd HH:mm:ss'
      });
  }
};

//日期格式化
function Format(datetime, fmt) {
  if (parseInt(datetime) == datetime) {
      if (datetime.length == 10) {
          datetime = parseInt(datetime) * 1000;
      } else if (datetime.length == 13) {
          datetime = parseInt(datetime);
      }
  }
  datetime = new Date(datetime);
  var o = {
      "M+": datetime.getMonth() + 1,                 //月份
      "d+": datetime.getDate(),                    //日
      "h+": datetime.getHours(),                   //小时
      "m+": datetime.getMinutes(),                 //分
      "s+": datetime.getSeconds(),                 //秒
      "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
      "S": datetime.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function LayoutActive(title) {
  console.log(title);

  $("#titleUl").children().each(function () {
      if ($(this).text() === title) {
          $(this).attr({ "class": "active" });
      } else {
          $(this).css({ "class": "" });

      }
  });
}


//真的上传图片
function editUpFile(url, that, callback) {


  var upFileFormData = new FormData();
  upFileFormData.append("file", that.get(0).files[0]);
  upFileFormData.append("mimeType", "");
  Requests.FormDataPost(url, upFileFormData, function (data) {
      callback(data);
  });

}

//真的上传图片
function editUpFile2(url, that, callback) {

  var upFileFormData = new FormData();
  upFileFormData.append("file", that.get(0).files[0]);
  upFileFormData.append("mimeType", "");
  Requests.FormDataPostNoAsync(url, upFileFormData, function (data) {
      callback(data);
  });

}