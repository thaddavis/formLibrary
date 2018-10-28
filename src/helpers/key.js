/*
  Xevo Application Library
  Copyright © 2017 Xevo Inc.
  Patents Pending
  All rights reserved.
  This file contains confidential and proprietary information of Xevo Inc.
  Unauthorized reproduction or distribution of this document is strictly prohibited.
  Xevo Inc.
  Website: www.xevo.com
  Email: info@xevo.com
*/

function onKey (keyCodesParams = [], callback, allowDefault) {
    let keyCodes = [];
    
    if (typeof keyCodesParams === 'string') {
      keyCodes = keyCodesParams.split(/[\s,]+/);
    } else {
      return;
    }
    
    return function (e) {
      if (keyCodes.includes(e.keyCode + '')) {
        if (!allowDefault) e.preventDefault();
        callback.apply(null, arguments);
      }
    }
  }
  
  export default onKey;
  