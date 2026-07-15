import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(async () => {
      // Runs on server prior to upload completion
      return { uploadSession: "admin-upload" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for session:", metadata.uploadSession);
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
