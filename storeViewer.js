import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);
Vue.prototype.$http = Axios;

const RESULTS_PER_PAGE = 18;

export const store = new Vuex.Store({
  // strict mode off to prevent mutation errors in the console.
  state: {
    form: {
      keyword: "",
      name: "",
      location: "",
      beginDate: null,
      endDate: null
    },
    alpha: "",
    items: [],
    curPage: 1,
    resultsCount: 0,
    fetchError: null,
    toggledListItem: null,
    selectedListItem: null,
    activeListItem: null,
    selection: null
  },
  mutations: {
    changedSelection(state, selection) {
      state.selection = selection;
    },
    toggleActiveListItem(state, toggledListItem) {
      state.toggledListItem = toggledListItem;
    },
    changeActiveListItem(state, activeListItem) {
      state.activeListItem = activeListItem;
    },
    changedForm(state, form) {
      state.form = form;
      this.dispatch("fetchData");
    },
    changedItems(state, items) {
      state.items = items;
    },
    changedOrder(state, alpha) {
      state.alpha = alpha;
    },
    changedResultsCount(state, resultsCount) {
      state.resultsCount = resultsCount;
    },
    changedPage(state, curPage) {
      state.curPage = curPage;
      this.dispatch("fetchData");
    }
  },
  actions: {
    fetchData(context) {
      Axios({
        // use orions at work & luciad-dev.imagem.nl:8083 at home
        method: "get",
        url: `http://---------/erdas-apollo/content/catalog/items?profile=full&keywords=${
          context.state.form.keyword
        }&start=${
          context.getters.start
        }&maxresults=${RESULTS_PER_PAGE}&classes=com.erdas.rsp.babel.model.GenericItem,%20com.erdas.rsp.babel.model.imagery.ImageReference,com.erdas.rsp.babel.model.vector.VectorReference,%20com.erdas.rsp.babel.model.pointcloud.PointCloudResource,%20com.erdas.rsp.babel.model.video.VideoResource`,
        auth: {
          username: "xxxx",
          password: "xxxx"
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      })
        .then(response => {
          context.commit("changedItems", response.data.results);
          context.commit(
            "changedResultsCount",
            +response.data.context.totalAvailableResults
          );
          console.log(context.getters.items);
        })
        .catch(error => {
          this.fetchError = error;
          console.log("No matches found", error);
        });
    }
  },
  getters: {
    form: state => {
      return state.form;
    },
    items: state => {
      return state.items;
    },
    start: state => {
      return (state.curPage - 1) * RESULTS_PER_PAGE;
    },
    numPages: state => {
      return Math.ceil(state.resultsCount / RESULTS_PER_PAGE);
    },
    resultsCount: state => {
      return state.resultsCount;
    }
  },
  watch: {
    curPage: {
      handler: function() {
        this.fetchData();
      },
      immediate: true
    }
  }
});
