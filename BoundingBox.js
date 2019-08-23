import ReferenceProvider from "luciad/reference/ReferenceProvider";
import FeatureModel from "luciad/model/feature/FeatureModel";
import GeoJsonCodec from "luciad/model/codec/GeoJsonCodec";
import MemoryStore from "luciad/model/store/MemoryStore";
import BasicFeaturePainter from "luciad/view/feature/BasicFeaturePainter";
import FeatureLayer from "luciad/view/feature/FeatureLayer";
import LayerType from "luciad/view/LayerType";
import { store } from "../store/store";
import ShapeFactory from "luciad/shape/ShapeFactory";

// need a query!
function createBoundingBoxesModel() {
  var codec = new GeoJsonCodec({
    generateIDs: false
  });
  var storeBoundingBox = new MemoryStore();
  var reference = ReferenceProvider.getReference("EPSG:4326");
  return new FeatureModel(storeBoundingBox, {
    reference: reference
  });
}
export default function(map) {
  var bbPainter = new BasicFeaturePainter();

  const paintBody = bbPainter.paintBody;

  bbPainter.paintBody = function(geoCanvas, feature, shape, layer, map, state) {
    if (state.selected) {
      geoCanvas.drawShape(shape, {
        stroke: {
          color: "rgba(63, 195, 128, 1)",
          width: 2
        },
        fill: {
          color: "rgba(0, 0, 0, 0)"
        }
      });
    } else {
      geoCanvas.drawShape(shape, {
        stroke: {
          color: "rgba(207, 0, 15, 1)",
          width: 2
        },
        fill: {
          color: "rgba(0, 0, 0, 0)"
        }
      });
    }
    paintBody.apply(arguments);
  };
  const layer = new FeatureLayer(createBoundingBoxesModel(), {
    label: "Bounding Boxes",
    layerType: LayerType.DYNAMIC,
    selectable: true,
    painter: bbPainter,
    id: "Bounding Boxes"
  });
  layer.balloonContentProvider = object => {
    const props = object.properties;
    return `
      NAME: ${props.name}<br />
      ID: ${props.id}<br />
      DESC: ${props.description}
    `;
  };
  var worldBounds = ShapeFactory.createBounds(
    ReferenceProvider.getReference("CRS:84"),
    [-180, 360, -90, 180]
  );
  map.restrictNavigationToBounds(worldBounds);
  map.mapNavigator.fit({ bounds: worldBounds, animate: true });

  map.on("SelectionChanged", ev => {
    console.log(ev);
    if (
      !ev.selectionChanges.length ||
      !ev.selectionChanges[0].selected.length
    ) {
      store.commit("changedSelection", null);
      return;
    }

    store.commit("changedSelection", ev.selectionChanges[0].selected[0].item);
  });

  return layer;
}
