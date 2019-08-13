//兼容各大浏览器的事件处理方法
window.EventUnit = {
  addHandler:function(element,type,handler){//绑定事件
    if(element.addEventListener){//非IE浏览器
      element.addEventListener(type,handler,false);
    }else if(element.attachEvent){//IE浏览器
      element.attachEvent("on"+type,handler);
    }else{//其他情况
      element["on"+type] = handler;
    }
  },
  removeHandler:function(element,type,handler){//移除事件
    if(element.removeEventListener){//非IE浏览器
      element.removeEventListener(type,handler,false);
    }else if(element.detachEvent){//IE浏览器
      element.detachEvent("on"+type,handler);
    }else{//其他情况
      element["on"+type] = null;
    }
  },
  getEvent:function(event){// 解决IE8.0 及其以下版本，event 对象必须作为 window 对象的一个属性
    return event ? event : window.event;
  },
  getTarget:function(event){//兼容低端IE浏览器不支持target
    return event.target || event.srcElement;
  },
  preventDefault:function(event){//阻止默认行为
    if(event.preventDefault){//非IE浏览器
      event.preventDefault()
    }else{//IE浏览器
      evemt.returnValue = false;
    }
  },
  stopPropagation:function(event){//阻止事件冒泡
    if(event.stopPropagation){//非IE浏览器
      event.stopPropagation()
    }else{//IE浏览器
      evemt.cancelButton = true;
    }
  }
}
//自定义事件,实现挂载事件，触发事件
window.EventTarget = function(){
  this.handlers = {}//事件数组
}
EventTarget.prototype = {
  constructor:EventTarget,//将构造函数指向自身,因为给prototype设置对象会改变prototype的指向,这个时候利用constructor来判断对象类型就会有问题,所以将constructor修改回来
  addHandler:function(type,handler){//绑定自定义事件
    if(typeof this.handlers[type] == "undefined"){
      this.handlers[type] = []
    }
    this.handlers[type].push(handler)
  },
  fire:function(event){//触发自定义事件
    if(!event.target){
      event.target = this;
    }
    if(this.handlers[event.type] instanceof Array){//指定触发的事件类型，存在事件
      var handlers = this.handlers[event.type];
      var len = handlers.length;
      for(var i = 0; i < len; i++){//循环触发事件
        handlers[i](event);
      }
    }
  },
  removeHandler:function(type,handler){//移除自定义事件
    if(this.handlers[event.type] instanceof Array){
      var handlers = this.handlers[event.type];
      var len = handlers.length;
      for(var i = 0; i < len; i++){
        if(handlers[i] == handler){//找到指定事件所处的索引
          break;
        }
      }
      handlers.splice(i,1);//根据索引删除指定事件
    }
  }
}
