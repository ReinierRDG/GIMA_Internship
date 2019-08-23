import GeoJsonCodec from "luciad/model/codec/GeoJsonCodec";
import Feature from "luciad/model/feature/Feature";
import ReferenceProvider from "luciad/reference/ReferenceProvider";
import TransformationFactory from "luciad/transformation/TransformationFactory";
import Transformation from "luciad/transformation/Transformation";
import ShapeFactory from "luciad/shape/ShapeFactory";
import Vue from "vue";

const codec = new GeoJsonCodec({ generateIds: false });
const transformations = {};
const reference = ReferenceProvider.getReference("EPSG:4326");

function getTransformation(srs) {
  if (!transformations[srs]) {
    transformations[srs] = TransformationFactory.createTransformation(
      ReferenceProvider.getReference(srs),
      reference
    );
  }

  return transformations[srs];
}

function transformCoordinates(coords, srs, transformation) {
  if (transformation) {
    const reference = ReferenceProvider.getReference(srs);
    const point = ShapeFactory.createPoint(reference, coords);
    const newPoint = transformation.transform(point);
    return [newPoint.x, newPoint.y];
  } else {
    return coords;
  }
}

export default function(items) {
  let features = [];
  items.forEach(item => {
    if (!item.domainSetExtent) {
      // sla items zonder geometry over
      return;
    }

    let feature = {
      type: "Feature",
      bbox: [],
      geometry: {
        type: "Polygon",
        coordinates: []
      },
      properties: {
        name: item.name,
        id: item.id,
        description: item.description
      }
    };

    var coordinates = [];
    // geen footprint? gebruik dan bbox
    let data = null;
    let transformation = null;
    let srs = null;

    if (item.footprint) {
      data = item.footprint.data[0];
    } else if (item.nativeFootprint) {
      data = item.nativeFootprint.data[0];
      transformation = getTransformation(item.nativeFootprint.srs);
      srs = item.nativeFootprint.srs;
    } else {
      // clone de array
      feature.bbox = item.domainSetExtent.spatialExtent.latLongBoundingBox.slice(
        0
      );
      srs = feature.bbox.pop(); // verwijder de EPSG
      if (srs !== "EPSG:4326") {
        transformation = getTransformation(strReference);
      }
      data = feature.bbox;
    }

    for (let i = 0; i < data.length; i += 2) {
      coordinates.push(
        transformCoordinates([data[i], data[i + 1]], srs, transformation)
      );
    }
    coordinates.push(
      transformCoordinates([data[0], data[1]], srs, transformation)
    );
    feature.geometry.coordinates = [coordinates];

    const shape = codec.decodeGeometryObject(feature.geometry, reference);
    feature = new Feature(shape, feature.properties);

    // koppel item met feature
    feature.item = item;
    Vue.set(item, "feature", feature);

    features.push(feature);
  });
  return features;
}
