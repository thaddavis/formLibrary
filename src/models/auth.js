import axios from 'axios'

export default {
    state: {
        auth: null,
        authLoading: false,
        authError: null
    },
    reducers: {
        setAuthSuccess: (state, payload) => {
            return {
                ...state,
                auth: payload
            }
        },
        setAuthLoading: (state, payload) => {
            return {
                ...state,
                authLoading: payload
            }
        },
        setAuthError: (state, payload) => {
            return {
                ...state,
                authError: payload
            }
        }
    },
    effects: (dispatch) => ({
        async login(payload, rootState) {
          try {
            dispatch.auth.setAuthLoading(true)
            dispatch.auth.setAuthError(null)
            let response = await axios.post(`${process.env.REACT_APP_AUTH_SERVER}/login`, payload, { withCredentials: true })  
            dispatch.auth.setAuthLoading(false)
            dispatch.auth.setAuthSuccess(response.data)
          } catch (e) {
            dispatch.auth.setAuthLoading(false)
            dispatch.auth.setAuthError(e.response.data.message)
          }
        },
        async signup(payload, rootState) {
            try {
              dispatch.auth.setAuthLoading(true)
              dispatch.auth.setAuthError(null)
              await axios.post(`${process.env.REACT_APP_AUTH_SERVER}/signup`, payload, {withCredentials: true})
              dispatch.auth.setAuthLoading(false)
            } catch (e) {
              dispatch.auth.setAuthLoading(false)
              dispatch.auth.setAuthError(e.response.data.message)
            }
        },
        async logout(payload, rootState) {
            try {
                dispatch.auth.setAuthLoading(true)
                dispatch.auth.setAuthError(null)
                await axios.post(`${process.env.REACT_APP_AUTH_SERVER}/logout`, {}, {withCredentials: true})
                dispatch.auth.setAuthLoading(false)
                dispatch.auth.setAuthSuccess(null)
            } catch (e) {
                dispatch.auth.setAuthLoading(false)
                dispatch.auth.setAuthError(e.response.data.message)
            }
        },
        async loggedin(payload, rootState) {
            try {
              let response = await axios.get(`${process.env.REACT_APP_AUTH_SERVER}/loggedin`, { withCredentials: true })
              dispatch.auth.setAuthSuccess(response.data)
            } catch (e) {
              dispatch.auth.setAuthError(null)
            }
          },
    })
}