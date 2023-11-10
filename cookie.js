function request(obj) {
    $.ajax({
        async: true,
        type: "post",
        dataType: "json",
        data: obj.data,
        url: basePath + obj.url,
        xhrFields: {
            withCredentials: true // 携带跨域cookie
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        success: function (data) {
            if (obj.test) console.log(data);
            if (data.success) {
                if (obj.msg) message.info(data.message);
            } else {
                message.error('发生错误： ' + data.message);
            }
            if (obj.callBack) obj.callBack(data.success, data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("error in $.ajax():	" +
                "\n	XMLHttpRequest.status:" + XMLHttpRequest.status +
                "\n	XMLHttpRequest.readyState:" + XMLHttpRequest.readyState +
                "\n	textStatus:" + textStatus +
                "\n	errorThrown:" + errorThrown);
        }
    });
}

//初始化cookie
var cookies = {};

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
        (expiredays ? ";expires=" + exdate.toGMTString() : "") +
        (basePath ? ";path=" + basePath : "");
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function InitCookies() {
    cookies = JSON.parse(getCookie('jztz_cookies') == "" ? "{}" : getCookie('jztz_cookies'));
}

function setCookies(name, data) {
    cookies[name] = data;
    setCookie('jztz_cookies', JSON.stringify(cookies), 30);
}

function removeCookies(name) {
    delete cookies[name];
    setCookie('jztz_cookies', JSON.stringify(cookies), 30);
}

function removeAllCookies() {
    cookies = {};
    setCookie('jztz_cookies', JSON.stringify(cookies), 30);
}

InitCookies();

var message = {
    showInfoIndex: 0,
    showErrorIndex: 0,
    info(msg, delay) {
        var cMsg = $("#layer");
        cMsg.html(msg);
        cMsg.attr("style", "color: #F2F6FC; opacity: 1;");

        this.showInfoIndex++;
        var index = parseInt(this.showInfoIndex + '');
        setTimeout(function () {
            if (index == message.showInfoIndex) {
                cMsg.animate({opacity: '0'});
            }
        }, delay ? delay : 2000)
    },
    error(msg, delay) {
        var cMsg = $("#layer");
        cMsg.html(msg);
        cMsg.attr("style", "color: #F56C6C; opacity: 1;");

        this.showErrorIndex++;
        var index = parseInt(this.showErrorIndex + '');
        setTimeout(function () {
            if (index == message.showErrorIndex) {
                cMsg.animate({opacity: '0'});
            }
        }, delay ? delay : 2000)
    }
}