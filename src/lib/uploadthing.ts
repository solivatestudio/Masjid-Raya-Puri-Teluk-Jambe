import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<UploadRouter>();
export const UploadButton = generateUploadButton<UploadRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>();

