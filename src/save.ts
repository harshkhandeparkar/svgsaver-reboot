import { isDefined } from './utils';

export function saveDataURL(dataURL: string, name: string) {
  const dl = document.createElement('a');

  dl.setAttribute('href', dataURL);
  dl.setAttribute('download', name);

  dl.dispatchEvent(new MouseEvent('click'));
  return true;
}

export function loadCanvasImage(
  dataURL: string,
  cb: (canvas: HTMLCanvasElement) => void
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    cb(canvas);
  }

  image.src = dataURL;
  return true;
}

export function savePng(dataURL: string, name: string) {
  return loadCanvasImage(
    dataURL,
    (canvas: HTMLCanvasElement) => {
      if (isDefined(canvas.toBlob)) {
        canvas.toBlob((blob) => {
          saveBlob(blob, name);
        })
      } else {
        saveDataURL(canvas.toDataURL('image/png'), name);
      }
    }
  )
}

export function saveBlob(blob: Blob, name: string) {
  return saveDataURL(URL.createObjectURL(blob), name);
}