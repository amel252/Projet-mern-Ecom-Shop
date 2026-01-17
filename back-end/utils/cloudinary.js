// import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config({ path: "backend/config/config.env" });
// // import streamifier from "streamifier"; // ⚡ important

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const upload_file = (fileBuffer, folder) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.v2.uploader.upload_stream(
//             { resource_type: "auto", folder },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve({
//                     public_id: result.public_id,
//                     url: result.secure_url,
//                 });
//             }
//         );

//         // ⚡ transforme le buffer en ReadableStream
//         streamifier.createReadStream(fileBuffer).pipe(stream);
//     });
// };

// // export const delete_file = async (file) => {
// //   const res = await cloudinary.v2.uploader.destroy(file);
// //   if (res?.result === "ok") return true;
// // };

// export const delete_file = async (public_id) => {
//     try {
//         const res = await cloudinary.v2.uploader.destroy(public_id, {
//             resource_type: "image",
//         });
//         // ⚡ ou "auto" si tu veux couvrir tous les types
//         console.log("Cloudinary delete result:", res);
//         return res?.result === "ok";
//     } catch (err) {
//         console.error("Cloudinary deletion error:", err);
//         return false;
//     }
// };
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "back-end/config/config.env" });

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = async (base64, folder) => {
    const result = await cloudinary.v2.uploader.upload(base64, {
        folder,
        resource_type: "image",
    });

    return {
        public_id: result.public_id,
        url: result.secure_url,
    };
};

export const delete_file = async (public_id) => {
    try {
        const res = await cloudinary.v2.uploader.destroy(public_id, {
            resource_type: "image",
        });
        console.log("Cloudinary delete result:", res);
        return res?.result === "ok";
    } catch (err) {
        console.error("Cloudinary deletion error:", err);
        return false;
    }
};
