let CreatEle=()=> {
  let script = window.document.createElement('script');
  script.innerHTML =
    `!(function(c,b,d,a){c[a]||(c[a]={});c[a].config={pid:"bi3fe2q9bd@c4babfe7fafae7b",appType:"web",imgUrl:"https://arms-retcode.aliyuncs.com/r.png?",sendResource:true,enableLinkTrace:true,behavior:true}; with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d) })(window,document,"https://retcode.alicdn.com/retcode/bl.js","__bl");`
  var first = window.document.body.firstChild; //得到页面的第一个元素
  window.document.body.insertBefore(script, first);
}
CreatEle()
