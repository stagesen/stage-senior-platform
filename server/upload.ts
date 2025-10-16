import multer from "multer";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";
import { storage } from "./storage";
import { InsertImage } from "@shared/schema";

// Initialize the object storage client using Replit's sidecar configuration - referenced by javascript_object_storage integration
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
  }
};

// File filter for documents
const documentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const fileExtension = `.${file.originalname.split(".").pop()?.toLowerCase()}`;
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
  }
};

// Configure multer upload middleware
export const uploadSingle = multer({
  storage: multerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("image");

export const uploadMultiple = multer({
  storage: multerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
}).array("images", 20); // Max 20 images at once

export const uploadDocument = multer({
  storage: multerStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for documents
  },
}).single("document");

// File filter for mixed content (images and PDFs) - used for calendar files
const mixedFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedDocMimeTypes = ["application/pdf"];
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const fileExtension = `.${file.originalname.split(".").pop()?.toLowerCase()}`;
  
  if (
    allowedImageMimeTypes.includes(file.mimetype) ||
    allowedDocMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images (JPEG, PNG, WebP, GIF) and PDF files are allowed."));
  }
};

// Configure multer for mixed uploads (images and PDFs)
export const uploadMixed = multer({
  storage: multerStorage,
  fileFilter: mixedFileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
}).single("file");

// Generate unique filename
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");
  const extension = originalFilename.split(".").pop() || "jpg";
  return `${timestamp}-${randomString}.${extension}`;
}

// Extract image dimensions using sharp
export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error("Error extracting image dimensions:", error);
    return { width: 0, height: 0 };
  }
}

// Upload image to object storage
export async function uploadToObjectStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  isPublic: boolean = true
): Promise<string> {
  try {
    // Get environment variables
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    const publicPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
    const privateDir = process.env.PRIVATE_OBJECT_DIR;
    
    if (!bucketId) {
      throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not configured");
    }
    
    // Determine the path based on whether it's public or private
    let objectKey: string;
    let fullPath: string;
    
    if (isPublic) {
      // Use public directory path from environment
      if (!publicPaths) {
        throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not configured");
      }
      // Parse the public path - it's in format like ['/bucket-id/public']
      const publicPath = publicPaths.replace(/[\[\]'"]/g, "").trim();
      fullPath = `${publicPath}/${filename}`;
      // Extract object key from full path (remove bucket prefix)
      const pathParts = fullPath.split("/");
      objectKey = pathParts.slice(2).join("/"); // Remove leading / and bucket name
    } else {
      // Use private directory
      if (!privateDir) {
        throw new Error("PRIVATE_OBJECT_DIR not configured");
      }
      fullPath = `${privateDir}/${filename}`;
      const pathParts = fullPath.split("/");
      objectKey = pathParts.slice(2).join("/"); // Remove leading / and bucket name
    }
    
    // Get bucket instance
    const bucket = objectStorageClient.bucket(bucketId);
    const file = bucket.file(objectKey);
    
    // Upload the buffer to Google Cloud Storage
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });
    
    // Return the full path for the object
    return fullPath;
  } catch (error) {
    console.error("Error uploading to object storage:", error);
    throw new Error("Failed to upload file to object storage");
  }
}

// Delete image from object storage
export async function deleteFromObjectStorage(objectKey: string): Promise<void> {
  try {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not configured");
    }
    
    // Parse the object key to get the actual file path
    // The objectKey might be in format 'public/filename' or full path
    let filePath = objectKey;
    if (objectKey.startsWith("/")) {
      const pathParts = objectKey.split("/");
      filePath = pathParts.slice(2).join("/"); // Remove leading / and bucket name
    }
    
    const bucket = objectStorageClient.bucket(bucketId);
    const file = bucket.file(filePath);
    await file.delete();
  } catch (error) {
    console.error("Error deleting from object storage:", error);
    // Don't throw error if deletion fails, log it and continue
  }
}

// Process single image upload
export async function processSingleImageUpload(
  file: Express.Multer.File,
  uploadedBy?: number
): Promise<{
  imageId: string;
  url: string;
  width: number;
  height: number;
}> {
  const filename = generateUniqueFilename(file.originalname);
  
  // Get image dimensions
  const { width, height } = await getImageDimensions(file.buffer);
  
  // Upload to object storage
  const objectKey = await uploadToObjectStorage(
    file.buffer,
    filename,
    file.mimetype,
    true // Upload to public directory
  );
  
  // Generate public URL
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  const publicUrl = `/${bucketId}/public/${filename}`;
  
  // Save metadata to database
  const imageData: InsertImage = {
    objectKey: `public/${filename}`,
    url: publicUrl,
    alt: file.originalname.split(".")[0].replace(/[-_]/g, " "),
    width,
    height,
    sizeBytes: file.size,
    mimeType: file.mimetype,
    uploadedBy,
  };
  
  const savedImage = await storage.createImage(imageData);
  
  return {
    imageId: savedImage.id,
    url: savedImage.url,
    width: savedImage.width || 0,
    height: savedImage.height || 0,
  };
}

// Process multiple image uploads
export async function processMultipleImageUploads(
  files: Express.Multer.File[],
  uploadedBy?: number
): Promise<Array<{
  imageId: string;
  url: string;
  width: number;
  height: number;
}>> {
  const uploadPromises = files.map((file) => 
    processSingleImageUpload(file, uploadedBy)
  );
  
  return await Promise.all(uploadPromises);
}

// Process mixed file upload (images or PDFs) - stores in images table for calendar files
export async function processMixedFileUpload(
  file: Express.Multer.File,
  uploadedBy?: number
): Promise<{
  imageId: string;
  url: string;
  width?: number;
  height?: number;
}> {
  const filename = generateUniqueFilename(file.originalname);
  const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
  
  let width = 0;
  let height = 0;
  
  // Get dimensions only for images, not PDFs
  if (!isPdf) {
    const dimensions = await getImageDimensions(file.buffer);
    width = dimensions.width;
    height = dimensions.height;
  }
  
  // Upload to object storage
  const objectKey = await uploadToObjectStorage(
    file.buffer,
    filename,
    file.mimetype,
    true // Upload to public directory
  );
  
  // Generate public URL
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  const publicUrl = `/${bucketId}/public/${filename}`;
  
  // Save metadata to database (using images table for compatibility with calendar fields)
  const imageData: InsertImage = {
    objectKey: `public/${filename}`,
    url: publicUrl,
    alt: file.originalname.split(".")[0].replace(/[-_]/g, " "),
    width: isPdf ? null : width,
    height: isPdf ? null : height,
    sizeBytes: file.size,
    mimeType: file.mimetype,
    uploadedBy,
  };
  
  const savedImage = await storage.createImage(imageData);
  
  return {
    imageId: savedImage.id,
    url: savedImage.url,
    ...(isPdf ? {} : { width: savedImage.width || 0, height: savedImage.height || 0 })
  };
}

// Process document upload to object storage
export async function processDocumentUpload(
  file: Express.Multer.File,
  uploadedBy?: number
): Promise<{
  attachmentId: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}> {
  const filename = generateUniqueFilename(file.originalname);
  
  // Upload to object storage (private directory for documents)
  const objectKey = await uploadToObjectStorage(
    file.buffer,
    filename,
    file.mimetype,
    false // Upload to private directory
  );
  
  // Generate private URL
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  const privateDir = process.env.PRIVATE_OBJECT_DIR?.split("/").pop() || ".private";
  const documentUrl = `/${bucketId}/${privateDir}/${filename}`;
  
  // Save attachment metadata to database
  const attachmentData = {
    postId: null, // Will be linked when post is created/updated
    filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    objectKey: `${privateDir}/${filename}`,
    url: documentUrl,
    uploadedBy,
  };
  
  const savedAttachment = await storage.createPostAttachment(attachmentData);
  
  return {
    attachmentId: savedAttachment.id,
    filename: savedAttachment.filename,
    originalName: savedAttachment.originalName,
    url: savedAttachment.url,
    mimeType: savedAttachment.mimeType,
    sizeBytes: savedAttachment.sizeBytes || 0,
  };
}

// Middleware to handle upload errors
export function handleUploadError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        message: "File size too large. Maximum size is 10MB." 
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ 
        message: "Too many files. Maximum is 20 files at once." 
      });
    }
    return res.status(400).json({ 
      message: error.message 
    });
  }
  
  if (error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({ 
      message: error.message 
    });
  }
  
  return res.status(500).json({ 
    message: "Failed to upload file" 
  });
}