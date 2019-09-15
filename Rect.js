function Rect(OperaArea){
  this.OperaArea = OperaArea; // 操作区域
  this.rectDataList = []; // 保存所有矩形数据
  this.rectData(); // 初始化矩形信息
}

Rect.prototype.rectData = function(){
  if( !!this.OperaArea == false ){
    console.log("无操作区域")
    return;
  }
  var rectObj = this.OperaArea.getElementsByClassName("rect"),
      item = null,
      rectData = {};
  var len = rectObj.length;
  this.rectDataList = [];
  for( var i = 0; i < len; i++ ){
    item = rectObj[i];
    rectData = {
      id: item.getAttribute("id"),
      x: item.offsetLeft,
      y: item.offsetTop,
      w: item.clientWidth,
      h: item.clientHeight,
      xr: item.offsetLeft+item.clientWidth,
      yr: item.offsetTop+item.clientHeight,
      area: item.clientWidth*item.clientHeight
    }
    this.rectDataList.push(rectData)
  }
}

Rect.prototype.isIntersect = function(rect1, rect2){ // 判断两个矩形是否相交
  var rect1CenterX = (rect1.xr + rect1.x) / 2; // 矩形1中心点坐标x
  var rect1CenterY = (rect1.yr + rect1.y) / 2; // 矩形1中心点坐标y
  var rect2CenterX = (rect2.xr + rect2.x) / 2; // 矩形2中心点坐标x
  var rect2CenterY = (rect2.yr + rect2.y) / 2; // 矩形2中心点坐标y
  var isX = Math.abs(rect2CenterX - rect1CenterX) < rect1.w / 2 + rect2.w / 2;
  var isY = Math.abs(rect2CenterY - rect1CenterY) < rect1.h / 2 + rect2.h / 2;
  return (isX && isY);
}

Rect.prototype.getIntersectArea = function(rect1, rect2){ // 求两个矩形的相交面积
  var rect3X = Math.max(rect1.x, rect2.x); // 左上角X坐标
  var rect3Y = Math.max(rect1.y, rect2.y); // 左上角Y坐标
　var rect3XR = Math.min(rect1.xr, rect2.xr); // 右下角X坐标
  var rect3YR = Math.min(rect1.yr, rect2.yr); // 右下角Y坐标
  var rect3W = rect3XR - rect3X; // 宽度
  var rect3H = rect3YR - rect3Y; // 高度
  return rect3W*rect3H;
}

Rect.prototype.isHaveReplaceRect = function(currentDrapRect, callback){ // 判断当前拖拽矩形是否与窗体内矩形相交,如果相交且相交面积大于最小面积的3分之2,则放置
  var len = this.rectDataList.length,
      item = null;
  for( var i = 0; i < len; i++ ){
    item = this.rectDataList[i];
    if( item.id == currentDrapRect.id ){
      continue;
    }
    if( this.isIntersect(item,currentDrapRect) == false ){
      continue;
    }
    var minArea = (currentDrapRect.area < item.area) ? currentDrapRect.area : item.area;
    if( this.getIntersectArea(item, currentDrapRect) < minArea*2/3 ){
      continue;
    }
    !!callback ? callback(item.id) : "";
    break;
  }
}
