import cuid from 'cuid';
import {loadScripts} from '../Script/useScript';

const convertPdfToImagesAsync = (sources=[ `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.min.js`, `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js`]) =>(file) => {
  return loadScripts(sources).then(()=> {
    return _convertPdfToImagesAsync(window.pdfjsLib, window.pdfjsWorker, file);
  });
}

const _convertPdfToImagesAsync = (pdfjsLib, pdfjsWorker, file, scale = 2) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    return new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = function(ev) {
          const iDiv = document.createElement('div');
          iDiv.style = 'visibility:hidden;display:none;';
          iDiv.id = cuid();
          document.getElementsByTagName('body')[0].appendChild(iDiv);

          const loadingTask = pdfjsLib.getDocument(fileReader.result);
          return loadingTask.promise.then((pdf) => {
              const numPages = pdf.numPages;
              const tasks = [];
              for(let i=1; i<=numPages; i++) {
                const promise = pdf.getPage(i).then(function(page) {
                    const viewport = page.getViewport({scale: scale,});
                    const innerDiv = document.createElement('canvas');

                    iDiv.appendChild(innerDiv);

                    const canvas = innerDiv;
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const task = page.render({canvasContext: context, viewport: viewport});
                    return task.promise.then(function(){
                      return canvas.toDataURL('image/png');
                   });
                  });
                  tasks.push(promise);
              }
              return Promise.all(tasks);
            }).then(result=> {
                iDiv.remove();
                resolve(result);
            });
        }
        fileReader.readAsArrayBuffer(file);
    });
}
  


export default convertPdfToImagesAsync;