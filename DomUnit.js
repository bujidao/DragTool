window.DomUnit = {

  cssText:function(ele, cssAttr){
    var cssAttrList = cssAttr;
    var cssText = "";
    var cssList = ele.style.cssText.split(';');
    var len = cssList.length;
    for( var i = 0; i < len; i++ ){
      var item = cssList[i];
      if( !!item == false ) { continue; }
      var cssDic = item.split(':');
      var key = cssDic[0].trim();
      var value = cssDic[1].trim();
      if( !!cssAttrList[key] == false ){
        cssAttrList[key] = value;
      }
    }
    for ( var key in cssAttrList )
    {
        cssText = cssText + key + ":" + cssAttrList[key] + ";";
    }
    ele.style.cssText = cssText;
  },

  getNextNode:function(target, abandonID){
    var prevNode = null;
    var previousSibling = target.nextSibling;
    if( !!previousSibling ){
      if( previousSibling.nodeType != 1 ){
        prevNode = this.getNextNode(previousSibling, abandonID);
      }else{
        if( !!abandonID && previousSibling.getAttribute("id") == abandonID ){
          prevNode = this.getNextNode(previousSibling, abandonID);
        }else{
          prevNode = previousSibling;
        }
      }
    }
    return prevNode;
  },

  cloneCssAttr:function(ele, targetEle, cssList){
    var cssAttr = window.getComputedStyle(ele, null);
    var borderWidth = parseInt(cssAttr["borderBottomWidth"]);
    var height = parseInt(cssAttr["height"]);
    var cssText = "",
        len = cssList.length,
        item = null;
    for( var i = 0; i < len; i++ ){
      item = cssList[i];
      if( item.useCssAttr ){ // 直接使用cssList里面的值
        cssText = cssText + item.cssName + ":" + item.cssAttr + ";";
      }else{
        if( window.Browser.browser == "IE" && item.cssName == "height" && cssAttr["box-sizing"] == "border-box" && borderWidth > 0 ){
          cssText = cssText + "height:"+(height+borderWidth*2)+"px;";
        }else{
          cssText = cssText + item.cssName + ":" + cssAttr[item.cssAttr] + ";";
        }
      }
    }
    targetEle.style.cssText = cssText;
  },

  isParent:function(parent, child){
    if( child.parentNode == parent ){
      return true;
    }else if( child.parentNode == document.body || !child.parentNode ){
      return false;
    }else{
      return this.isParent(parent, child.parentNode)
    }
  },

  setEleBeforeTarget:function(ele, target, delEle, delSort){ // delSort 0先插入后删除, 1先删除后插入
    try{
      var parentNode = target.parentNode;
      if( !!parentNode == false ){ return; }
      if( !!delEle ){
        if( !!delSort ){
          !!delEle.parentNode ? delEle.parentNode.removeChild(delEle) : ""; // 先删除之前的节点
          parentNode.insertBefore(ele, target); // 添加到指定元素之前
        } else {
          parentNode.insertBefore(ele, target); // 添加到指定元素之前
          !!delEle.parentNode ? delEle.parentNode.removeChild(delEle) : ""; // 先删除之前的节点
        }
      }else{
        parentNode.insertBefore(ele, target); // 添加到指定元素之前
      }
    } catch (e){
      // 重新获取
      console.log("dom操作引起的异常");
    }
  },

  resetDomFromLocol:function(dragArea){
    var dragAreaDom = document.getElementById(dragArea);
    if( !dragAreaDom ){ console.log("DOM不存在"); return; }
    var sortdom = LocalData.getValue(dragArea);
    if( !sortdom ){
      return;
    }
    var domTree = JSON.parse(sortdom);
    var len = domTree.length;
    for( var i = 0; i < len; i++ ){
      var item = domTree[i];
      var node = document.getElementById(item.id);
      node.style.width = item.width;
      dragAreaDom.removeChild(node);
      dragAreaDom.appendChild(node);
    }
  },

  saveDomToLocal:function(dragArea, dragItem){
    var dragAreaDom = document.getElementById(dragArea);
    var nodes = dragAreaDom.getElementsByClassName(dragItem);
    if( nodes.length == 0 ){ return; }
    var len = nodes.length,
        parentNode = nodes[0].parentNode,
        item = null,
        domNode = {},
        borderWidth = 0,
        cssAttr = null,
        width = 0,
        documentWid = parentNode.clientWidth,
        domTree = [];
    for( var i = 0; i < len; i++ ){
      item = nodes[i];
      domNode = {};
      domNode["id"] = item.getAttribute("id");
      cssAttr = window.getComputedStyle(item, null);
      width = parseInt(cssAttr["width"]);//获取最终宽度
      borderWidth = parseInt(cssAttr["borderBottomWidth"]);//获取最终边框宽度
      if( window.Browser.browser == "IE"  && cssAttr["box-sizing"] == "border-box" && borderWidth > 0 ) {//因为IE默认在border-box模式下 不把边框宽度算入width
        width = width + borderWidth*2;
      }
      domNode["width"] = width/documentWid*100 + "%";
      domTree.push(domNode)
    }
    var domTreeStr = JSON.stringify(domTree);
    LocalData.setValue(dragArea, domTreeStr);
  }

}
