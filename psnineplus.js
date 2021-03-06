// ==UserScript==
// @name         PSN中文网功能增强
// @namespace    https://swsoyee.github.io
// @version      0.51
// @description  数折价格走势图，显示人民币价格，奖杯统计，发帖字数统计，楼主高亮，屏蔽黑名单用户发言，被@用户的发言内容显示等多项功能优化P9体验
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAMFBMVEVHcEw0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNuEOyNSAAAAD3RSTlMAQMAQ4PCApCBQcDBg0JD74B98AAABN0lEQVRIx+2WQRaDIAxECSACWLn/bdsCIkNQ2XXT2bTyHEx+glGIv4STU3KNRccp6dNh4qTM4VDLrGVRxbLGaa3ZQSVQulVJl5JFlh3cLdNyk/xe2IXz4DqYLhZ4mWtHd4/SLY/QQwKmWmGcmUfHb4O1mu8BIPGw4Hg1TEvySQGWoBcItgxndmsbhtJd6baukIKnt525W4anygNECVc1UD8uVbRNbumZNl6UmkagHeRJfX0BdM5NXgA+ZKESpiJ9tRFftZEvue2cS6cKOrGk/IOLTLUcaXuZHrZDq3FB2IonOBCHIy8Bs1Zzo1MxVH+m8fQ+nFeCQM3MWwEsWsy8e8Di7meA5Bb5MDYCt4SnUbP3lv1xOuWuOi3j5kJ5tPiZKahbi54anNRaaG7YElFKQBHR/9PjN3oD6fkt9WKF9rgAAAAASUVORK5CYII=
// @author       InfinityLoop, mordom0404
// @include      *psnine.com/*
// @include      *d7vg.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      http://code.highcharts.com/highcharts.js
// @require      https://unpkg.com/tippy.js@3/dist/tippy.all.min.js
// @license      CC BY-NC 4.0
// @supportURL   https://github.com/swsoyee/psnine-night-mode-CSS/issues/new
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    var settings = {
        // 功能0-2设置：鼠标滑过黑条即可显示内容
        hoverUnmark: true,// 设置为false则选中才显示
        // 功能1-1设置：高亮发帖楼主功能
        highlightBack : "#3890ff", // 高亮背景色
        highlightFront : "#ffffff", // 高亮字体颜色
        // 功能1-2设置：高亮具体ID功能（默认管理员id）[注：此部分功能源于@mordom0404的P9工具包：https://greasyfork.org/zh-CN/scripts/29343-p9%E5%B7%A5%E5%85%B7%E5%8C%85]
        highlightSpecificID : ["mechille", "sai8808", "jimmyleo","jimmyleohk"], // 需要高亮的ID数组
        highlightSpecificBack : "#d9534f", // 高亮背景色
        highlightSpecificFront : "#ffffff", // 高亮字体颜色
        // 功能1-6设置：屏蔽黑名单中的用户发言内容
        blockList : [], // 请在左侧输入用户ID，用逗号进行分割，如： ['use_a', 'user_b', 'user_c'] 以此类推
        // 功能2-2设置：汇率设置
        dollarHKRatio : 0.88, // 港币汇率
        dollarRatio : 6.9, // 美元汇率
        poundRatio : 7.8, // 英镑汇率
        yenRatio : 0.06, // 日元汇率
        // 功能5-1设置：是否在`游戏`页面启用降低无白金游戏的图标透明度
        filterNonePlatinum : true,
        filterNonePlatinumAlpha : 0.2 // 透密 [0, 1] 不透明
    }
    if(window.localStorage){
        if(window.localStorage["psnine-night-mode-CSS-settings"]){
            $.extend(settings,JSON.parse(window.localStorage["psnine-night-mode-CSS-settings"]))//用storage中的配置项覆盖默认设置
        }
    }else{
        console.log("浏览器不支持localStorage,使用默认配置项")
    }

    // 全局优化
    // 功能0-1：点击跳转到页面底部
    $(".bottombar").append("<a href='javascript:scroll(0, document.body.clientHeight)' class='yuan mt10'>B</a>")

    // 功能0-2：黑条文字鼠标悬浮显示
    if(settings.hoverUnmark){
        $(".mark").hover(function(i){
            var backGroundColor = $(".box.mt20").css("background-color")
            $(this).css({"color": backGroundColor})
        }, function(o){
            var sourceColor = $(this).css("background-color")
            $(this).css({"color": sourceColor})
        })
    }
    // 功能0-3：markdown语法支持测试
    // var originalContent = $("div.content.pb10").html().split("<br>")
    // function repeat(target, n) {
    //     var s = target, total = "";
    //     while (n > 0) {
    //         if (n % 2 == 1) {
    //             total += s;
    //         }
    //         if (n == 1) {
    //             break;
    //          }
    //         s += s;
    //         n = n >> 1;//相当于将n除以2取其商，或者说是开2次方
    //     }
    //     return total;
    // }
    // for(var contentIndex = 0; contentIndex < originalContent.length; contentIndex ++ ) {
    //     // 标题H1~H6
    //    for(var hN = 1; hN < 7; hN ++ ) {
    //         if(originalContent[contentIndex].substring(0, hN + 1) == repeat("#", hN) + " ") {
    //             originalContent[contentIndex] = "<h" + hN + " class='markdown-body h" + hN + "'>" + originalContent[contentIndex].substring(hN + 1) + "</h" + hN + ">"
    //         }
    //     }
    // }
    // $("div.content.pb10").empty();
    // originalContent.join("")
    // $("div.content.pb10").append(originalContent.join(""))
    // GM_addStyle (`.markdown-body.h1,.markdown-body.h2,.markdown-body.h3,.markdown-body.h4,.markdown-body.h5,.markdown-body.h6 {margin-top: 1em; margin-bottom: 16px; font-weight: bold; line-height: 1.4;}`)
    // GM_addStyle (`.markdown-body.h1 {margin: 0.67em 0; padding-bottom: 0.3em; font-size: 2.25em; line-height: 1.2; border-bottom: 1px solid #eee;}`)
    // GM_addStyle (`.markdown-body.h2 {padding-bottom: 0.3em; font-size: 1.75em; line-height: 1.225; border-bottom: 1px solid #eee;}`)
    // GM_addStyle (`.markdown-body.h3 {font-size: 1.5em; line-height: 1.43;}`)
    // GM_addStyle (`.markdown-body.h4 {font-size: 1.25em;}`)
    // GM_addStyle (`.markdown-body.h5 {font-size: 1em;}`)
    // GM_addStyle (`.markdown-body.h6 {font-size: 1em; color: #777;}`)

    // 帖子优化
    // 功能1-1：高亮发帖楼主
    if( /(gene|trade|topic)\//.test(window.location.href) & !/comment/.test(window.location.href)) {
        // 获取楼主ID
        var author = $(".title2").text()
        $(".psnnode").map(function(i, n){
            // 匹配楼主ID，变更CSS
            if( $(n).text() == author) {
                $(n).after('<div class="psnnode author" style="padding:0px 5px; border-radius:2px; display: inline-block;background-color:' + settings.highlightBack + '; color: ' + settings.highlightFront + '">楼主</div>')
            }
        })
    }
    // 功能1-2：高亮管理员
    settings.highlightSpecificID.map(function(i, n) {
        $('.meta>[href="' + window.location.href.match("(.*)\.com")[0] + '/psnid/' + i + '"]').css({ "background-color": settings.highlightSpecificBack, "color": settings.highlightSpecificFront })
    });
    // 功能1-3：主题中存在 -插图- 一项时，提供预览悬浮窗
    $("a[target='_blank']").html(function(i, url){
        if(url == " -插图- ") {
            var xOffset = 5;
            var yOffset = 5;
            var imgUrl = $(this).attr('href');
            $(this).hover(function(e){
                $("body").append($('<span id="hoverImage"><img src="' + imgUrl + '" onload="if (this.width > 500) this.width=500;"</img></span>'))
                $("#hoverImage")
                    .css({"position": "absolute", "border": "1px solid #ccc", "display": "none", "padding": "5px", "background": "#333"})
                    .css("top",(e.pageY - xOffset) + "px")
                    .css("left",(e.pageX + yOffset) + "px")
                    .fadeIn(500)
            }, function(){
                $("#hoverImage").remove()
            })
            $(this).mousemove(function(e){
                $("#hoverImage")
                    .css("top",(e.pageY - xOffset) + "px")
                    .css("left",(e.pageX + yOffset) + "px");
            });
        }
    })
    // 功能1-4：回复内容回溯，仅支持机因、主题 (效率原因只返回所@用户的最近一条回复)
    if( /(gene|topic|trade)\//.test(window.location.href) & !/comment/.test(window.location.href)) {
        GM_addStyle (`.replyTraceback {background-color: rgb(0, 0, 0, 0.05) !important; padding: 10px !important; color: rgb(160, 160, 160, 1) !important; border-bottom: 1px solid !important;}`)
        // 每一层楼的回复外框 (0 ~ N - 1)
        var allSourceOutside = document.querySelectorAll(".post > .ml64") // 30楼的话是29
        // 每一层楼的回复框(0 ~ N - 1) floor
        var allSource = document.querySelectorAll(".post .ml64 > .content") // 30楼的话是29
        // 每一层楼的回复者名字( 0 ~ N - 1)
        var userId = document.querySelectorAll(".post > .ml64 > [class$=meta]") // 30楼的话是29
        // 每一层的头像(0 ~ N - 1)
        var avator = document.querySelectorAll(".post > a.l") // 30楼的话是29
        for(var floor = allSource.length - 1; floor > 0 ; floor -- ) {
            // 层内内容里包含链接（B的发言中是否有A）
            var content = allSource[floor].querySelectorAll("a")
            if(content.length > 0) {
                for(var userNum = 0; userNum < content.length; userNum++ ){
                    // 对每一个链接的文本内容判断
                    var linkContent = content[userNum].innerText.match("@(.+)")
                    // 链接里是@用户生成的链接， linkContent为用户名（B的发言中有A）
                    if(linkContent != null) {
                        var replayBox = document.createElement("div")
                        replayBox.setAttribute("class", "replyTraceback")
                        // 从上层开始，回溯所@的用户的最近回复（找最近的一条A的发言）
                        var traceIdFirst = -1
                        var traceIdTrue = -1
                        for(var traceId = floor - 1; traceId >= 0; traceId -- ){
                            // 如果回溯到了的话，选取内容
                            // 回溯层用户名
                            var thisUserID = userId[traceId].getElementsByClassName("psnnode")[0].innerText
                            if( thisUserID == linkContent[1].toLowerCase()){
                                // 判断回溯中的@（A的发言中有是否有B）
                                if ( allSource[traceId].innerText.indexOf(userId[floor].getElementsByClassName("psnnode")[0].innerText) > -1) {
                                    traceIdTrue = traceId;
                                    break;
                                } else if (traceIdFirst == -1) {
                                    traceIdFirst = traceId;
                                }
                            }
                        }
                        var outputID = -1
                        if( traceIdTrue != -1){
                            outputID = traceIdTrue
                        } else if (traceIdFirst != -1) {
                            outputID = traceIdFirst
                        }
                        // 输出
                        if(outputID != -1) {
                            var replyContents = ""
                            if(allSource[outputID].innerText.length > 45) {
                                replyContents = allSource[outputID].innerText.substring(0, 45) + "......"
                            } else {
                                replyContents = allSource[outputID].innerText
                            }
                            var avatorImg = avator[outputID].getElementsByTagName("img")[0].getAttribute("src")
                            replayBox.innerHTML = '<div class="responserHeader" style="display: inline-block; padding-right: 10px; color: #666"><img src="' +
                                avatorImg + '" height="25" width="25"> ' + linkContent[1] + '</img>'+
                                '</div><div class="responserContent_' + floor + '_' + outputID + '" style="display: inline-block;">&nbsp' +
                                replyContents + "</div>"
                            allSourceOutside[floor].insertBefore(replayBox, allSource[floor])
                            // 如果内容超过45个字符，则增加悬浮显示全文内容功能
                            if(allSource[outputID].innerText.length > 45) {
                                tippy('.responserContent_' + floor + '_' + outputID, {
                                    content: allSource[outputID].innerText,
                                    animateFill: false
                                })
                            }
                        }
                    }
                }
            }
        }
    }
    // 功能1-5：增加帖子楼层信息
    $("span.r").map(function(i,n){
        if(i > 0) {
            $(this).children("a:last").after("&nbsp&nbsp<span>#"+i+"</span>")
        }
    })
    // 功能1-6：屏蔽黑名单中的用户发言内容
    if (settings.blockList.length > 0) {
        for(var blockUser = 0; blockUser < settings.blockList.length; blockUser ++ ){
            console.log(settings.blockList[blockUser])
            $("div.post:contains(" + settings.blockList[blockUser] + ")").hide()
        }
    }
    // 功能1-7：实时统计创建机因时候的文字数
    if( /set\/gene/.test(window.location.href)){
        $(".pr20 > textarea[name='content']").before("<div style='color:#c09853'><p>字数：<span class='wordCount'>0</span>/600</p></div>")
        $(".pr20 > textarea[name='content']").keyup(function(){
            document.getElementsByClassName("wordCount")[0].innerHTML = document.getElementsByName("content")[0].value.replace(/\n|\r/gi,"").length
        });
    }

    // 商城优化
    // 功能2-1：商城价格走势图
    if( /\/dd/.test(window.location.href) ) {
        // 日期转换函数
        function converntTime(value) {
            var timeArray = value.replace('年','-').replace('月','-').replace('日','').split("-")
            timeArray[0] = "20" + timeArray[0]
            timeArray[1] = Number(timeArray[1]) - 1
            return Date.UTC(timeArray[0], timeArray[1], timeArray[2])
        }
        // 获取X轴的日期
        var xContents = document.querySelectorAll("p.dd_text")
        var xValue = [];
        var today = new Date()
        var todayArray = Date.UTC(today.getYear() + 1900, today.getMonth(), today.getDate())
        for(var xindex = 3; xindex < xContents.length; xindex+=4 ){
            var tamp = xContents[xindex].innerText.split(" ~ ")
            tamp[0] = converntTime(tamp[0])
            tamp[1] = converntTime(tamp[1])
            xValue = [tamp[0], tamp[0], tamp[1], tamp[1]].concat(xValue)
        }

        //获取价格
        var y = document.querySelectorAll(".dd_price")

        var yValueNormal = [];
        var yValuePlus = [];
        for(var yindex = 0; yindex < y.length; yindex++ ){
            var yPriceOld = y[yindex].querySelector(".dd_price_old").innerText
            var yPriceNormal = y[yindex].querySelector(".dd_price_off").innerText
            var yPricePlus = y[yindex].querySelector(".dd_price_plus")

            yValueNormal = [yPriceOld, yPriceNormal, yPriceNormal, yPriceOld].concat(yValueNormal)
            var pricePlusTamp = ""
            if( yPricePlus == null ){
                pricePlusTamp = yPriceNormal
            } else {
                pricePlusTamp = yPricePlus.innerText
            }
            yValuePlus = [yPriceOld, pricePlusTamp, pricePlusTamp, yPriceOld].concat(yValuePlus)
        }
        // 普通价格数据
        var xForPlotNormal = new Array()
        var xForPlotPlus = new Array()
        // 判断地区
        var replaceString = ""
        if( yValueNormal[0].search("HK\\$") > -1 ){
            replaceString = "HK$"
        }
        else if( yValueNormal[0].search("\\$") > -1 ){
            replaceString = "$"
        }
        else if( yValueNormal[0].search("\\£") > -1 ){
            replaceString = "£"
        } else {
            replaceString = "¥"
        }
        for(var i = 0; i < xValue.length; i++ ){
            xForPlotNormal[i] = [xValue[i], Number(yValueNormal[i].replace(replaceString, ""))]
            xForPlotPlus[i] = [xValue[i], Number(yValuePlus[i].replace(replaceString, ""))]
        }
        // 修正最后一组数据
        if( xForPlotNormal[xForPlotNormal.length - 1][0] > todayArray ){
            xForPlotNormal.pop()
            xForPlotPlus.pop()
            xForPlotNormal[xForPlotNormal.length - 1][0] = todayArray
            xForPlotPlus[xForPlotPlus.length - 1][0] = todayArray
        } else {
            xForPlotNormal.push([todayArray, xForPlotNormal[xForPlotNormal.length - 1][1]])
            xForPlotPlus.push([todayArray, xForPlotPlus[xForPlotPlus.length - 1][1]])
        }
        // 插入页面
        $(".pd10").append (`<div id="container"></div>`);

        var chart = {
            type: 'areaspline',
            backgroundColor: 'rgba(0,0,0,0)'
        };
        var title = {
            text: '价格变动走势图',
            style: {
                color: '#808080'
            }
        };
        var xAxis = {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            title: {
                text: 'Date'
            }
        };
        var yAxis = {
            title: {
                text: '价格'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        };
        var tooltip = {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: '+ replaceString + '{point.y:.2f}'

        };
        var plotOptions = {
            areaspline: {
                fillOpacity: 0.25
            }
        };
        var series= [{
            name: '普通会员价',
            color: '#00a2ff',
            data: xForPlotNormal
        }, {
            name: 'PS+会员价',
            color: '#ffd633',
            data: xForPlotPlus
        }
                    ];
        var credits = {
            enabled : false
        };
        var legend = {
            itemStyle: {
                color: '#808080'
            },
            itemHoverStyle: {
                color: '#3890ff'
            }
        }
        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.legend = legend;

        $('#container').highcharts(json);

        // 功能2-2：外币转人民币
        // 转换原始价格
        function foreignCurrency(price, mark, ratio) {
            return [Number(price[0].replace(mark, "")) * ratio, Number(price[1].replace(mark, "")) * ratio, Number(price[2].replace(mark, "")) * ratio]
        }
        $(".dd_price").map(function(i, n){
            var price = [$(this).children().eq(0).text(), $(this).children().eq(1).text(), $(this).children().eq(2).text()]
            var CNY = [0, 0, 0]
            var offset = 3
            if( /dd\//.test(window.location.href) ) {
                offset = 2
            }
            var region = $(".dd_info p:nth-child(" + offset + ")").eq(i).text()
            if( region == "港服" ){
                CNY = foreignCurrency(price, "HK$", settings.dollarHKRatio)
            } else if( region == "美服" ) {
                CNY = foreignCurrency(price, "$", settings.dollarRatio)
            } else if( region == "日服" ) {
                CNY = foreignCurrency(price, "¥", settings.yenRatio)
            } else if( region == "英服" ) {
                CNY = foreignCurrency(price, "£", settings.poundRatio)
            } else {
                CNY = foreignCurrency(price, "¥", 1)
            }
            $(".dd_price span:last-child").eq(i).after("&nbsp&nbsp<s class='dd_price_old'>¥" + CNY[0].toFixed(2) + "</s><span class='dd_price_off'>¥" + CNY[1].toFixed(2) + "</span>")
            if(CNY[2] > 0){
                $(".dd_price span:last-child").eq(i).after("</span><span class='dd_price_plus'>¥" + CNY[2].toFixed(2) + "</span>")
            }
        })

        // 功能2-3：页面上方增加翻页
        $(".dropmenu").after($(".page").clone())

        // 功能2-4：根据降价幅度变更标题颜色
        $(".dd_box").map(function(i,n){
            var offPercent = Number($(this).children(".dd_pic").children("div").eq(0).text().replace("省", "").replace("%", ""))
            if( offPercent >= 80 ){
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(220,53,69)"})
            } else if( offPercent >= 50 & offPercent < 80) {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(253,126,20)"})
            } else if( offPercent >= 20 & offPercent < 50) {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(255,193,7)"})
            } else {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(40,167,69)"})
            }
        })
    }

    // 功能2-5：活动页面根据降价幅度变更背景色
    if(/huodong/.test(window.location.href)){
        var unitContainer = $(".store_ul").children
        // console.log(unitContainer)
        //for(var unitIndex = 0; unitIndex < unitContainer.length; unitIndex++ ){
        //    var pricePer = Number(unitContainer.item(unitIndex).children[0].children[1].textContent.replace("省", "").replace("%", ""))
        //    console.log(pricePer)
       // }
    }


    // 奖杯系统优化
    // 功能3-1：游戏奖杯界面可视化
    if( /psngame\//.test(window.location.href) ) {
        // 游戏奖杯比例图
        var platinum = document.getElementsByClassName("text-platinum")[0].innerText.replace("白", "")
        var gold = document.getElementsByClassName("text-gold")[0].innerText.replace("金", "")
        var silver = document.getElementsByClassName("text-silver")[0].innerText.replace("银", "")
        var bronze = document.getElementsByClassName("text-bronze")[0].innerText.replace("铜", "")

        // 奖杯稀有度统计
        var rareArray = [0, 0, 0, 0, 0]
        for(var rareIndex = 1; rareIndex <= 4; rareIndex++ ){
            var rareValue = document.getElementsByClassName("twoge t" + rareIndex + " h-p")
            for(var j = 0; j < rareValue.length; j ++ ) {
                var rarity = Number(rareValue[j].innerText.split("\n")[0].replace("%", ""))
                if( rarity <= 5 ) {
                    rareArray[0]++ // 极度珍贵
                } else if ( rarity > 5 & rarity <= 10 ) {
                    rareArray[1]++ // 非常珍贵
                } else if ( rarity > 10 & rarity <= 20 ) {
                    rareArray[2]++ // 珍贵
                } else if ( rarity > 20 & rarity <= 50 ) {
                    rareArray[3]++ // 罕见
                } else {
                    rareArray[4]++ // 普通
                }
            }
        }

        var trophyRatioChart = {
            backgroundColor: 'rgba(0,0,0,0)'
        };
        var trophyRatioTooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };
        var trophyRatioPlotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -20,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textOutline: "0px contrast"
                    },
                    formatter: function() {
                        return this.point.y;
                    }
                }
            }
        };
        var trophyRatioSeries= [{
            type: 'pie',
            name: '比例',
            data: [
                { name: '白金', y: Number(platinum), color: '#7a96d1' },
                { name: '金', y: Number(gold), color: '#cd9a46' },
                { name: '银', y: Number(silver), color: '#a6a6a6' },
                { name: '铜', y: Number(bronze), color: '#bf6a3a' },
            ],
            center: [50, 30],
            size: 130
        }, {
            type: 'pie',
            name: '比例',
            data: [
                { name: '极度珍贵', y: rareArray[0], color: 'rgb(160, 217, 255)' },
                { name: '非常珍贵', y: rareArray[1], color: 'rgb(124, 181, 236)' },
                { name: '珍贵', y: rareArray[2], color: 'rgb(88, 145, 200)' },
                { name: '罕见', y: rareArray[3], color: 'rgb(52, 109, 164)' },
                { name: '一般', y: rareArray[4], color: 'rgb(40, 97, 152)' },
            ],
            center: [200, 30],
            size: 130
        }];
        var trophyRatioTitle = {
            text: '奖杯统计',
            style: {
                color: '#808080'
            }
        };
        var trophyRatio = {};
        trophyRatio.chart = trophyRatioChart;
        trophyRatio.tooltip = trophyRatioTooltip;
        trophyRatio.title = trophyRatioTitle;
        trophyRatio.series = trophyRatioSeries;
        trophyRatio.plotOptions = trophyRatioPlotOptions;
        trophyRatio.credits = credits;
        // 插入页面
        $(".box.pd10").append (`<p></p><div id="trophyRatioChart" align="left" style="width: 320px; height: 200px; margin: 0 0; display: inline-block;"></div>`);
        $('#trophyRatioChart').highcharts(trophyRatio);

        // 奖杯获得时间年月统计
        var getTimeArray = []
        var timeElements = document.getElementsByClassName("lh180 alert-success pd5 r")
        if( timeElements.length > 0 ) {
            for(var timeIndex = 0; timeIndex < timeElements.length; timeIndex ++ ){
                var dayTime = document.getElementsByClassName("lh180 alert-success pd5 r")[timeIndex].innerText.split("\n")
                var monthDay = dayTime[0].split("-")
                var houtMinute = dayTime[1].split(":")
                var xTime = Date.UTC(Number(timeElements[timeIndex].getAttribute("tips").replace("年", "")), Number(monthDay[0]) - 1, Number(monthDay[1]), Number(houtMinute[0]), Number(houtMinute[1]))
                getTimeArray.push(xTime)
            }
            getTimeArray.sort()
            var getTimeArrayX = []
            for(var k = 1; k <= timeElements.length; k ++){
                getTimeArrayX.push([getTimeArray[k - 1], k])
            }
            // 调整白金时间
            getTimeArrayX[getTimeArrayX.length - 1][0] += 60000

            var trophyGetTimeTooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            var trophyGetTimeXaxis = {
                type: 'datetime',
                dateTimeLabelFormats: {
                    second: '%Y-%m-%d<br/>%H:%M:%S',
                    minute: '%Y-%m-%d<br/>%H:%M',
                    hour: '%Y-%m-%d<br/>%H:%M',
                    day: '%Y<br/>%m-%d',
                    week: '%Y<br/>%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                title: {
                    display: false
                }
            };
            var trophyGetTimeSeries = [{
                type: 'spline',
                name: '获得数目',
                data: getTimeArrayX,
                showInLegend: false
            }]
            var trophyGetTimeTitle = {
                text: '奖杯获得时间',
                style: {
                    color: '#808080'
                }
            };
            var trophyGetTimeYAxis = {
                title: {
                    text: '奖杯获得个数'
                },
                min: 0
            };
            var trophyGetTime = {};
            trophyGetTime.chart = trophyRatioChart;
            trophyGetTime.tooltip = trophyGetTimeTooltip;
            trophyGetTime.xAxis = trophyGetTimeXaxis;
            trophyGetTime.yAxis = trophyGetTimeYAxis;
            trophyGetTime.title = trophyGetTimeTitle;
            trophyGetTime.series = trophyGetTimeSeries;
            trophyGetTime.credits = credits;
            // 插入页面
            $(".box.pd10").append (`<div id="trophyGetTimeChart" align="left" style="width: 460px; height: 200px; margin: 0 0; display: inline-block;"></div>`);
            $('#trophyGetTimeChart').highcharts(trophyGetTime);
        }

        // 功能4-3：汇总以获得和未获得奖杯
        $("#trophyGetTimeChart").after("<div class='earnedTropy'><p class='earnedTropyCount' style='color:#ffffff; padding:5px 5px; border-radius:5px; background-color:#000000; opacity:0.2'></p></div>")

        GM_addStyle (`.tippy-tooltip.psnine-theme {background-color: ` + $(".box").css("background-color") + `}`)
        var tipColor = ""
        $(".imgbg.earned").map(function(i, v) {
            if($(this).parent().parent().next().find(".alert-success.pd5").length > 0 ){
                tipColor = "#8cc14c"
            } else {
                tipColor = $(".box").css("background-color")
            }
            $(".earnedTropy").append("<span id='tropyEarnedSmall" + i + "' style='padding:2px; border-left: 3px solid " + tipColor + ";'><a href='" + $(this).parent().attr("href") + "'><img src='" + $(this).attr("src") + "' width='30px'></img><a></span>")
            var tropySmallText = $(this).parent().parent().next()
            var tropySmallFrame = "<div><span>" + $(this).parent().parent().html() + "</span><p></p><span>" + tropySmallText.html() + "</span></div>"
            tippy('#tropyEarnedSmall' + i, {
                content: tropySmallFrame,
                theme: 'psnine',
                animateFill: false
            })
        })
        $(".earnedTropy").after("<div class='notEarnedTropy'><p></p><p class='notEarnedTropyCount' style='color:#ffffff; padding:5px 5px; border-radius:5px; background-color:#000000; opacity:0.2'></p></div>")
        $("img[class$='imgbg']").map(function(i, v) {
            if($(this).parent().parent().next().find(".alert-success.pd5").length > 0 ){
                tipColor = "#8cc14c"
            } else {
                tipColor = $(".box").css("background-color")
            }
            $(".notEarnedTropy").append("<span id='tropySmall" + i + "' style='padding:2px; border-left: 3px solid " + tipColor + ";'><a href='" + $(this).parent().attr("href") + "'><img src='" + $(this).attr("src") + "' width='30px' style='filter: grayscale(100%);'></img></a></span>")
            var tropySmallText = $(this).parent().parent().next()
            var tropySmallFrame = "<div><span>" + $(this).parent().parent().html() + "</span><p></p><span>" + tropySmallText.html() + "</span></div>"
            tippy('#tropySmall' + i, {
                content: tropySmallFrame,
                theme: 'psnine',
                animateFill: false
            })
        })
        $(".earnedTropyCount").text("已获得奖杯：" + $(".imgbg.earned").length)
        $(".notEarnedTropyCount").text("未获得奖杯：" + $("img[class$='imgbg']").length)
    }

    // 游戏页面优化
    if(settings.filterNonePlatinum){
        if(/psngame/.test(window.location.href) & !/psnid/.test(window.location.href)) {
            // 功能5-1：降低没有白金的游戏的图标亮度
            $("tr").map(function(i,n){
                // 读取白金数量
                var platinumNum = $(this).children(".pd1015.title.lh180").children("em").children(".text-platinum").text().replace("白", "")
                if(platinumNum == 0) {
                    $(this).children(".pdd15").children("a").children("img").css({"opacity": settings.filterNonePlatinumAlpha})
                }
            })
            // 功能5-2：页面上方增加翻页
            $(".dropmenu").after($(".page").clone())
        }
    }

    // 进入游戏页默认查看我自己的奖杯
    if(window.location.href.match(/psngame\/\d+$/) && !/psnid/.test(window.location.href)){//检查游戏页
        var psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/)//从cookie中取出psnid
        if(psnidCookie){
            var psnid = psnidCookie[1]
            window.location.href+=`?psnid=${psnid}`
        }
    }

    // 奖杯心得页面输入框可缩放大小
    if(window.location.href.match(/trophy\/\d+$/)){
        $("#comment").css({
            "resize":"vertical",
            "minHeight":200
        });
    }
   
    //右上角头像下拉框中增加插件设定按钮
    if(window.localStorage){//如果支持localstorage
        var newSettings = JSON.parse(JSON.stringify(settings))
        $(".header .dropdown ul").append(`
            <li><a href="javascript:void(0);" id="psnine-night-mode-CSS-opensetting">插件设置</a></li>
        `)
        $("body").append(`
            <style>.setting-panel-box{z-index:999999;background-color:#fff;transition:all .4s ease;position:fixed;left:50%;transform:translateX(-50%);top:-5000px;width:500px;box-shadow:0 0 20px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;flex-direction:column;padding:10px;box-sizing:border-box;border-radius:4px}.setting-panel-box.show{top:20px}.setting-panel-box h4{margin-bottom:0}.setting-panel-box .row{display:flex;align-items:center;justify-content:flex-start;width:100%;margin-bottom:18px}.setting-panel-box .row label{line-height:32px;text-align:right;font-size:14px;color:#606266;padding:0 12px 0 0;width:190px}.setting-panel-box .row textarea{resize:vertical;min-height:30px;border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;line-height:26px;box-sizing:border-box;width:227px;padding:0 10px}.setting-panel-box .row input{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:170px;padding:0 10px}.setting-panel-box .row select{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:170px;padding:0 10px}.setting-panel-box button{-webkit-appearance:button;padding:9px 15px;font-size:12px;border-radius:3px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;text-align:center;box-sizing:border-box;outline:0;margin:0;transition:.1s;font-weight:500;margin:0 10px}.setting-panel-box button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}.setting-panel-box button.confirm{color:#fff;background-color:#3890ff}.setting-panel-box button.confirm:hover{background-color:#9ec9ff}</style>
            <div class=setting-panel-box><h4>P9插件设置</h4><div class=row><label>鼠标划过刮刮卡显示内容</label><select id=hoverUnmark><option value=true>是<option value=false>否</select></div><div class=row><label>降低无白金游戏图标透明度</label><select id=filterNonePlatinum><option value=true>是<option value=false>否</select></div><div class=row><label>高亮用户(以英文逗号隔开)</label><textarea name="" id="highlightSpecificID" cols="30" rows="2"></textarea></div><div class=row><label>黑名单(以英文逗号隔开)</label><textarea name="" id="blockList" cols="30" rows="2"></textarea></div><div class=row><label>港币汇率</label><input type=number name="" id=dollarHKRatio></div><div class=row><label>美元汇率</label><input type=number name="" id=dollarRatio></div><div class=row><label>英镑汇率</label><input type=number name="" id=poundRatio></div><div class=row><label>日元汇率</label><input type=number name="" id=yenRatio></div><div class=btnbox><button class=cancel>取消</button><button class=confirm>确定</button></div></div>
        `)
        //点击打开设置面板
        $("#psnine-night-mode-CSS-opensetting").on("click",function(){
            $(".setting-panel-box").addClass("show")
            //刮刮卡
            if(newSettings.hoverUnmark){
                $("#hoverUnmark option:nth-child(1)").attr("selected","true")
            }else{
                $("#hoverUnmark option:nth-child(2)").attr("selected","true")
            }
            $("#hoverUnmark").change(function(){
                newSettings.hoverUnmark = JSON.parse($(this).children('option:selected').val())
                console.log(newSettings)
            })
            //无白金淡化
            if(newSettings.filterNonePlatinum){
                $("#filterNonePlatinum option:nth-child(1)").attr("selected","true")
            }else{
                $("#filterNonePlatinum option:nth-child(2)").attr("selected","true")
            }
            $("#filterNonePlatinum").change(function(){
                newSettings.filterNonePlatinum = JSON.parse($(this).children('option:selected').val())
                console.log(newSettings)
            })
            //高亮用户
            var highlightSpecificIDText = newSettings.highlightSpecificID.join(",")
            $("#highlightSpecificID").val(highlightSpecificIDText)
            //黑名单
            var blockListText = newSettings.blockList.join(",")
            $("#blockList").val(blockListText)
            //汇率
            $("#dollarHKRatio").val(newSettings.dollarHKRatio)
            $("#dollarRatio").val(newSettings.dollarRatio)
            $("#poundRatio").val(newSettings.poundRatio)
            $("#yenRatio").val(newSettings.yenRatio)
        })
        //点击取消
        $(".setting-panel-box .btnbox .cancel").on("click",function(){
            $(".setting-panel-box").removeClass("show")
        })
        //点击确定
        $(".setting-panel-box .btnbox .confirm").on("click",function(){
            var highlightSpecificIDText = $.trim($("#highlightSpecificID").val().replace("，",",")).replace(/,$/,"").replace(/^,/,"")
            if(highlightSpecificIDText){
                newSettings.highlightSpecificID = highlightSpecificIDText.split(",")
            }
            var blockListText = $.trim($("#blockList").val().replace("，",",")).replace(/,$/,"").replace(/^,/,"")
            if(blockListText){
                newSettings.blockList = blockListText.split(",")
            }
            newSettings.dollarHKRatio = $("#dollarHKRatio").val()
            newSettings.dollarRatio = $("#dollarRatio").val()
            newSettings.poundRatio = $("#poundRatio").val()
            newSettings.yenRatio = $("#yenRatio").val()
            $(".setting-panel-box").removeClass("show")
            localStorage["psnine-night-mode-CSS-settings"] = JSON.stringify(newSettings)
            window.location.reload()
        })
    }
    
})();
