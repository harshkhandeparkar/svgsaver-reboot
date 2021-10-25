import { isDefined } from './utils';

export function saveUri(uri: string, name: string) {
  const dl = document.createElement('a');

  dl.setAttribute('href', uri);
  dl.setAttribute('download', name);

  dl.dispatchEvent(new MouseEvent('click'));
  return true;
}

export function loadCanvasImage(
  uri: string,
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

  image.src = uri;
  return true;
}

export function savePng(uri: string, name: string) {
  return loadCanvasImage(
    uri,
    (canvas: HTMLCanvasElement) => {
      if (isDefined(canvas.toBlob)) {
        canvas.toBlob((blob) => {
          saveBlob(blob, name);
        })
      } else {
        saveUri(canvas.toDataURL('image/png'), name);
      }
    }
  )
}

export function saveBlob(blob: Blob, name: string) {
  return saveUri(URL.createObjectURL(blob), name);
}