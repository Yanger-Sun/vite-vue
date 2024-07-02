const fs = require("fs");
const {JSDOM} = require("jsdom");

const dom = new JSDOM(fs.readFileSync("./dist/index.html"));

//删除包含type="module"的标签
var tags = dom.window.document.querySelectorAll("*[type=\"module\"]");
for(var i = 0 ; i < tags.length; i++){
    var tag = tags[i];
    tag.parentElement.removeChild(tag);
}

//需要把 script 标签里面的 nomodule，crossorigin 属性删掉
tags = dom.window.document.querySelectorAll("SCRIPT[nomodule]");
for(var i = 0 ; i < tags.length; i++){
    var tag = tags[i];
    tag.removeAttribute("nomodule");
}

tags = dom.window.document.querySelectorAll("SCRIPT[crossorigin]");
for(var i = 0 ; i < tags.length; i++){
    var tag = tags[i];
    tag.removeAttribute("crossorigin");
}

//data-src换成src
tags = dom.window.document.querySelectorAll("SCRIPT[data-src]");
for(var i = 0 ; i < tags.length; i++){
    var tag = tags[i];
    var src = tag.getAttribute("data-src");
    tag.removeAttribute("data-src");
    tag.setAttribute("src", src);
}

var html = "<!DOCTYPE html>\r\n" + dom.window.document.documentElement.outerHTML;
fs.writeFileSync("./dist/index.html", html);
console.log("成功修改dist/index.html");

