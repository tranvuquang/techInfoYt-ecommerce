export const file2Base64 = (file: File) => {
  if (file && /\/(jpe?g|png|gif|bmp)$/i.test(file.type)) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener(
        "load",
        () => {
          const base64 = fileReader.result as string;
          resolve(base64);
        },
        false
      );
      fileReader.addEventListener(
        "error",
        (error: any) => {
          reject(error);
        },
        false
      );
    });
  } else {
    console.log("File khong hop le!");
    return "";
  }
};
