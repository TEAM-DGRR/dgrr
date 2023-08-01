export const bufferToImage = (blob: Blob | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(blob instanceof Blob)) {
      return reject("bufferToImage - expected buf to be of type: Blob");
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return reject("bufferToImage - expected reader.result to be a string, in onload");
      }

      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
