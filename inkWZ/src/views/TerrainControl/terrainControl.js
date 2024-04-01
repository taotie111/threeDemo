const { PlaneGeometry } = require("three");
import * as GeoTIFF from "geotiff";
setupTerrainModel() {
    const readGeoTif = async () => {
        const rawTiff = await GeoTIFF.fromUrl("./平原区dem.tif");
        const tifImage = await rawTiff.getImage();
        const image = {
            width: tifImage.getWidth(),
            height: tifImage.getHeight()
        }
        const geometry = new THREE.PlaneGeometry(
            image.width,
            image.height,
            image.width-1,
            image.height-1

        );
        const data = await tifImage.readRasters({ interleave: true });

        // Fill z values of the geometry
        console.time("parseGeom");
        geometry.vertices.forEach((geom, index) => {
        geom.z = (data[index] / 20) * -1;
        });
        console.timeEnd("parseGeom");
    };

    readGeoTif();
}
export setupTerrainModel;