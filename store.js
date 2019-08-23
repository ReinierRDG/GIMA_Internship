import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);
Vue.prototype.$http = Axios;

const RESULTS_PER_PAGE = 20;

export const store = new Vuex.Store({
  state: {
    form: {
      keyword: ""
    },
    items: [],
    resultsCount: 0,
    fetchError: null,
    curPage: 1,
    activeDataset: [],
    toggledListItem: null
  },
  mutations: {
    changedForm(state, form) {
      state.form = form;
      this.dispatch("fetchData");
    },
    changedItems(state, items) {
      state.items = items;
    },
    changedResultsCount(state, resultsCount) {
      state.resultsCount = resultsCount;
    },
    changedPage(state, curPage) {
      state.curPage = curPage;
      this.dispatch("fetchData");
    },
    changeActiveDataset(state, activeDataset) {
      state.activeDataset = activeDataset;
    },
    toggleActiveListItem(state, toggledListItem) {
      state.toggledListItem = toggledListItem;
    },
    submitChanges(state, activeDataset) {
      state.activeDataset = activeDataset;
      this.dispatch("patchEdit");
    },
    editedDataset(state, activeDataset) {
      state.activeDataset = activeDataset;
      console.log(activeDataset);
    }
  },
  actions: {
    fetchData(context) {
      Axios({
        // the request with method, url, authentication and headers
        method: "GET",
        url: `http://orions/erdas-apollo/content/catalog/items?profile=full&keywords=${
          context.state.form.keyword
        }&start=${
          context.getters.start
        }&maxresults=${RESULTS_PER_PAGE}&classes=com.erdas.rsp.babel.model.GenericItem,%20com.erdas.rsp.babel.model.imagery.ImageReference,com.erdas.rsp.babel.model.vector.VectorReference,%20com.erdas.rsp.babel.model.pointcloud.PointCloudResource,%20com.erdas.rsp.babel.model.video.VideoResource`,
        auth: {
          username: "admin",
          password: "apollo123"
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      })
        // response of the request creates a list of items, and counts the amount of results
        .then(response => {
          context.commit("changedItems", response.data.results);
          context.commit(
            "changedResultsCount",
            +response.data.context.totalAvailableResults
          );
          console.log(context.getters.items);
        })
        // in case of no response: throw an error.
        .catch(error => {
          this.fetchError = error;
          console.log("No matches found", error);
        });
    },
    patchEdit(context) {
      const activeDataset = context.state.activeDataset;
      // let tags = activeDataset.tags.split(",");
      Axios({
        method: "patch",
        proxyurl: "https://cors-anywhere.herokuapp.com/", // solves the boolean issues.. kind of..
        url: `http://orions/erdas-apollo/content/catalog/items/${
          activeDataset.id
        }`,
        auth: {
          username: "admin",
          password: "apollo123"
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        },
        data: {
          // most properties seem to be protected from editing. Formatting/permissions in Apollo?
          // tags: tags, // can be added by for example "tags": ["Brielle", "Zeeland"] as many as you want.!
          // only getting to work by creating one array of values.. needs to be 1 array containing subs for each entry
          name: activeDataset.name,
          ogcUniqueName: activeDataset.ogcUniqueName,
          title: activeDataset.title,
          description: activeDataset.description,
          acquisitionInfo: {
            acquisitionDate: activeDataset.acquisitionInfo.acquisitionDate, // yy-mm-dd T hh:mm:ss Z, if only typing a year mm-dd will adapt to current day of edit. Any year goes.. needs validation
            metadataAcquired: activeDataset.acquisitionInfo.metadataAcquired, // allows true or false
            dataAcquired: activeDataset.acquisitionInfo.dataAcquired, // allows true or false
            dataProcessed: activeDataset.acquisitionInfo.dataProcessed, // allows true or false
            errorValue: activeDataset.acquisitionInfo.errorValue // Any integer, but I have no idea what the values stand for..
          }
        },
        withCredentials: true,
        crossDomain: true
      })
        .then(response => {
          context.commit("editedDataset", response.data.results);
          console.log(activeDataset);
          alert("Wijzigingen opgeslagen");
        })
        .catch(error => {
          this.fetchError = error;
          console.log("No changes found", error);
        });
    }
  },
  getters: {
    items: state => {
      return state.items;
    },
    numPages: state => {
      return Math.ceil(state.resultsCount / RESULTS_PER_PAGE);
    },
    start: state => {
      return (state.curPage - 1) * RESULTS_PER_PAGE;
    },
    activeDataset: state => {
      return state.activeDataset;
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

// Patch URL:
// Use something different then patch? PUT? POST? Seems to be no put option in Apollo API.
// Patch seems to be not supported by the server at this moment --> Will result in unending console errors (CORS related etc.)
// Function should be called like this:
// 1. Admin saves his changes,
// 2. Save button will fill in the state of each property.
// 3. Method should read the new state of the property and change this.
// 4. New search should show updated values.
// Workflow largely the same as the get (used before)

// change input --> change active status --> update state --> patch ?
// same authorization, same headers, different method, different response
