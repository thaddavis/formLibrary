import moment from 'moment';
import { get, isEqual, startCase} from 'lodash';

import { relationshipOptions } from '../data/dropdown-data';

export function getPrimaryAddress(addresses = []) {
  if (!Array.isArray(addresses)) return {};

  const primaryAddress = addresses.find(address => get(address, 'primary-address', false)) || {};
  primaryAddress['primary-address'] = true;
  return primaryAddress;
}

export function getAdditionalAddresses(addresses = []) {
  if (!addresses.length) return [];

  return addresses.filter(address => !address['primary-address']);
}

export function formatDateNumber(date = '', type = '/') {
  const newDate = new moment(date);
  if (newDate.isValid() && type === '/') {
    return newDate.format('MM/DD/YYYY');
  }

  if (newDate.isValid() && type === '-') {
    return newDate.format('YYYY-MM-DD');
  }

  return '';
}

export function formatDateWords(date = '', format = 'MMMM DD, YYYY') {
  const newDate = new moment(date);

  if (newDate.isValid()) {
    return newDate.format(format);
  }

  return '';
}

export function isAdditionalAddressNotEmpty(address = {}) {
  return Object.values(address).some(value => value);
}

export function findCountry(code, list) {
  return list.find((option) => option.value === code) || {};
}

export function checkRequiredKeys(obj, keys = []) {
  // check if any required field is empty
  return keys.some(key => !obj[key]);
}

export function isSubset(objectOne, objectTwo) {

  for (let property in objectOne) {
    if (!objectOne[property] && !objectTwo[property]) { continue;}
    if (!isEqual(objectOne[property], objectTwo[property])) {
       return false;
    }
  }

  return true;
}

export function startCaseUserName(first = '', last = '') {
  return startCase(`${first.toLowerCase()} ${last.toLowerCase()}`) || '';
}

export function getRelationshipByValue(value) {
  return relationshipOptions().find(rel => rel.value === value) || {};
}
