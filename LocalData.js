window.LocalData = {

  getValue: function(cookieName) {
    if( !!window.localStorage ) {
      return window.localStorage.getItem(cookieName);
    } else {
      var name = cookieName + "=";
      var ca = document.cookie.split(';');
      var caLength = ca.length;
      for ( var i = 0; i < caLength; i++ ) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    }
  },

  setValue: function(cookieName, cookieValue, cookieExpires, cookiePath) {
    if( !!window.localStorage ){
      window.localStorage.setItem(cookieName, cookieValue)
    }else{
      var d = new Date();
      d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // 设置7天过期
      var expires = "expires=" + d.toGMTString();
      document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    }
  },

  removeValue: function(cookieName) {
    if( !!window.localStorage ){
      window.localStorage.removeItem(cookieName)
    } else {
      var cval = getCkVal(cookieName);
      var d = new Date();
      d.setTime(d.getTime() + (-1 * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toGMTString();
      document.cookie = cookieName + "=" + cval + "; " + expires;
    }
  }

}
