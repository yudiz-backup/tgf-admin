import { queryClient } from 'App'
let nav

export function setNav(n) {
  nav = n
}

export function navigationTo(link) {
  nav(link)
}

export function removeToken() {
  localStorage.clear('')
  sessionStorage.clear('')
}

export function toaster(message, type) {
  queryClient.defaultOptions.message(message, type)
}

export function getDirtyFormValues(dirtyFields, allValues) {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, getDirtyFormValues(dirtyFields[key], allValues[key])]))
}

export const fileToDataUri = (file) => {
  return new Promise((resolve) => {
    if (typeof file === 'string') {
      // If file is a URL, fetch it and convert to Blob
      fetch(file)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          console.error('Error fetching or converting URL to Blob: ', error);
          resolve(null); // Handle the error as needed
        });
    } else if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. It should be a Blob or a URL string.');
      resolve(null); // Handle the error as needed
    }
  });
}

export async function getImageFileFromUrl (url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch the image. Status: ${response.status}`);
      }
      const blob = await response.blob();
      const imageFile = new File([blob], 'image.png', { type: blob.type });

      return imageFile;
  } catch (error) {
      console.error('Error occurred while fetching the image:', error);
  }
}

