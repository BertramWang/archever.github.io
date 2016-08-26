
// 帮助函数
!function(){
// 
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
}




  var template=`
  <div class="alert-bg">
  <div class="alert animated">
   <div class="alert-tittle">标题</div>
   <div class="alert-content">内容</div>
    <div class="alert-control">
     <a href="#" class="alert-confirm">确认</a>
     <a href="#" class="alert-cancel">取消</a>
   </div>
  </div>
  </div>`;

  //将字符转化为节点, 返回节点
  function html2node(str){
    var container = document.createElement("div");
    container.innerHTML = str;
    return container.children[0];
  }

  //属性扩展, 添加o2上, o1没有的属性
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === "undefined"){
      o1[i]=o2[i];
    }
    return o1;
  }

  //Alert, 构造函数
  function Alert(options){
    //将构造参数, 传递给对象
    extend(this, options||{});
    this.blur = new BgBlur;
    this.container = html2node(template);
    this.wrap = this.container.querySelector('.alert');


    this._init();
    
  }

  //子元素背景虚化
  function BgBlur(elem=document.body){
      var childelem=[];
      if(elem.nodeType===1){
        for(var i of elem.children) {
            childelem.push(i);
          }
        }
      
      this.on=function(){
          for(var j of childelem){j.className+=" blur";}
        };
      this.off=function(){
          for(var k of childelem){
            k.className = k.className.replace(/\sblur\s/g, " ");
            k.className = k.className.replace(/\sblur$/g, "");
          }
        };
    }


  Alert.prototype = {
    _init: function(){
      this.container.querySelector(".alert-confirm").addEventListener("click", this._onConfirm.bind(this));
      this.container.querySelector(".alert-cancel").addEventListener("click", this._onCancel.bind(this));
    },

    _onConfirm: function(){
      this.emit("confirm")
      this.hide();
    },

    _onCancel: function(){
      this.emit("cancel")
      this.hide();
    },

    show: function(){
      this.blur.on();
      document.body.appendChild(this.container);
      animateClass(this.wrap, this.animation.show);
      
    },
    hide: function(){
      this.blur.off();
      var container = this.container;
      animateClass(this.wrap, this.animation.hide, function(){document.body.removeChild(container);});
    },
  };
  extend(Alert.prototype, emitter);


  window.Alert = Alert;


}()


// if (typeof exports === 'object') {
//     module.exports = Alert;
//     // 支持amd
//   } else if (typeof define === 'function' && define.amd) {
//     define(function() {
//       return Alert;
//     });
//   } else {
//     // 直接暴露到全局
//     window.Alert = Alert;
//   }





















