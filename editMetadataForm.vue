<template>
    <div>
    <br>
    <h3> Datasets: </h3>
    <div class="datasets">
        <form @submit.prevent="submitSearch()">
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
         <button class="getList" type="submit">Data ophalen</button>
        </form>  
    </div>
    <div class="resultList">
        <h3 class="titleResultList">Data:</h3>
            <div class="listOfData">
                <ol :start="start +1">
                   <li tabindex="1" mousedown.preventdefault class="results" type="text" v-for="item in items" :key="item.id" role="button">
                       <div class="selectedDataset" @click.prevent="selectDataset(item)">{{item.name}}
                         <div class="datasetID">ID: {{item.id}}
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
        <form>
        <table class="metaTable" type="text" style="width:50%; vertical-align:left">
            <thead>
            <tr>
                <th colspan="2" style="background-color:darkblue; color:white">Metadata</th>
            </tr>
            <tr>
                <th colspan="2" style="background-color:cornflowerblue">Eigenschappen</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="background-color: lightsteelblue; width:20%">Naam</td>
                <td><input v-model="activeDataset.name"
                v-on:keydown.enter.prevent type="text" name="name" id="name" title="Naam van de dataset, max 32 tekens"required maxlength="32"/>
                <span class="fa fa-info-circle errspan" title="Tekst om gebruiker te helpen"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">OGC Naam</td>
                <td><input v-model="activeDataset.ogcUniqueName"
                v-on:keydown.enter.prevent type="text" name="ogcName" id="ogcName" title="unieke OGC naam, max 32 tekens" required maxlength="32"/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Titel</td>
                <td><input v-model="activeDataset.title"
                v-on:keydown.enter.prevent type="text" name="title" id="title" title="Titel van de dataset, max 32 tekens" required maxlength="32"/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Samenvatting</td>
                <td><input v-model="activeDataset.description"
                v-on:keydown.enter.prevent type="text" name="description" id="description" title="Beschrijving van de dataset, max 128 tekens" required maxlength="128"/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Tags</td>
                <td><input v-model="activeDataset.tags"
                v-on:keydown.enter.prevent type="text" name="tags[tag][]" id="tags"/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Registratie Datum<i class="fas fa-lock"></i></td>
                <td><input v-model="activeDataset.registrationDate"
                v-on:keydown.enter.prevent type="text" name="registratrionDate" id="registrationDate" disabled/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Eigenaar<i class="fas fa-lock"></i></td>
                <td><input v-model="(((activeDataset || {}).metadata || {}).SPECIAL || {}) .username"
                v-on:keydown.enter.prevent type="text" name="user" id="user" disabled/>
                <span class="fa fa-info-circle errspan"></span></td>
            </tr>
            <tr>
                <th colspan="2" style="background-color:cornflowerblue">Ruimtelijke Eigenschappen</th>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">LatLongBoundingBox<i class="fas fa-lock"></i></td>
                <td><input v-model="(((activeDataset || {}).domainSetExtent || {}).spatialExtent || {}) .latLongBoundingBox"
                v-on: keydown.enter.prevent type="text" name="boundingBox" id="boundingBox" disabled/>
                <span class="fa fa-info-circle errspan"></span></td> 
            </tr> 
            <tr>
                <td style="background-color: lightsteelblue">Bron SRS</td>
                <td><input v-model="((((activeDataset || {}).domainSetExtent || {}).spatialExtent || {}) .srs || {}).srs"
                v-on: keydown.enter.prevent type="text" name="source" id="source"/>
                <span class="fa fa-info-circle errspan"></span></td> 
            </tr> 
            <tr>
                <td style="background-color: lightsteelblue">Omvangsenveloppe<i class="fas fa-lock"></i></td>
                <td><input v-model="((activeDataset || {}).nativeFootprint || {}).envelope"
                v-on: keydown.enter.prevent type="text" name="footprint" id="footprint" disabled/>
                <span class="fa fa-info-circle errspan"></span></td> 
            </tr> 
            <tr>
                <th colspan="2" style="background-color:cornflowerblue">Inwinningsomschrijving</th>
            </tr>
             <tr>
                <td style="background-color: lightsteelblue">Inwinningsdatum</td>
                <td><input v-model="((activeDataset || {}).acquisitionInfo || {}).acquisitionDate"
                v-on: keydown.enter.prevent type="text" name="acquisitionDate" id="acquisitionDate"/>
                <span class="fa fa-info-circle errspan"></span></td> 
            </tr> 
            <tr>
                <td style="background-color: lightsteelblue">Metadata verkregen</td>
                <td><input v-model="((activeDataset || {}).acquisitionInfo || {}).metadataAcquired"
                v-on: keydown.enter.prevent type="text" name="metaAcquisition" id="metaAcquisition"/>
                <span class="fa fa-info-circle errspan" title="true or false"></span></td>  
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Data ingewonnen</td>
                <td><input v-model="((activeDataset || {}).acquisitionInfo || {}).dataAcquired"
                v-on: keydown.enter.prevent type="text" name="dataAcquisition" id="dataAcquisition"/>
                <span class="fa fa-info-circle errspan" title="true or false"></span></td> 
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Data verwerkt</td>
                <td><input v-model="((activeDataset || {}).acquisitionInfo || {}).dataProcessed"
                v-on: keydown.enter.prevent type="text" name="processed" id="processed" value = "true" />
                <!-- <select class="booleanGroup col-sm-12" id="selectBoolean"><option class="optionsDataProcessed col-sm-12" v-for="selectBoolean in selectBooleans"
                >{{ selectBoolean }}</option></select> -->
                <span class="fa fa-info-circle errspan" title="true or false"></span></td>
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Fout waarde</td>
                <td><input v-model="((activeDataset || {}).acquisitionInfo || {}).errorValue"
                v-on: keydown.enter.prevent type="number" name="error" id="error" onkeydown= "return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key))"/> 
                <!-- only allows integer values, 8 allows backspace, 46 allows delete -->
                <span class="fa fa-info-circle errspan" title="Alleen numerieke waarden zijn toegestaan!"></span></td>  
            </tr>
            <tr>
                <td style="background-color: lightsteelblue">Bestandslocatie</td>
                <td><input v-model="activeDataset.path"
                v-on: keydown.enter.prevent type="text" name="path" id="path"/>
                <span class="fa fa-info-circle errspan"></span></td> 
            </tr>
            </tbody>
            <div class="btn-group">
                <button @click="submitEdits()" onclick="alert('Wijzigingen opgeslagen')" type="button" class="submitChangesButton"> Metadata opslaan</button>
                <button @click="cancelTable()" type="submit">Ongedaan maken</button> <!-- resets the whole page -->
            </div>  
        </table>
    </form>
    </div>
</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Paginate from "vuejs-paginate";

export default {
    name: 'Edit', 
    data() {
        return {
            selectBooleans: [
                "true",
                "false"
            ],
            form: {
                keyword: "",
            },
            activeDataSet: [],
            toggledListItem: null,
            activeDatasetBeforeEdit: null
        };
    },
    components: {
        Paginate
    },
    methods: {
        submitSearch() {
            this.$store.commit("changedForm", this.form);
        },
        setPage(pageNum) {
            this.$store.commit("changedPage", pageNum);
        },
        selectDataset(activeDataSet) {
            if (this.activeDataSet == activeDataSet) {
            this.activeDataSet = activeDataSet;
            } else {
            this.activeDataSet = activeDataSet;
            }
            this.$store.commit("changeActiveDataset", this.activeDataSet);
            console.log(activeDataSet)
        },
        toggleActiveListItem() {
            this.$store.commit("toggleActiveListItem", this.toggledListItem);
        }, 
        submitEdits() {
            this.$store.commit("submitChanges", this.activeDataSet);  
        },
        cancelTable() {
            Object.assign(this.activeDataSet, this.activeDatasetBeforeEdit)
            console.log(this.activeDatasetBeforeEdit)
        }
    },
    computed: {
        ...mapGetters(["items", "numPages", "start", "activeDataset"])
    }, 
    created() {
        this.activeDatasetBeforeEdit = Object.assign({}, this.activeDataSet)
    }
}
</script> 

<style>
i {
    margin-left:0.2vw;
}
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
.booleanGroup {
    width: 96%;
    font-size: 0.8vw;
}
.errspan {
    float: right;
    margin-right: 6px;
    margin-top: -1vw;
    position: absolute;
    right: 3px;
    z-index: 2;
    color: darkblue;
}
.errspan:hover {
    color: green !important
}
input:focus {
    background-color: yellow;
}
li.results:focus {
    background-color: yellow;
}
table, th, td {
    border: 1px solid black;
    font-family: "Source Sans Pro", sans-serif;
}
th, td {
    padding: 2px; 
    font-size: 0.8vw;
}
input {
    position: relative;
    width: 95%;
    margin-right: 30px;
    padding: 0.5%;
    font-size: 0.8vw;
}
.metaTable {
    right: 3%;
    bottom: 10%;
    position: absolute;
}
.btn-group {
    right: 3%;
    position: absolute;
}
.resultList {
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    background-color: lightblue;
    position: absolute;
    top: 25%;
    left: 0.5%;
    border-style: solid;
    border-color: darkblue;
    width: 30%;
    height: 65%;
    font-size: 0.8vw; 
    z-index: 500;
    padding: 0.2%;
}
.results:hover {
    background-color: orange;
}
.getList {
    font-size: 0.8vw;
}
.results {
    font-weight: bold;
    word-wrap: break-word;
}
.datasetID {
    font-size: 0.75vw;
}
li {
    border: black;
    border-style: double;
    padding: 0%;
}
.pagination {
    position: absolute;
    width: 100%;
    margin: auto;
    display: inline-block;
    bottom: 1%;
    font-size: 0.8vw;
    display: flex;
    justify-content: center;
}
ul {
    background-color: transparent;
    height: 8%;
}
.hover {
    font-weight: normal;
    word-wrap: break-word;
}
h3{
    margin: 0.5%;
    font-size: 0.9vw;
}
p{
    font-size: 0.7vw;
}
.keywordSearch {
    width: 20%;
    font-size: 0.75vw;
}
.btn-group button{
    float: left;
    margin: 3px;
    font-size: 0.8vw;
    font-weight: bold;
    padding: 4px 12px;
    text-decoration: none;
    border: 1px solid black;
    cursor: pointer;
    background-color: lightgray;
    color: black;
}
.btn-group button:hover {
    background-color: darkgray;
    color: white;
}
.btn-group button:active {
    position: relative;
    top: 1px;
}
</style>
