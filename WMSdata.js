import WMSTileSetModel from "luciad/model/tileset/WMSTileSetModel";
import WMSTileSetLayer from "luciad/view/tileset/WMSTileSetLayer";
import ReferenceProvider from "luciad/reference/ReferenceProvider";
import LayerType from "luciad/view/LayerType";
// import { url } from "./node_modules/inspector";
import { store } from "../store/store";

function createWMSTileSetModel(map) {
  return new WMSTileSetModel({
    getMapRoot: "http://orions/ApolloCatalogWMSPublic/service.svc/get?",
    // service: "WMS",
    version: "1.3.0",
    layers: ["nuth_percelen", "nuth_panden"],
    reference: ReferenceProvider.getReference("EPSG:28992"),
    transparent: true,
    queryLayers: ["nuth_percelen", "nuth_panden"],
    infoFormat: "image/png",
    tileWidth: 512,
    tileHeight: 512,
    styles: null
  });
}
export default function() {
  var wmsModel = createWMSTileSetModel();
  return new WMSTileSetLayer(wmsModel, {
    label: "Nuth Percelen & Panden",
    layerType: LayerType.DYNAMIC,
    selectable: true,
    visible: false,
    id: "testData"
  });
}

// or reference ("EPSG:4326")
