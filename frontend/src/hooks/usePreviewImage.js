import { useState } from "react";
import Compressor from "compressorjs";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const showToast = useShowToast();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) { // 5 MB size limit
        showToast("File size too large", "Select an image file less than 2 MB", "error");
        setImageUrl(null);
        return;
      }

      new Compressor(file, {
        quality: 0.6, // Adjust the quality as needed
        success(result) {
          const reader = new FileReader();

          reader.onloadend = () => {
            setImageUrl(reader.result);
          };

          reader.readAsDataURL(result);
        },
        error(err) {
          showToast("Compression error", err.message, "error");
          setImageUrl(null);
        },
      });
    } else {
      showToast("Invalid file type", "Select an image file", "error");
      setImageUrl(null);
    }
  };

  return { handleImgChange, imageUrl, setImageUrl };
};

export default usePreviewImage;