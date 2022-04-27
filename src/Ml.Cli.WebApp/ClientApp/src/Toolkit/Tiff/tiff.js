import cuid from 'cuid';
import {loadScripts} from '../Script/useScript';

const convertTiffToImagesAsync =  (sources=['https://cdn.jsdelivr.net/npm/geotiff']) => async (file) => {
    let plotty = await import('plotty');
    return loadScripts(sources).then(()=> _convertTiffToImagesAsync(window.GeoTIFF, plotty.plot)(file));
}

const _convertTiffToImagesAsync = (GeoTIFF, plot) => async (file) => {
    const results = [];
    const tiff = await GeoTIFF.fromBlob(file);
    const iDiv = document.createElement('div');
    iDiv.style = 'visibility:hidden;display:none;';
    iDiv.id = cuid();
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    let isContinue = true;
    let index = 0;
    while(isContinue) {
        try {
            const image = await tiff.getImage(index);
            index++;
            const data = await image.readRasters();
            const canvas = document.createElement('canvas');
            iDiv.appendChild(canvas);
            const plot_ = new plot({
                canvas,
                data: data[0],
                width: image.getWidth(),
                height: image.getHeight(),
                domain: [0, 256],
                colorScale: "greys"
            });
            plot_.render();
            results.push(canvas.toDataURL('image/png'));
        } catch(error){
           // if(error.message && error.message.includes("No image")){
                console.error(error);
                // la librairie ne permet pas de connaitre le nombre de page
                isContinue = false;
            //}
            //else {
             //   throw error;
            //}
        }
    }

    iDiv.remove();
    return results;
}

export default convertTiffToImagesAsync;