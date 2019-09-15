window.$$ = window.DragTool = (function() {

  var DragTool = function(selector) {
    return new DragTool.prototype.init(selector);
  }

  DragTool.prototype = {
    constructor: DragTool,
    init: function(selector) {
      var dragArea = document.getElementById(selector)
      if(!dragArea) { console.log("不存在的对象"); return; }
      this.dragArea = dragArea;
      return this;
    }
  }

  DragTool.prototype.init.prototype = DragTool.prototype;

  // 初始化拖拽信息
  DragTool.prototype.initDrag = function(options) {
    if( !options.dragItemClass || !options.dragPlaceholderID ) {
      return;
    }
    this.dragItem = options.dragItemClass; // 可拖拽矩形类名
    this.placeholderID = options.dragPlaceholderID; // 当前拖拽的元素的占位符的ID
    this.placeholderEle = null; // 表示当前拖拽元素的占位符对象
    this.currentDragID = ""; // 表示当前拖拽元素的ID
    this.currentDragEle = null; // 表示当前拖拽元素
    this.rect = new Rect(this.dragArea); // 创建矩形操作实例
    this.dragCout = 0; // 目的在于每一次拖拽都要触发检测方法,我们在这里控制频率
    this.draggableIDList = [];
    this.dragEleIDListInit()； // 保存一份当前所有的可拖拽元素的ID,避免多次请求dom,造成的性能问题
    this.initDragEvent();
  }

  // 创建占位符
  DragTool.prototype.placeholderCreate = function(target) {
    var parentNode = target.parentNode; // 当前元素的父元素
    var nextNode = DomUnit.getNextNode(target); // 当前元素的后一个元素
    this.placeholderEle = document.createElement("span"); // 创建占位符
    this.placeholderEle.setAttribute("id",this.placeholderID); // 设置占位符ID
    DomUnit.cloneCssAttr(target,this.placeholderEle, [
      { cssName: "margin", cssAttr: "marginBottom" },
      { cssName: "height", cssAttr: "height" },
      { cssName: "width", cssAttr: "width" },
      { cssName: "background-color", cssAttr: "#e3e3e3", useCssAttr: true },
      { cssName: "float", cssAttr: "left", useCssAttr: true },
      { cssName: "box-sizing", cssAttr: "border-box", useCssAttr: true } 
    ]); // 将target的部分css属性拷贝到占位符
    this.currentDragID = target.getAttribute("id"); // 设置当前拖拽元素的ID
    this.currentDragEle = target;
    var targetNode = null;
    !!nextNode ? (targetNode = nextNode) : (targetNode = target);
    parentNode.insertBefore(this.placeholderEle, targetNode);
    this.putEleForTargetInElesList(this.placeholderID, targetNode.getAttribute("id"),0);
    this.removeEleFromElesList(this.currentDragID);
  }

  // 将当前占位符移动到指定target前面
  DragTool.prototype.putPlaceholderBeforeTarget = function(target) {
    var _this = this;
    if( !!target == false ) { return; }
    if( !!this.placeholderEle ) {
      DomUnit.setEleBeforeTarget(this.placeholderEle, target, this.placeholderEle, 1);
      this.putEleForTargetInElesList(this.placeholderID, target.getAttribute("id"), 0);
    }
  }

  // 将当前占位符移动到指定target后面,理论上插入在target前面只要调用insertBefore(ele,target.nextNode),调用本方法的前提是target是最后一个元素,而target.nextNode并不存在
  DragTool.prototype.putPlaceholderAfterTarget = function(target) {
    if( !!target == false || !!this.placeholderEle == false ) { return; }
    var targetNextNode = DomUnit.getNextNode(target, this.currentDragID);
    if( !!targetNextNode ) {
      this.putPlaceholderBeforeTarget(targetNextNode);
      return;
    }
    var targetParentNode = target.parentNode;
    targetParentNode.removeChild(this.placeholderEle);
    targetParentNode.appendChild(this.placeholderEle);
    this.putEleForTargetInElesList(this.placeholderID, target.getAttribute("id"), 1);
  }

  // 结束拖拽,将拖动对象移动到当前节点标志位节点前面,并删除拖拽占位符
  DragTool.prototype.endDrag = function() {
    if( !!this.placeholderEle == false ) {
      return;
    }
    this.putEleBeforeTargetInElesListAndDelTarget(this.currentDragID, this.placeholderID);
    DomUnit.setEleBeforeTarget(this.currentDragEle, this.placeholderEle, this.placeholderEle, 0);
    this.placeholderEle = null;
    this.currentDragID = "";
    this.currentDragEle = null;
  }

  // 初始化可拖拽对象ID数组
  DragTool.prototype.dragEleIDListInit = function() {
    if( !!this.dragArea == false ) {
      console.log("无操作区域")
      return;
    }
    this.draggableIDList = [];
    var elements = this.dragArea.getElementsByClassName(this.dragItem);
    var len = elements.length;
    for( var i = 0; i < len; i++ ) {
      var item = elements[i];
      this.draggableIDList.push(item.getAttribute("id"));
    }
  }

  // 判断a是否在b前面(draggableIDList操作)
  DragTool.prototype.isBeforeTargetInElesList = function(a, b) {
    var before = true;
    var aIndex = this.draggableIDList.indexOf(a);
    var bIndex = this.draggableIDList.indexOf(b);
    (aIndex < bIndex) ? (before = true) : (before = false);
    return before;
  }

  // 将a插入在b前面或者后面,type 0前面,1后面(draggableIDList操作)
  DragTool.prototype.putEleForTargetInElesList = function(a, b, type) {
    var aIndex = this.draggableIDList.indexOf(a);
    var bIndex = this.draggableIDList.indexOf(b);
    if(bIndex == -1) {
      return;
    }
    this.removeEleFromElesList(a);
    if( aIndex != -1 && aIndex < bIndex ) {
      bIndex = bIndex - 1;
    }
    if( type == 0 ) {
      this.draggableIDList.splice(bIndex, 0, a);
    } else {
      this.draggableIDList.splice((bIndex+1), 0, a);
    }
  }

  // 将a插入在b前面,并删除b
  DragTool.prototype.putEleBeforeTargetInElesListAndDelTarget = function(a, b) {
    var bIndex = this.draggableIDList.indexOf(b);
    if(bIndex == -1) {
      return;
    }
    this.draggableIDList.splice(bIndex, 0, a);
    this.removeEleFromElesList(b);
  }

  // 从数组中删除a元素(draggableIDList操作)
  DragTool.prototype.removeEleFromElesList = function(a) {
    var aIndex = this.draggableIDList.indexOf(a);
    if( aIndex != -1 ) {
      this.draggableIDList.splice(aIndex, 1);
    }
  }

  // 初始化拖拽事件
  DragTool.prototype.initDragEvent = function() {
    var _this = this;
    DragDrop.addHandler("dragstart", function(event) {
      if( DomUnit.isParent(_this.dragArea,event.target) == false ) { return; }
      _this.dragCout = 0;
      _this.placeholderCreate(event.target);
    });
    DragDrop.addHandler("drag", function(event) {
      if( DomUnit.isParent(_this.dragArea,event.target) == false ) { return; }
      _this.dragCout = _this.dragCout + 1;
      if( _this.dragCout%5 != 0 ) { // 控制频率在每拖动5次触发一次检测
        return;
      }
      var target = event.target;
      var currentDrapRect = {
        id: target.getAttribute("id"),
        x: target.offsetLeft,
        y: target.offsetTop,
        w: target.clientWidth,
        h: target.clientHeight,
        xr: target.offsetLeft+target.clientWidth,
        yr: target.offsetTop+target.clientHeight,
        area: target.clientWidth*target.clientHeight
      } // 获取当前拖拽的矩形信息
      _this.rect.isHaveReplaceRect(currentDrapRect, function(rectID) {
        var target = document.getElementById(rectID);
        var isBeforeTarget = _this.isBeforeTargetInElesList(_this.placeholderID, rectID);
        if( isBeforeTarget ) {
          var targetNextNode = DomUnit.getNextNode(target, _this.currentDragID);
          if( targetNextNode ) {
            _this.putPlaceholderBeforeTarget(targetNextNode); // 如果存在下一个元素,只插入下一个元素的前面，就是变相的插入此元素的后面
          }else{
            _this.putPlaceholderAfterTarget(target); // 如果不存在下一个元素,说明是最后一个元素了,则直接插入在此元素的后面
          }
        }else{
          _this.putPlaceholderBeforeTarget(target); // 插入在此元素的前面
        }
        // 重新刷新矩形数据
        _this.rect.rectData()
      });
    });
    DragDrop.addHandler("dragend", function(event) {
      if( DomUnit.isParent(_this.dragArea,event.target) == false ) { return; }
      _this.endDrag(); // 结束拖拽的后续处理
      _this.rect.rectData();
      _this.dragEleIDListInit(); // 这句话是在拖拽结束后,重新初始化可拖拽数组,加上这句可防止异常造成的意外情况,不过会增加额外的dom操作
    });
    DragDrop.addHandler("dragsizeend", function(event) {
      if( DomUnit.isParent(_this.dragArea,event.target) == false ) { return; }
      _this.rect.rectData();
    });
  }

  return DragTool;

})();
