import { v2 as Cloudinary, UploadApiResponse } from "cloudinary";
import fs from 'fs';

Cloudinary.config({
    cloud_name: 'chaiaurcodelearn',
    api_key: '489753377646774',
    api_secret: "9F3LJzHEb2k3RQ14DeCUDqvoJi0"
});

const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    if (!localFilePath) return null;

    try {
        // Upload the file to Cloudinary
        const response: UploadApiResponse = await Cloudinary.uploader.upload(localFilePath);
        
        // Log success message
        console.log("File has been uploaded successfully on Cloudinary", response.url);

        return response;
    } catch (err) {
        console.error("Error uploading file to Cloudinary:", err);
        return null;
    } finally {
        // Remove the saved temporary file once the operation is finished
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
};

export { uploadOnCloudinary };
