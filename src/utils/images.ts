import Compressor from "compressorjs";

export const compressImage = async (
  fileInput: File,
  quality: number
): Promise<File | void> => {
  return new Promise((resolve, reject) => {
    const options = {
      quality: quality || 0.5,
      success(result: File) {
        resolve(result);
      },
      error(err: Error) {
        reject(err.message || err);
      },
    };

    new Compressor(fileInput, options);
  });
};
