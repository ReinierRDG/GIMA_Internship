<template>
  <div class="container-fluid">
    <div class="row">
      <div class="searchTool">
        <h3 class="title">Zoeksysteem:</h3>
        <form @submit.prevent="submitSearchForm">
          <!-- prevents refreshing page on pressing enter -->
          <div class="keywordSearch form-group">
            <label for="keyword">Zoek op trefwoord:</label>
            <br>
            <input
              name="keyword"
              id="keyword"
              v-model="form.keyword"
              v-on:keydown.enter.prevent
              type="text"
              class="form-control"
              placeholder="bijv. metadata"
            >
            <!-- inputfield for searching a keyword-->
          </div>
          <div class="nameSearch form-group">
            <label for="name">Zoek op naam:</label>
            <br>
            <input
              name="name"
              id="name"
              type="text"
              v-model="form.name"
              v-on:keydown.enter.prevent
              class="form-control"
              placeholder="bijv. kazernes"
            >
            <!-- inputfield for searching a name of a dataset -->
          </div>
          <div class="locationSearch form-group">
            <label for="location">Zoek op locatie:</label>
            <br>
            <input
              name="location"
              id="text"
              type="text"
              v-model="form.location"
              v-on:keydown.enter.prevent
              class="form-control"
              placeholder="bijv. Utrecht"
            >
            <!-- inputfield for searching a geographical location -->
          </div>
          <label>Zoek binnen een periode:</label>
          <br>
          <div class="dateSearch form-group col-xs-6 padding-0">
            <div class="d-flex flex-column">
              <label for="name" class="beginLabel">Begindatum:</label>
              <input
                name="date1"
                id="date"
                type="date"
                v-model="form.beginDate"
                v-on:keydown.enter.prevent
                class="form-control"
              >
              <!-- inputfield for the beginning of the period search -->
            </div>
          </div>
          <div class="dateSearch form-group col-xs-6 padding-0">
            <div class="d-flex flex-column">
              <label for="name" class="endLabel">Einddatum:</label>
              <input
                name="date2"
                id="date"
                type="date"
                v-model="form.endDate"
                v-on:keydown.enter.prevent
                class="form-control"
              >
              <!-- inputfield for the end of the period search -->
            </div>
          </div>
          <button type="submit" class="submitButton" title="Zoeken">
            <i class="fas fa-search"></i>
          </button>
          <!-- v-on:submit.prevent="..." can be applied to this -->
          <!-- knop voor het zoeken. @click nodig voor de connectie met de Apollo API -->
        </form>
      </div>
      <!-- these buttons shouldnt have a submit option. Write the method? with javascript -->
      <!-- Bootstrap buttons to show which button is active. To deactivate click anywhere in the searchform, except buttons. improve if possible. Click again for deactivate -->
      <!-- Need an @click for every button -->
      <!-- either use a script on inputs or buttons.. both need it -->
      <div id="buttonSelectionMenu" class="btn-group-toggle" role="group">
        <h3 class="title">Selecteer een locatie:</h3>
        <button
          @click="activateButton('marker')"
          :class="{ active : active_button == 'marker' }"
          class="btn btn-info"
          type="button"
          id="marker"
          title="Plaats een marker"
        >
          <i class="fas fa-thumbtack"></i>
        </button>
        <button
          @click="activateButton('point')"
          :class="{ active : active_button == 'point' }"
          class="btn btn-info"
          type="button"
          id="point"
          title="Plaats een punt"
        >
          <i class="fas fa-dot-circle"></i>
        </button>
        <button
          @click="activateButton('circle')"
          :class="{ active : active_button == 'circle' }"
          class="btn btn-info"
          type="button"
          id="circle"
          title="Teken een cirkel"
        >
          <i class="fas fa-circle"></i>
        </button>
        <button
          @click="activateButton('square')"
          :class="{ active : active_button == 'square' }"
          class="btn btn-info"
          type="button"
          id="square"
          title="Teken een rechthoek"
        >
          <i class="fas fa-vector-square"></i>
        </button>
        <button
          @click="activateButton('polygon')"
          :class="{ active : active_button == 'polygon' }"
          class="btn btn-info"
          type="button"
          id="polygon"
          title="Teken een polygoon"
        >
          <i class="fas fa-draw-polygon"></i>
        </button>
        <button @click="reset()" class="btn btn-info" type="button" id="reset" title="Reset">
          <!-- needs additional functions -->
          <i class="fas fa-undo"></i>
        </button>
      </div>
      <!-- use v-if for onclick selection to draw the right shape??? Fusion?? -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // all these need to be linked to the SearchResults.vue
      form: {
        keyword: "",
        name: "",
        location: "",
        beginDate: "",
        endDate: ""
      },
      active_button: null
    };
  },
  methods: {
    submitSearchForm() {
      this.$store.commit("changedForm", this.form);
    },
    activateButton(button) {
      // activate buttons for drawing functions
      if (this.active_button == button) {
        this.active_button = "";
      } else {
        this.active_button = button;
      }
    },
    reset() {
      // reset drawing. need more methods to this, after drawing options are set.
      this.active_button = "";
    }
  }
};
</script>

<style scoped>
.beginLabel,
.endLabel {
  font-size: 0.75vw;
}
.active {
  background-color: darkblue !important;
  color: white !important;
}
.searchTool {
  color: black;
  font-family: "Source Sans Pro", sans-serif;
  background-color: rgb(225, 112, 0);
  position: absolute;
  top: 1%;
  left: 1%;
  box-sizing: content-box;
  border-color: darkblue;
  border-style: solid;
  border-width: 20%;
  width: 17%;
  height: 36%;
  font-size: 0.85vw;
  padding: 0.2%;
  z-index: 500;
}
.btn {
  font-size: 0.8vw;
  text-align: center;
  border-color: black;
  border-width: 10%;
  margin-bottom: 20%;
  max-width: 100%;
}
#buttonSelectionMenu {
  top: 38.6%;
  left: 1%;
  position: absolute;
  z-index: 500;
  background-color: rgb(225, 112, 0);
  font-size: 0.9vw;
  width: 17%;
  height: 6.9%;
  box-sizing: content-box;
  border-color: darkblue;
  border-style: solid;
  border-width: 20%;
  padding: 0.2%;
  text-align: center;
  font-family: "Source Sans Pro", sans-serif;
}
.title {
  font-size: 0.9vw;
  font-weight: bold;
  text-align: center;
}
.padding-0 {
  padding-right: 0;
  padding-left: 0;
}
.submitButton {
  margin: auto;
  display: block;
  font-size: 0.75vw;
  position: relative;
}
#keyword,
#name,
#date,
#text {
  font-size: 0.8vw;
}
.dateSearch {
  font-size: 0.75vw;
}
.buttonsTitle {
  font-size: 110%;
  font-weight: bold;
  text-align: center;
}
</style>