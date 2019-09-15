window.DragDrop = function(){

  var dragDrop = new EventTarget(), // 自定义事件
      dragSizing = null, // 拖拽改变大小对象
      dragSizeParent = null, // 当前拖拽改变大小对象的父对象
      dragging = null, // 当前拖拽对象
      drffWidth = 0, // 当前拖拽改变大小对象的初始宽度
      drffX = 0, // 当前拖拽改变大小的时候 拖拽的起始点
      diffX = 0, // 表示拖拽点距离拖拽对象的内部距离
      diffY = 0, // 表示拖拽点距离拖拽对象的内部距离
      draggingLeft = 0, // 当前拖拽对象的left
      draggingTop = 0; // 当前拖拽对象的Top

  var handleEvent = function(event){
    event = EventUnit.getEvent(event); // 获取事件
    var target = EventUnit.getTarget(event); // 获取事件对象
    switch (event.type) {
      case "mousedown":
          if( target.className.indexOf("draggable") > -1 ) {
            EventUnit.preventDefault(event); // 阻止默认行为
            EventUnit.stopPropagation(event); // 阻止冒泡
            dragging = target.parentNode; // 设置当前拖拽对象为事件对象的父元素
            diffX = event.clientX - dragging.offsetLeft;
            diffY = event.clientY - dragging.offsetTop;
            // 当前点相对于屏幕的位置减去当前点相对于拖拽对象的位置，就是当前点绝对定位该有的位置, 这里面减10是因为当前拖拽对象的margin是10
            draggingLeft = (event.clientX - diffX-10) + "px";
            draggingTop = (event.clientY - diffY-10) + "px";
            var cssList = {
              "position":"absolute",
              "z-index":10,
              "opacity":0.7,
              "box-shadow":"0px 0px 5px #b5b5b5",
              "left":draggingLeft,
              "top":draggingTop
            };
            DomUnit.cssText(dragging, cssList);
            dragDrop.fire({ type:"dragstart", target:dragging, x:event.clientX, y:event.clientY });
            return;
          }
          if( target.className.indexOf("dragsizeable") > -1 ){
            EventUnit.preventDefault(event); // 阻止默认行为
            EventUnit.stopPropagation(event); // 阻止冒泡
            dragSizing = target; // 设置当前拖拽大小对象为当前拖拽对象
            dragSizeParent = dragSizing.parentNode; // 设置当前拖拽大小对象父元素为当前拖拽对象父元素
            drffWidth = dragSizeParent.clientWidth; // 记录改变宽度前的初始宽度
            drffX = event.clientX; // 记录拖拽点改变前的初始拖拽X坐标
            dragDrop.fire({type:"dragsizestart",target:dragSizing});
            return;
          }
        break;
      case "mousemove":
          if( dragging != null ){
            EventUnit.preventDefault(event); // 阻止默认行为
            EventUnit.stopPropagation(event); // 阻止冒泡
            draggingLeft =  (event.clientX - diffX-10) + "px";
            draggingTop = (event.clientY - diffY-10) + "px";
            var cssList = {
              "left":draggingLeft,
              "top":draggingTop
            };
            DomUnit.cssText(dragging, cssList);
            // dragging.style.cssText="position:absolute;z-index:10;opacity:0.7;box-shadow:0px 0px 5px #b5b5b5;left:"+draggingLeft+";top:"+draggingTop+";";
            dragDrop.fire({ type:"drag", target:dragging, x:event.clientX, y:event.clientY });
            return;
          }
          if( dragSizing != null ) {
            EventUnit.preventDefault(event); // 阻止默认行为
            EventUnit.stopPropagation(event); // 阻止冒泡
            var distance = event.clientX - drffX; // 拖拽距离
            var width = drffWidth + distance; // 最终宽度
            dragSizeParent.style.width = width/dragSizeParent.parentNode.clientWidth*100+"%"; // 换算成百分比
            dragDrop.fire({ type:"dragsize", target:dragSizing });
            return;
          }
        break;
      case "mouseup":
          if( !!dragging ) {
            var cssList = {
              "position":"relative",
              "z-index":2,
              "opacity":1,
              "box-shadow":"none",
              "left":"auto",
              "top":"auto"
            };
            DomUnit.cssText(dragging, cssList);
            dragDrop.fire({ type:"dragend", target:dragging, x:event.clientX, y:event.clientY });
            dragging = null;
            draggingLeft = 0;
            draggingTop = 0;
            return;
          }
          if( dragSizing != null ){
            dragDrop.fire({ type:"dragsizeend", target:dragSizing });
            dragSizing = null;
            dragSizeParent = null;
            drffWidth = 0;
            drffX = 0;
            return;
          }
        break;
      default:
    }
  }

  dragDrop.enable = function(){
    EventUnit.addHandler(document, "mousedown", handleEvent);
    EventUnit.addHandler(document, "mousemove", handleEvent);
    EventUnit.addHandler(document, "mouseup", handleEvent);
  }

  dragDrop.disable = function(){
    EventUnit.removeHandler(document, "mousedown", handleEvent);
    EventUnit.removeHandler(document, "mousemove", handleEvent);
    EventUnit.removeHandler(document, "mouseup", handleEvent);
  }

  dragDrop.enable();
  return dragDrop;

}();
