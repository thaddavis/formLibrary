const p = console.log;

// Converts strings into proper sentence capitalization ex: HI THERE => Hi there
export function pascalCase(str) {
  if (str === null || str === '') return false;
  str = str.toString();

  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function isPhoneNumberValid(str) {
  if (str.length < 5 || str.length > 15) {
    return false;
  }

  return true;
}