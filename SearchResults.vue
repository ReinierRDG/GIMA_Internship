<template>
  <div class="container-fluid">
    <div class="searchResults">
      <h3 class="title">Sorteer Zoekresultaten:</h3>
      <hr />
      <form @submit.prevent>
        <div class="sortBy form-group">
          <div class="row">
            <div id="alphabetSelection" class="col-sm-12 btn-group" role="button">
              <label for="alphabetSelection" class="timeCheck col-sm-4">Alphabetisch:</label>
              <button
                class="commit btn btn-info col-sm-2"
                title="A-Z"
                name="asc"
                @click.prevent="activateAlphabetFilter('asc') ; sortAlphabeticalAZ()"
                :class="{ active : alpha == 'asc' }"
                type="submit"
                id="alphaOption1"
                :value="alpha"
              >
                <i class="fas fa-sort-alpha-down"></i>
              </button>
              <button
                class="commit btn btn-info col-sm-2"
                title="Z-A"
                name="desc"
                @click.prevent="activateAlphabetFilter('desc'); sortAlphabeticalZA()"
                :class="{ active : alpha == 'desc' }"
                type="submit"
                id="alphaOption2"
                :value="alpha"
              >
                <i class="fas fa-sort-alpha-up"></i>
              </button>
              <button
                class="commit btn btn-info col-sm-2"
                title="Reset"
                @click.prevent="resetAlphabet(); resetToNoOrder()"
                type="button"
                name="alphabetOrder"
                id="reset"
                :value="alpha"
              >
                <i class="fas fa-undo"></i>
              </button>
            </div>
          </div>
          <div class="row">
            <div id="timeSelection" class="col-sm-12 btn-group-toggle" role="group">
              <label for="timeSelection" class="timeCheck col-sm-4">Kies tijdsindeling:</label>
              <button
                class="btn btn-info col-sm-2"
                title="Geen voorkeur"
                @click.prevent="activateTimeFilter('Geen')"
                :class="{ active : active_timefilter == 'Geen' }"
                type="radio"
                name="options"
                id="timeOption1"
              >Geen</button>
              <button
                class="btn btn-info col-sm-3"
                title="Meest recente resultaten"
                @click.prevent="activateTimeFilter('Recentste')"
                :class="{ active : active_timefilter == 'Recentste' }"
                type="radio"
                name="options"
                id="timeOption2"
              >Recente data</button>
              <button
                class="btn btn-info col-sm-3"
                title="Oudste resultaten"
                @click.prevent="activateTimeFilter('Oudste')"
                :class="{ active : active_timefilter == 'Oudste'}"
                type="radio"
                name="options"
                id="timeOption3"
              >Oudste data</button>
            </div>
          </div>
          <div class="row">
            <!-- A dropdown menu to select a max. scale level to filter the dataset on if applicable. -->
            <div class="scaleGroup col-sm-12 form-group">
              <label for="selectScale" class="scalesCheck col-sm-4">Schaalniveau:</label>
              <select
                id="selectScale"
                class="btn btn-info col-sm-8 form-control"
                v-model="selectedScale"
              >
                <option
                  class="selectedScaleOption"
                  v-for="selectScale in selectScales"
                  :key="selectScale.id"
                >{{ selectScale }}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- every button needs a @click with a method and data -->
    <!-- this could end up in a new component, to reduce size of this .vue -->
    <div class="resultList">
      <h3 class="title2">Resultaten:</h3>
      <div>
        <!-- datasets should be shown in here. Searchresults using the search form. Ask Apollo, the 'answers' should be displayed in this box -->
        <div class="dataList">
          <ol :start="start +1">
            <li tabindex="1" class="results" type="text" v-for="item in items" :key="item.id" role="button">
              <div class="selectedItem" @click.prevent="activateListItem(item)">
               <div
                  class="hoverState"
                  id="hoverListItem"
                  @mouseover="toggleActiveListItem(toggledListItem = item.name)"
                  @mouseout="toggleActiveListItem(toggledListItem = null)"
                >{{item.name}}</div> 
                <div class="hover" v-if="toggledListItem === item.name">
                  <hr />
                  Description: {{ item.description }}
                  <hr />
                  ID: {{ item.id }}
                  <hr />
                  Path: {{item.path}}
                </div>
              </div>
            </li>
          </ol>
        </div>
        <paginate
          :page-count="numPages"
          :page-range="3"
          :margin-pages="1"
          :click-handler="setPage"
          :prev-text="'&laquo;'"
          :next-text="'&raquo;'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        ></paginate>
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      selectScales: [
        "Geen",
        "< 1 : 10.000",
        "< 1 : 25.000",
        "< 1 : 50.000",
        "< 1 : 100.000",
        "< 1 : 250.000",
        "< 1 : 1.000.000"
      ], // scale choices
      selectedScale: "Geen",
      alpha: "",
      active_timefilter: "Geen",
      sortAlphabetical: [],
      toggledListItem: null,
      activeListItem: ""
    };
  },
  components: {
    Paginate
  },
  methods: {
    toggleActiveListItem() {
      this.$store.commit("toggleActiveListItem", this.toggledListItem);
    },
    activateListItem(activeListItem) {
      if (this.activeListItem == activeListItem) {
        this.activeListItem = "";
      } else {
        this.activeListItem = activeListItem;
      }
      this.$store.commit("changeActiveListItem", this.activeListItem);
    },
    activateAlphabetFilter(alpha) {
      if (this.alpha == alpha) {
        this.alpha = "";
      } else {
        this.alpha = alpha;
      }
    },
    sortAlphabeticalAZ(e) {
      this.$store.commit("changedOrder", this.alpha);
      this.items.sort((a, b) => {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    },
    sortAlphabeticalZA() {
      this.$store.commit("changedOrder", this.alpha);
      this.items.sort((b, a) => {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    },
    resetAlphabet() {
      // reset drawing. need more methods to this, after drawing options are set.
      this.alpha = "";
    },
    resetToNoOrder() {
      this.$store.commit("changedOrder", this.alpha);
    },
    activateTimeFilter(time) {
      if (this.active_timefilter == time) {
        this.active_timefilter = time;
      } else {
        this.active_timefilter = time;
      }
    },
    setPage(pageNum) {
      this.$store.commit("changedPage", pageNum);
      console.log(pageNum);
    }
  },
  computed: {
    ...mapGetters(["form", "items", "start", "numPages"]),
    sortSearchResults() {
      return {
        active_alphabet: this.alpha,
        active_timefilter: this.active_timefilter,
        selectedScale: this.selectedScale
      };
    },
    selected: function() {
      return this.items.filter(item => item.selected)
    }
  }
};
</script>

<style>
.pagination > li.active > a {
  background-color: darkblue !important;
  color: white !important;
}
.pagination > li > a {
  background-color: steelblue !important;
  color: white !important;
  font-size: 100%;
}
</style>

<style scoped>
#selectLayerofItem{
  position: relative;
  vertical-align: middle;
  right: 0.5vw;
  float: right;
  z-index: 2;
}
li:focus {
  background-color: lightblue;
}
.results:hover {
  background-color: lightblue;
}
.results {
  font-weight: bold;
  word-wrap: break-word;
}
.hover {
  font-weight: normal;
  word-wrap: break-word;
}
li {
  border: black;
  border-style: double;
  padding-left: 1%;
}
.pagination {
  position: absolute;
  width: 100%;
  margin: auto;
  display: inline-block;
  bottom: 1%;
  font-size: 80%;
  display: flex;
  justify-content: center;
}
.active,
#selectScale {
  background-color: darkblue !important;
  color: white !important;
  font-weight: bold;
}
.alphabeticalCheck,
.timeCheck,
.scalesCheck {
  text-align: left;
  padding-left: 0%;
  font-size: 0.65vw;
}
.table {
  margin-left: 1%;
  max-width: 98%;
}
.submitSearch {
  font-size: 0.75vw;
  margin: auto;
  display: block;
}
.btn {
  font-size: 0.6vw;
  text-align: center;
  border-color: black;
  border-width: 1%;
  display: inline-block;
  vertical-align: text-bottom;
  position: relative;
  padding: 1;
}
.row {
  margin-top: 2%;
}
.title {
  font-size: 0.9vw;
  font-weight: bold;
  text-align: center;
}
.title2 {
  font-size: 0.9vw;
  font-weight: bold;
  text-align: center;
  margin: 2%;
}
.searchResults {
  color: black;
  font-family: "Source Sans Pro", sans-serif;
  background-color: rgb(225, 112, 0);
  position: absolute;
  bottom: 36%;
  left: 1%;
  box-sizing: content-box;
  border-style: solid;
  border-color: darkblue;
  border-width: 20%;
  width: 17%;
  height: 15.75%;
  font-size: 0.85vw;
  padding: 0.2%;
  z-index: 500;
}
.resultList {
  color: black;
  font-family: "Source Sans Pro", sans-serif;
  background-color: rgb(225, 112, 0);
  position: absolute;
  bottom: 10%;
  right: 0.5%;
  box-sizing: content-box;
  border-style: solid;
  border-color: darkblue;
  width: 17%;
  height: 64%;
  font-size: 150%;
  z-index: 500;
  padding: 0.2%;
}
h3,
hr {
  margin: 1%;
}
</style>