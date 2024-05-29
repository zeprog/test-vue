import Vue from 'vue'
import Vuex from 'vuex'
import {webSocketsUrl} from '../../config'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ws: null,
    role: '',
    settings: {},
    isAssignment: Boolean,
    answers: [],
    submissions: [],
    assignments: [],
  },
  mutations: {
    setSocket (state, data) {
      console.log(data);
      state.ws = data;
    },
    setSessionData (state, data) {
      state.role = data.role;
      state.answers = data.answers;
      state.settings = data.settings;
      state.isAssignment = data.isAssignment;
      state.submissions = data.submissions;
      state.assignments = data.assignments;
    },
    setSettings (state, data) {
      state.settings = data;
    },
    setAssignments (state, data) {
      state.assignments = data;
    },
    setAnswers (state, data) {
      state.answers = [...data];
    },
  },
  actions: {
    wsConnect ({ commit, dispatch, state }) {
      const ws = new WebSocket(`${webSocketsUrl}?session=${document.documentElement.dataset.session}`);
      console.log('LOG 1');
      ws.onmessage = (msg) => {
        console.log(msg);
        const message = JSON.parse(msg.data);
        switch (message.action) {
          case "sessionData":
            commit('setSessionData', message.body);
            break;
          case "assignments":
            commit('setAssignments', message.body);
            break;
          case "wrongToken":
            commit('setSettings', { ...state.settings, token: "" });
            break;
        }
      };
      ws.onclose = () => dispatch('wsReconnect');
      commit('setSocket', ws);
    },
    wsReconnect ({ dispatch }) {
      setTimeout(() => { dispatch('wsConnect'); }, 1000);
    },
    wsSend ({ state }, data) {
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify(data));
      }
    },
    updateSettings ({ commit, dispatch }, payload) {
      dispatch('wsSend', {
        action: 'updateSettings',
        body: payload
      });
      commit('setSettings', payload);
    },
    updateAnswers ({ dispatch }, answers) {
      dispatch('wsSend', {
        action: 'updateAnswers',
        body: answers
      });
    },
    journalDownloaded ({ dispatch }) {
      dispatch('wsSend', {
        action: 'journalDownloaded'
      });
    }
    // wsConnect ({ commit, dispatch, state }) {
    //   const ws = new WebSocket(`${webSocketsUrl}?session=${document.documentElement.dataset.session}`);
    //   ws.onmessage = (msg) => {
    //     const message = JSON.parse(msg.data);
    //     switch (message.action) {
    //       case "sessionData":
    //         commit('setSessionData', message.body);
    //         break;
    //       case "assignments":
    //         commit('setAssignments', message.body);
    //         break;
    //       case "wrongToken":
    //         commit('setSettings', {...state.settings, token: ""});
    //         break;
    //     }
    //   };
    //   ws.onclose = () => dispatch('wsReconnect');
    //   commit('setSocket', ws);
    // },
    // wsReconnect ({ dispatch }) {
    //   setTimeout(()=>{dispatch('wsConnect')}, 1000);
    // },
    // wsSend ({ state }, data) {
    //   if(state.ws && state.ws.readyState === WebSocket.OPEN)
    //     state.ws.send(JSON.stringify(data));
    // },
    // updateSettings ({ commit, dispatch }, payload) {
    //   dispatch('wsSend', {
    //     action: 'updateSettings',
    //     body: payload
    //   });
    //   commit('setSettings', payload);
    // },
    // updateAnswers ({ dispatch }, answers) {
    //   dispatch('wsSend', {
    //     action: 'updateAnswers',
    //     body: answers
    //   });
    // },
    // journalDownloaded ({ dispatch }) {
    //   dispatch('wsSend', {
    //     action: 'journalDownloaded'
    //   });
    // },
  }
})
