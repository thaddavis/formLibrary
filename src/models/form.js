import axios from 'axios'

// import all schemas for ajv
import emergencyContact from '../schemas/emergency-contact-schema.json';
import emergencyContacts from '../schemas/emergency-contacts-schema.json';
const Ajv = require('ajv');
const _ = require('lodash');

const p = console.log;

export default {
    state: {
      editEmergencyContacts: {}
    },
    reducers: {
        setResetForm: (state, payload) => {
          return {
              ...state,
              form: payload
          }
        },
        setValidateForm: (state, payload) => {
          return {
              ...state,
              form: payload
          }
        },
        setChangeField: (state , payload) => {
          return {
            ...state,
            [payload.formId]: {
              valid: payload.valid,
              values: payload.values,
              // errors: {
              //   ...state[payload.formId].errors,
              //   [payload.field]: payload.errors[payload.field],
              // },
              // touched: {
              //   ...state[payload.formId].touched,
              // },
            },
          };
        },
        setBlurField: (state, payload) => {
          return {
            ...state,
            form: payload
          }
        },
        setSetFields: (state, payload) => {
          return {
            ...state,
            form: payload
          }
        },
    },
    effects: (dispatch) => ({
        async reset(payload, rootState) {
          // dispatch({ type: types.FORM_RESET_FORM, data: payload });
          dispatch.form.setResetForm()
          return Promise.resolve();
        },
        async validateForm(payload, rootState) {
          // dispatch({ type: types.FORM_VALIDATE_FORM, data: payload });
          dispatch.form.setValidateForm()
          return Promise.resolve();
        },
        async changeField(payload, rootState) {
          // p('changeField --------********')
          // p(payload)

          const ajv = new Ajv({
            schemas: [
              emergencyContact,
              emergencyContacts,
            ],
            allErrors: true,
            jsonPointers: true,
          });
          require('ajv-errors')(ajv);
          const validate = ajv.compile(payload.schema);

          function assign(obj, path, val) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const lastObj = keys.reduce(function(obj, key) {
              return obj[key] = (obj && obj[key]) || {}
            }, obj);
            lastObj[lastKey] = val;
          }

          function isNormalInteger(str) {
            return /^\+?(0|[1-9]\d*)$/.test(str);
          }

          var finalVar = isNormalInteger(payload.field.split(".")[0]) ? [] : {};
          console.log(payload.field.split(".")[0]);
          console.log(isNormalInteger(payload.field.split(".")[0]));
          console.log(finalVar);
          function prepareValuesObjectForValidation(val, path = '') {
            console.log('prepareValuesObjectForValidation');
            // debugger;
            // if primitive
            if (
              Object.prototype.toString.call(val) !== '[object Array]' &&
              Object.prototype.toString.call(val) !== '[object Object]'
            ) {
              _.set(finalVar, path, val);
            } else if (isNormalInteger(Object.keys(val)[0])) {
              // _.set(finalVar, path, []);
              for (let i of Object.keys(val)) {
                p('---------');
                p(i);
                prepareValuesObjectForValidation(
                  val[i],
                  path === '' ? (path + i) : (path + '.' + i)
                )
              }
            } else {
              // _.set(finalVar, path, {});
              for (let j of Object.keys(val)) {
                p('---------');
                p(j);
                prepareValuesObjectForValidation(
                  val[j],
                  path === '' ? (path + j) : (path + '.' + j)
                )
              }
            }

          }

          payload.values = payload.values || {}; 
          assign(payload.values, payload.field, payload.value);
          
          p('AJV');

          p('JSON.stringify(finalVar)');
          p(JSON.stringify(finalVar));
          prepareValuesObjectForValidation(payload.values);
          // prepareValuesObjectForValidation(
          //   { 'comeon': [
          //     ['a'],
          //     { '0' : 1 }
          //     ]
          //   }
          // );
          // p(JSON.stringify(finalVar));
          p(validate(finalVar));
          p(validate.errors);

          const errors = {};
      
          payload.valid = !errors;
          payload.errors = Object.assign({}, errors);

          dispatch.form.setChangeField(
            payload
          )
          return Promise.resolve();

        },
        async blurField(payload, rootState) {
          p('blurField')
          p(payload)

          // const errors = validate({
          //   ...payload.values,
          //   [payload.field]: payload.value,
          // }, payload.schema);

          const errors = {};

          payload.valid = !errors;
          payload.errors = Object.assign({}, errors);

          // dispatch({ type: types.FORM_BLUR_FIELD, data: payload });
          dispatch.form.setBlurField()
          return Promise.resolve();
        },
        async setFields(payload, rootState) {
          p('setFields');
          p(payload);

          // dispatch({ type: types.FORM_SET_FIELDS, data: payload });
          dispatch.form.setSetFields()
          return Promise.resolve();
        }
    })
}