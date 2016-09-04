// ajax封装

// 通过绑定案件, 触发回调函数, 用的老师的 emiter 组件
// this.on("ok", fn) 
// this.on("notOk", fn)

function Ajax(options) {
	options = options || {};
	extend(this, options);
	
}

var emitter = {
  // 注册事件
  on: function(event, fn) {
    var handles = this._handles || (this._handles = {}),
      calls = handles[event] || (handles[event] = []);

    // 找到对应名字的栈
    calls.push(fn);

    return this;
  },
  // 解绑事件
  off: function(event, fn) {
    if(!event || !this._handles) this._handles = {};
    if(!this._handles) return;

    var handles = this._handles , calls;

    if (calls = handles[event]) {
      if (!fn) {
        handles[event] = [];
        return this;
      }
      // 找到栈内对应listener 并移除
      for (var i = 0, len = calls.length; i < len; i++) {
        if (fn === calls[i]) {
          calls.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  },
  // 触发事件
  emit: function(event){
    var args = [].slice.call(arguments, 1),
      handles = this._handles, calls;

    if (!handles || !(calls = handles[event])) return this;
    // 触发所有对应名字的listeners
    for (var i = 0, len = calls.length; i < len; i++) {
      calls[i].apply(this, args)
    }
    return this;
  }
};

extend(Ajax.prototype, emitter);

extend(Ajax.prototype, {
	get: function() {

		function serialize(data) {
			if (!data) return "";
			var pairs = [];
			for (var name in data) {
				if (!data.hasOwnProperty(name)) continue;
				if (typeof data[name] === "function") continue;
				var value = data[name].toString();
				name = decodeURIComponent(name);
				pairs.push(name + "=" + value);
			}
			return pairs.join('&');
		}
		var xhr = new XMLHttpRequest();
		xhr.father = this;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					xhr.father.result = xhr.responseText;
					xhr.father.emit("ok");	
				} else {
					xhr.father.result = "failed with code: " + xhr.status;
					xhr.father.emit("notOk");
				}

			}

		};
		if(this.contentType){
			xhr.setRequestHeader("Content-Type", this.contentType);
			console.log("set-contenttype")
		}
		if(this.method == "get"){

			xhr.open(this.method, this.url + "?" + serialize(this.data), this.async);
			xhr.send(null);
		}

		if(this.method == "post"){
			xhr.open(this.method, this.url, this.async);
			xhr.send(serialize(this.data));
		}

		xhr.onreadystatechange();
	}
})


//扩展对象
function extend(o1, o2) {
	for (var i in o2)
		if (typeof o1[i] === 'undefined') {
			o1[i] = o2[i]
		}
	return o1
}

//添加类, 老师的代码
function addClass(node, className) {
	var current = node.className || "";
	if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
		node.className = current ? (current + " " + className) : className;
	}
}

//删除类, 老师的代码
function delClass(node, className) {
	var current = node.className || "";
	node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
}

//文本转化为节点, 老师代码
function html2node(str) {
	var container = document.createElement('div');
	container.innerHTML = str;
	return container.children[0];
}


//获得cookies, 课件代码
function getCookie() {
	var cookie = {};
	var all = document.cookie;
	if (all === '') return cookie;
	var list = all.split('; ');
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var p = item.indexOf("=");
		var name = item.substring(0, p);
		name = decodeURIComponent(name);
		var value = item.substring(p + 1);
		value = decodeURIComponent(value);
		cookie[name] = value;
	}
	return cookie;
}

//设置/修改cookie, expire s= newDate(); 课件代码
function setCookie(name, value, expires, path, domain, secure) {
	var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (expires)
		cookie += '; expires=' + expires.toGMTString();
	if (path)
		cookie += '; path=' + path;
	if (domain)
		cookie += '; domain=' + domain;
	if (secure)
		cookie += '; secure=' + secure;
	document.cookie = cookie;
}

//删除cookie, 课件代码
function removeCookie(name, path, domain) {
	document.cookie = name + '=' + '; path=' + path + '; domain=' + domain + '; max-age=0';
}


