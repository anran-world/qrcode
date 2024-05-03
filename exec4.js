//获取签名的后台接口
const s = location.href.split("?")[1], arr = s.split("-"), uid = arr[0], token = arr[1].trim(), code = "ok"
const flag = location.href.indexOf('index2')>-1
const url = flag ? 'test/' : 'svip/scan/bond'

const QrCode = new QrCodeRecognition({
    sweepId: "#canvas",
    uploadId: "#file",
    error: function (err) {
        // 识别错误反馈
    },
    success: function (res) {
        // 识别成功反馈
        
        layer.load(0, { shade: 0.7 })
        let data
        if (flag) {
            $.ajax({
                url: url+'wp/QrCodeScan',
                type: "POST",
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({
                    url: res.data,
                    isWX: false,
                    code: arr[1],
                }),
                success: function (data) {

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
                        paramEx["cardCode"] = arr[1];
                        paramEx["Referer"] = res.data;
                        paramEx["Ua"] = 'mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/111.0.0.0 safari/537.36';
                        $.ajax({
                            url: url+'wp',
                            type: "POST",
                            contentType: 'application/json;charset=UTF-8',
                            data: JSON.stringify(paramEx),
                            success:function (data0) {
                                if (data0.isSuccess) {
                                    alert("扫码登录成功");
                                } else {
                                    alert(data0.message);
                                }
                                location.reload()
                            }
                        })
                    } catch (f) {
                        confirm(f)
                    }
                },
                error: function () {
                    confirm('识别失败，请检查二维码是否正确！')
                    window.location.reload()
                },
            })
        } else {
            $.ajax({
                url,
                type: "POST",
                data: {
                    qr: res.data,
                    uid,
                    token,
                    code,
                },
                success: function (data) {
                    confirm(data.msg || data.msg)
                    window.location.reload()
                },
                error: function () {
                    confirm('识别失败，请检查二维码是否正确！')
                    window.location.reload()
                },
            })
        }
       
    },
})

function handleUpload() {
    document.querySelector("#file").click()
}

// 从相册选择
function upload() {
    QrCode.upload()
}
