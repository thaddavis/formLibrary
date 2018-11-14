import axios from 'axios'
import instanceOfAjv from '../helpers/instantiateAjv';
import {
  assign, 
  isNormalInteger, 
  buildTouchedObjectWithEveryValueSetToTrue,
  groupErrors,
  prepareValues,
  resetValues,
  deleteAdditionalPropertiesFromInitializedValues
} from '../helpers/helpersForAjv';

import merge from 'deepmerge'

const p = console.log;

function performValidationAndGroupErrors(payload) {
  let ajv = instanceOfAjv();
  const validate = ajv.compile(payload.schema);
  let valid = validate(payload.values);
  if (!valid) {
    // console.log(validate.errors);
  }
  payload.valid = !validate.errors;
  payload.errors = groupErrors(Object.assign({}, validate.errors));
}

function generateErrorsObjectForForm(payload) {
  p('generateErrorsObjectForForm')
  payload.values = payload.values || {};
  assign(payload.values, payload.field, payload.value);
  let preparedObject = prepareValues(payload.values, payload.field);
  payload.values = preparedObject;
  
  performValidationAndGroupErrors(payload);
}


export default {
    state: {
      editEmergencyContacts: {},
      createEssay: {},
      createPersonForm: {}
    },
    reducers: {
        resetForm: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              valid: false,
              values: payload.values,
              touched: {},
              errors: {}
            }
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
        setStateAfterBlurField: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              ...state[payload.formId],
              touched: merge((state[payload.formId] && state[payload.formId].touched) || {}, payload.touched),
              errors: payload.errors
            }
          }
        },
        setStateAfterRemoveKey: (state, payload) => {
          return {
            ...state,
            [payload.formId]: {
              ...state[payload.formId],
              valid: payload.valid,
              values: payload.values,
              errors: payload.errors,
              touched: payload.touched
            }
          }
        }
    },
    effects: (dispatch) => ({
        async reset(payload, rootState) {

          p('******* reset *******');
          
          let resetValuesRootField;
          if ( Object.prototype.toString.call(payload.values) === '[object Array]') { resetValuesRootField = "0"; } 
          else { resetValuesRootField = ""; }

          payload.values = resetValues(payload.values, resetValuesRootField);

          dispatch.form.resetForm(payload);
          return Promise.resolve();

        },
        async validateForm(payload, rootState) {
          performValidationAndGroupErrors(payload);

          let touched = buildTouchedObjectWithEveryValueSetToTrue(payload.values);
          payload.touched = touched

          dispatch.form.setValidationState(payload)
          return Promise.resolve();
        },
        // example payload for changeField
        // properties of payload will be manipulated in place
        // then will be reduced by reducer
        // {
        //   formId
        //   field
        //   value
        //   schema
        //   values
        // }
        async changeField(payload, rootState) {
          p('changeField')
          payload.touched = payload.touched || {};

          generateErrorsObjectForForm(payload);

          dispatch.form.setStateAfterChangeField(payload)
          return Promise.resolve();
        },
        // example payload for blurField
        // properties of payload will be manipulated in place
        // then will be reduced by reducer
        // {
        //   formId
        //   field
        //   value
        //   schema
        //   values
        // }
        async blurField(payload, rootState) {
          payload.touched = payload.touched || {};
          assign(payload.touched, payload.field, true);

          generateErrorsObjectForForm(payload);

          dispatch.form.setStateAfterBlurField(payload)
          return Promise.resolve();
        },
        async removeKey(payload, rootState) {
          payload.values = payload.values || {};
          payload.touched = payload.touched || {};
          
          p('!!!!!!! removeKey !!!!!!!');
          p(payload);

          // generateErrorsObjectForForm(payload);
          // dispatch.form.setStateAfterRemoveKey(payload)
          
          return Promise.resolve();
        },
        async deleteAdditionalProperties(payload, rootState) {

          p('!!! deleteAdditionalProperties !!!');
          p(payload.values);
          p(payload.errors);

          payload.values = deleteAdditionalPropertiesFromInitializedValues(payload);

          return Promise.resolve();
        }
    })
}