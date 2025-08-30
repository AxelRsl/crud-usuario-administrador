import { createStore } from 'vuex';
import axios from 'axios';

// URL base para todas las peticiones a la API
const API_URL = 'http://localhost:5000/api';

// Configurar axios con token de autenticación
const setupAxiosInterceptors = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: '',
    error: null
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.user && state.user.role === 'admin',
    authStatus: state => state.status,
    user: state => state.user,
    error: state => state.error
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
      state.error = null;
    },
    AUTH_SUCCESS(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
      state.error = null;
    },
    AUTH_ERROR(state, error) {
      state.status = 'error';
      state.error = error;
    },
    LOGOUT(state) {
      state.status = '';
      state.token = '';
      state.user = null;
    },
    USER_UPDATE(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser };
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    // Registrar usuario
    register({ commit }, userData) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios.post(`${API_URL}/auth/register`, userData)
          .then(resp => {
            const { token, user } = resp.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setupAxiosInterceptors(token);
            commit('AUTH_SUCCESS', { token, user });
            resolve(resp);
          })
          .catch(err => {
            commit('AUTH_ERROR', err.response?.data?.message || 'Error de registro');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            reject(err);
          });
      });
    },

    // Iniciar sesión
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios.post(`${API_URL}/auth/login`, credentials)
          .then(resp => {
            const { token, user } = resp.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setupAxiosInterceptors(token);
            commit('AUTH_SUCCESS', { token, user });
            resolve(resp);
          })
          .catch(err => {
            commit('AUTH_ERROR', err.response?.data?.message || 'Error de inicio de sesión');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            reject(err);
          });
      });
    },

    // Cerrar sesión
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('LOGOUT');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setupAxiosInterceptors(null);
        resolve();
      });
    },

    // Actualizar datos del usuario
    updateUser({ commit }, userData) {
      return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/users/${userData.id}`, userData)
          .then(resp => {
            commit('USER_UPDATE', resp.data.user);
            localStorage.setItem('user', JSON.stringify({
              ...JSON.parse(localStorage.getItem('user')),
              ...resp.data.user
            }));
            resolve(resp);
          })
          .catch(err => {
            commit('AUTH_ERROR', err.response?.data?.message || 'Error al actualizar usuario');
            reject(err);
          });
      });
    },

    // Subir archivo (foto, CV, recibo)
    uploadFile({ commit, state }, { fileType, file }) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append(fileType, file);

        axios.post(`${API_URL}/files/upload/${fileType}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(resp => {
            // Actualizar el estado del usuario con la nueva ruta del archivo
            const updatedUser = { ...state.user };
            updatedUser[fileType] = resp.data.filePath;
            commit('USER_UPDATE', updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            resolve(resp);
          })
          .catch(err => {
            commit('AUTH_ERROR', err.response?.data?.message || `Error al subir ${fileType}`);
            reject(err);
          });
      });
    },

    // Cargar usuarios (solo para admin)
    loadUsers({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/users`)
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            commit('AUTH_ERROR', err.response?.data?.message || 'Error al cargar usuarios');
            reject(err);
          });
      });
    },

    // Limpiar errores
    clearError({ commit }) {
      commit('CLEAR_ERROR');
    }
  },
  modules: {}
});

// Configurar interceptores de axios al iniciar la aplicación
setupAxiosInterceptors(localStorage.getItem('token'));
