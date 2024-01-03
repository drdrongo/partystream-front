import { useState } from "react";
import "./Uploader.css";
import { compressImage } from "@utils/images";
import { IMAGE_SIZES } from "@enums/imageSizes";
import SizesModal from "@components/SizesModal";
import StatusBox, { LoadStatus } from "@components/StatusBox";

function Uploader() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState<LoadStatus>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sizes, setSizes] = useState([0, 0, 0, 0]);

  async function uploadFile(fileToUpload: File | Blob, signedUrl: string) {
    try {
      // Use the signed URL to upload the file to S3
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: fileToUpload,
        headers: {
          "Content-Type": fileToUpload.type,
        },
      });

      if (response.ok) {
        // Handle success, update UI, etc.
      } else {
        console.error(
          "File upload failed:",
          response.status,
          response.statusText
        );
        // Handle error, update UI, etc.
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  // Make fetch request to backend - send the fileExtension and receive the request URL.
  const fetchSignedUrl = async (): Promise<string | void> => {
    try {
      if (!file) throw new Error("no file selected");

      const fileExtension =
        file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length) ||
        file.name;

      const api = "images/upload-url";
      const backendUrl = new URL(api, import.meta.env.VITE_BASE_URL);
      backendUrl.searchParams.append("fileExtension", fileExtension);
      const { secureUploadUrl } = await fetch(backendUrl).then((response) => {
        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      });

      if (!secureUploadUrl || typeof secureUploadUrl !== "string") {
        throw new Error("missing secure upload url");
      }

      return secureUploadUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchSignedUrl = async (quality: number) => {
    setStatus("loading");
    try {
      const signedUrl = await fetchSignedUrl();
      if (!signedUrl || !file) {
        throw new Error("missing signedUrl");
      }

      let imageData: File | Blob = file;
      if (true && file) {
        const compressedData = await compressImage(file, quality);
        if (!compressedData) throw new Error("Failed to compress image");

        imageData = compressedData;
      }
      await uploadFile(imageData, signedUrl);
      setStatus("success");
    } catch (error) {
      setStatus("failure");
    }
  };

  const getAllSizes = async (): Promise<number[]> => {
    if (!file) return [0, 0, 0, 0];

    const compressedImages = await Promise.all([
      compressImage(file, IMAGE_SIZES.SMALL),
      compressImage(file, IMAGE_SIZES.MEDIUM),
      compressImage(file, IMAGE_SIZES.LARGE),
    ]);
    const sizes: number[] = [];
    const fileSizes = compressedImages.reduce((acc, curr) => {
      if (!curr) return acc;

      return [...acc, curr.size];
    }, sizes);
    return [...fileSizes, file.size];
  };

  const selectSize = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleFetchSignedUrl(Number(event.currentTarget.value));
    setIsModalOpen(false);
  };

  const openSizesModal = async () => {
    setStatus("loading");
    const fileSizes = await getAllSizes();
    setSizes(fileSizes);
    setIsModalOpen(true);
    setStatus(undefined);
  };

  return (
    <div>
      <StatusBox
        status={status}
        setStatus={(st: LoadStatus) => setStatus(st)}
      />

      <div className="flex-down">
        <h1>Get signed url</h1>
        <input
          type="file"
          name="image-upload"
          id="image-upload"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <SizesModal
          isModalOpen={isModalOpen}
          sizes={sizes}
          handleClick={selectSize}
        />
        <button disabled={!file} onClick={openSizesModal}>
          Upload File
        </button>
      </div>
    </div>
  );
}

export default Uploader;
