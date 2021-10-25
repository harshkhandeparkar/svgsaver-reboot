import { isDefined, PromiseResolve } from './utils';

/**
 * Saves a file from its dataURL.
 *
 * @param dataURL dataURL of the file to be saved.
 * @param name Name of the file to be saved.
 */
export function saveDataURL(
  dataURL: string,
  name: string
) {
  const dl = document.createElement('a');

  dl.setAttribute('href', dataURL);
  dl.setAttribute('download', name);

  dl.dispatchEvent(new MouseEvent('click'));
}

/**
 * Loads an image into a canvas from its dataURL.
 *
 * @async Returns a promise which resolves with the canvas element after the image is loaded.
 * @param dataURL dataURL of the image to be saved.
 */
export async function loadCanvasImage(dataURL: string) {
  return new Promise(
    (resolve: PromiseResolve<HTMLCanvasElement>) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        resolve(canvas);
      }

      image.src = dataURL;
    }
  )
}

/**
 * Saves an image as a PNG from its dataURL.
 *
 * @param dataURL dataURL of the image to be saved.
 * @param name Name of the file to be saved.
 * @async
 */
export async function savePNG(dataURL: string, name: string) {
  const canvas = await loadCanvasImage(dataURL);

  if (isDefined(canvas.toBlob)) {
    canvas.toBlob((blob) => {
      saveBlob(blob, name);
    })
  } else {
    saveDataURL(canvas.toDataURL('image/png'), name);
  }
}

/**
 * Saves a file from its Blob.
 *
 * @param blob
 * @param name The name of the file to be saved.
 */
export function saveBlob(blob: Blob, name: string) {
  saveDataURL(URL.createObjectURL(blob), name);
}