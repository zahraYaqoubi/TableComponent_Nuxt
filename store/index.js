import Vuex from "vuex";
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      users: [],
      totalRecords: 0,
    },
    mutations: {
      setUsers(state, users) {
        state.users = users;
      },
      setNumberOfRecords(state, numberOfRecords) {
        state.totalRecords = numberOfRecords;
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios.get('https://jsonplaceholder.typicode.com/users')
        .then(res =>{
          console.log('length: ', res.data.length);
          vuexContext.commit('setUsers', res.data);
          vuexContext.commit('setNumberOfRecords', res.data.length);
        })
        .catch(e => context.error(e));
      },
    },
    getters: {
      Users(state) {
        return state.users;
      },
      totalRecords(state) {
        return state.totalRecords;
      },
    }
  });
};

export default createStore;
