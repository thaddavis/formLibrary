import axios from 'axios'
import instanceOfAjv from '../helpers/instatiateAjv';
import {
  assign, 
  isNormalInteger, 
  buildTouchedObjectWithEveryValueSetToTrue,
  groupErrors,
  prepareValuesObjectForValidation,
} from '../helpers/helpersForAjv';

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
        setFields: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              ...state[payload.formId],
              values: payload.values
            }
          }
        },
        setValidationState: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              values: payload.values,
              valid: payload.valid,
              errors: payload.errors,
              touched: payload.touched,
            },
          };
        },
        setStateAfterChangeField: (state , payload) => {
          return {
            ...state,
            [payload.formId]: {
              ...state[payload.formId],
              valid: payload.valid,
              values: payload.values,
              errors: payload.errors,
            },
          };
        },
        setBlurField: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              ...state[payload.formId],
              touched: payload.touched
            }
          }
        },
    },
    effects: (dispatch) => ({
        async reset(payload, rootState) {

          dispatch.form.setResetForm();
          return Promise.resolve();

        },
        async validateForm(payload, rootState) {
          
          let ajv = instanceOfAjv();
          const validate = ajv.compile(payload.schema);
          let valid = validate(payload.values);
          if (!valid) {
            // console.log(validate.errors);
          }

          payload.valid = !validate.errors;
          payload.errors = groupErrors(Object.assign({}, validate.errors)); // need to group errors

          let touched = buildTouchedObjectWithEveryValueSetToTrue(payload.values);
          payload.touched = touched

          dispatch.form.setValidationState(payload)
          return Promise.resolve();

        },
        async changeField(payload, rootState) {
          
          payload.values = payload.values || {}; 
          payload.touched = payload.touched || {};
          assign(payload.values, payload.field, payload.value);
          let preparedObject = prepareValuesObjectForValidation(payload.values, payload.field);
          
          let ajv = instanceOfAjv();
          const validate = ajv.compile(payload.schema);
          let valid = validate(preparedObject);
          if (!valid) {
            // console.log(validate.errors);
          }

          payload.valid = !validate.errors;
          payload.errors = groupErrors(Object.assign({}, validate.errors));

          dispatch.form.setStateAfterChangeField(
            payload
          )
          return Promise.resolve();

        },
        async blurField(payload, rootState) {
          payload.touched = payload.touched || {};
          assign(payload.touched, payload.field, true);

          dispatch.form.setBlurField(payload)
          return Promise.resolve();
        },
    })
}