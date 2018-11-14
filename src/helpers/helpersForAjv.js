import _ from 'lodash';
const p = console.log;

export function assign(obj, path, val) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce(function(obj, key) {
    return obj[key] = (obj && obj[key]) || {}
  }, obj);
  lastObj[lastKey] = val;
}

export function isNormalInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

export function prepareValues(values, field) {
  
  // Test the root of the object --- to see if it is an array or object
  var finalVar = isNormalInteger(field.split(".")[0]) ? [] : {};
  
  function recurse(val, path = '') {
    
    if (
      Object.prototype.toString.call(val) !== '[object Array]' &&
      Object.prototype.toString.call(val) !== '[object Object]'
    ) {
      _.set(finalVar, path, val);
    } else if (isNormalInteger(Object.keys(val)[0])) {
      for (let i of Object.keys(val)) {
        recurse(
          val[i],
          path === '' ? (path + i) : (path + '.' + i)
        )
      }
    } else {
      if (Object.keys(val).length > 0) {
        for (let j of Object.keys(val)) {
          recurse(
            val[j],
            path === '' ? (path + j) : (path + '.' + j)
          )
        }  
      } else {
        _.set(finalVar, path, {});
      }
    }

  }

  recurse(values);
  
  return finalVar;

}

export function resetValues(values, field) {
  
  // Test the root of the object --- to see if it is an array or object
  var finalVar = isNormalInteger(field.split(".")[0]) ? [] : {};
  
  function recurse(val, path = '') {
    
    if (
      Object.prototype.toString.call(val) !== '[object Array]' &&
      Object.prototype.toString.call(val) !== '[object Object]'
    ) {
      _.set(finalVar, path, undefined);
    } else if (isNormalInteger(Object.keys(val)[0])) {
      for (let i of Object.keys(val)) {
        recurse(
          val[i],
          path === '' ? (path + i) : (path + '.' + i)
        )
      }
    } else {
      if (Object.keys(val).length > 0) {
        for (let j of Object.keys(val)) {
          recurse(
            val[j],
            path === '' ? (path + j) : (path + '.' + j)
          )
        }  
      } else {
        _.set(finalVar, path, {});
      }
    }

  }

  recurse(values);
  
  return finalVar;

}

export function buildTouchedObjectWithEveryValueSetToTrue(values) {
  
  var touchedObject = {};
  
  function recurse(val, path = '') {
    if (
      Object.prototype.toString.call(val) !== '[object Array]' &&
      Object.prototype.toString.call(val) !== '[object Object]'
    ) {
      _.set(touchedObject, path, true);
    } else if (isNormalInteger(Object.keys(val)[0])) {
      for (let i of Object.keys(val)) {
        recurse(
          val[i],
          path === '' ? (path + i) : (path + '.' + i)
        )
      }
    } else {
      for (let j of Object.keys(val)) {
        recurse(
          val[j],
          path === '' ? (path + j) : (path + '.' + j)
        )
      }
    }
  }

  recurse(values);

  return touchedObject;

}

export function groupErrors(errors) {
  var errorsObject = {};
  for (let e of Object.keys(errors)) {
    // debugger;
    if (errors[e].keyword === 'required') {
      let path = errors[e].dataPath ? errors[e].dataPath.substring(1).replace("/", ".") + '.' + errors[e].params.missingProperty : errors[e].params.missingProperty;
      _.set(
        errorsObject,
        path,
        !_.get(errorsObject, path) ? [].concat({
          code: errors[e].keyword,
          params: errors[e].params
        }) 
        : 
        _.get(errorsObject, path).concat({
          code: errors[e].keyword,
          params: errors[e].params
        })
      );

    } else {
      
      let path = errors[e].dataPath.substring(1).replace("/", ".");

      _.set(
        errorsObject,
        path,
        !_.get(errorsObject, path) ? [].concat({
          code: errors[e].keyword,
          params: errors[e].params
        }) 
        : 
        _.get(errorsObject, path).concat({
          code: errors[e].keyword,
          params: errors[e].params
        })
      );

    }

  }

  return errorsObject;
}

export function deleteAdditionalPropertiesFromInitializedValues(payload) {

  p('deleteAdditionalPropertiesFromInitializedValues');
  p(payload);

}