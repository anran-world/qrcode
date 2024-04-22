 //用js创建一个chanvas元素
 const host = "https://blog.huoyuan.tk/test";
 // const host = window.location.origin;

 $("body").append('<canvas id= "qrcanvas" style= "display:none;"></canvas>')
 //当input框发生变化时，执行下面的代码
 $("#pull_image").change(function (e) {
     // debugger
     //获取这个文件element里面的属性
     var file = e.target.files[0];
     //判断源文件window.FileReader这个属性是否存在，存在就继续继续，不存在就不执行
     if (window.FileReader) {
         var newFile = new FileReader();
         newFile.readAsDataURL(file);
         newFile.onload = function (e) {
             //获取文件对应的base
             var base64Data = e.target.result;
             //通过函数函数传参，把原文件base64信息传到下面的函数中
             base64Qr(base64Data, false);
         }
     }
 })

 //此处的data其实就是上面 base64Qr(base64Data) 函数传参的数据
 function base64Qr (data, isScan) {
     var canvas = document.getElementById('qrcanvas');
     var ctx = canvas.getContext("2d");
     var img = new Image();
     img.src = data;
     img.onload = function () {
         $("#qrcanvas").attr('width', img.width)
         $("#qrcanvas").attr('height', img.height)
         ctx.drawImage(img, 0, 0, img.width, img.height);
         //获取源文件具体的数据
         var imageData = ctx.getImageData(0, 0, img.width, img.height);
         //解析出源文件具体携带的信息
         var code = jsQR(imageData.data,
             imageData.width,
             imageData.height,
             {
                 inversionAttempts: "dontinvert"
             });
         //code存在，说明携带信息，就执行下面的代码
         if (code) {
             console.log(code);
             isRequest = true;
             showCode(code.data, false);
             isRequest = false;
         } else if (!isScan) {
             alert("识别错误");
         }
     };
 }

 $.getUrlParam = function (name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
 var realRequest = false;
 function showCode (code, isWx) {
     realRequest = true;
     var cardCode = $.getUrlParam('cardCode');
     Requests.AsyncLoadingPost(host + "/wp/QrCodeScan",
         JSON.stringify({
             url: code,
             code: cardCode,
             isWX: isWx
         }),
         function (data) {

             if (!data.isSuccess) {
                 alert(data.message);
                 return;
             }
             data = data.result;
             try {
                 var i = "OOOO00",
                     r = "OOO00O",
                     o = "OOO000",
                     a = "OOO0OO",
                     s = "O0OOO0",
                     c = {
                         OOOOO0: i,
                         O00000: r,
                         O0O00O: o,
                         O000OO: a,
                         O0O000: s
                     },
                     u = (new Date)
                         .getTime() /
                         1e3,
                     l = parseInt(u / 86400, 10) % 5,
                     d = c[Object.keys(c)[l]] || "";
                 var paramEx = window.moonshadV3[d](data);
                 console.log(data.sign)
                 //data["paramEx"] = JSON.stringify(paramEx);
                 paramEx["data"] = JSON.stringify(data);
                 paramEx["cardCode"] = cardCode;
                 paramEx["Referer"] = code;
                 paramEx["Ua"] = 'mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/111.0.0.0 safari/537.36';
                 Requests.AsyncLoadingPost(host + "/wp",
                     JSON.stringify(paramEx),
                     function (data0) {
                         if (data0.isSuccess) {
                             alert("扫码登录成功");
                         } else {
                             alert(data0.message);
                         }
                         location.reload()
                     });
             } catch (f) {
                 console.log(f)
             }


         });

 }

 function wp () {
     var scUrl = $.getUrlParam("qrresult");
     if (scUrl != undefined && scUrl.length > 0) {
         showCode(scUrl, true);
     }

 }

 $(function () {
     if (wxs) {
         wp();
     }
     // var host = 'https://haojiyou.eu.org/test';
     // // var host = window.location.origin;
     // var cardCode = $.getUrlParam('cardCode');
     // //检查卡
     // Requests.AsyncGet(host + "/wp?cardCode=" + cardCode,
     //     {},
     //     function (data) {
     //         if (!data.isSuccess) {
     //             $("#containId").html(data.message)
     //         } else {
     //             $("#headId").html("TIME:" + "  " + data.result.endTime + "   剩余次数:" + data.result.canUseTimes);
     //             if (wxs) {
     //                 wp();
     //             }

     //         }
     //     });
 })
 $(document).on('click',
     '#upFileImg',
     function () {
         $("#pull_image").click();
     });
 $(document).on('click',
     '#scanImg',
     function () {
         if (wxs) {
             var url = "http://996315.com/api/scan/?redirect_uri=" + $(location).attr('href');
             //用js创建一个chanvas元素
             $(location).attr('href', url);
         } else {
             try {
                 if (intervalInt != -9999) {
                     window.clearInterval(intervalInt);
                 }
                 $("#onediv").hide();
                 $("#towdiv").show();
                 var model = "environment";
                 //开启摄像头
                 if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {

                     getUserMedia({ video: { width: 500, height: 500, facingMode: model } }, success, error);


                     context.drawImage(video, 0, 0, 500, 500);
                     //不断扫描二维码
                     var intervalInt = setInterval("ScanQr()", 500);
                 } else {
                     alert("不支持");
                     return;
                 }

             } catch (e) {
                 console.log(e)
             }
         }

     });


 // =====mozilla/5.0 (iphone; cpu iphone os 15_1 like mac os x) applewebkit/605.1.15 (khtml, like gecko) mobile/15e148 micromessenger/8.0.17(0x1800112b) nettype/4g language/zh_cn
 //判断是否是微信浏览器的函数
 function isWeiXin () {
     //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
     var ua = window.navigator.userAgent.toLowerCase();

     //通过正则表达式匹配ua中是否含有MicroMessenger字符串
     if (ua.match(/MicroMessenger/i) == 'micromessenger') {
         //alert("是微信");
         return true;
     } else {
         // 		alert("不是微信");
         return false;
     }
 }

 var wxs = isWeiXin();

 //用来匹配不同的浏览器
 function getUserMedia (constraints, success, error) {
     if (navigator.mediaDevices.getUserMedia) {
         navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
     } else if (navigator.webkitGetUserMedia) {
         navigator.webkitGetUserMedia(constraints, success, error);
     } else if (navigator.mozGetUserMedia) {
         navigator.mozGetUserMedia(constraints, success, error);
     } else if (navigator.getUserMedia) {
         navigator.getUserMedia(constraints, success, error)
     }
 }

 var video = document.getElementById('video');
 var canvas = document.getElementById('canvas');
 var context = canvas.getContext('2d');

 //成功回调
 function success (stream) {
     video.srcObject = stream;
     video.play();
 }

 //失败回调
 function error (error) {
     console.log("访问用户媒体失败");
 }

 var intervalInt = -9999;


 var type = "jpg";
 var _fixType = function (type) {
     type = type.toLowerCase().replace(/jpg/i, 'jpeg');
     var r = type.match(/png|jpeg|bmp|gif/)[0];
     return 'image/' + r;
 };
 var isRequest = false;

 function ScanQr () {
     try {

         if (!isRequest) {
             isRequest = true;
             context.drawImage(video, 0, 0, 500, 500);
             var imgData = document.getElementById('canvas').toDataURL(type);
             imgData = imgData.replace(_fixType(type), 'image/octet-stream');
             base64Qr(imgData, true);
             if (!realRequest)
                 isRequest = false;
         }
     } catch (e) {
         console.log(e)
     }


 }
 function IMLive () {
     var cardCode = $.getUrlParam('cardCode');
     var param = {
         cardCode: cardCode,
         ua: navigator.userAgent.toLowerCase()
     }
     Requests.NoCacheNoLoadingPost(host + "/wp/live",
         JSON.stringify(param),
         function (data) {
             console.log(data);
             if (!data.isSuccess) {
                 alert(data.message);
                 var cardCode = $.getUrlParam('cardCode');
                 //用js创建一个chanvas元素
                 $(location).attr('href', host + "/index3.html?cardCode=" + cardCode);
             }

         });
 }
