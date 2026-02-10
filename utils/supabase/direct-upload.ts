"use client";

import { createClient } from "./client";

interface UploadResult {
  success: boolean;
  path?: string;
  message?: string;
}

/**
 * Upload a file directly to Supabase from the browser
 * Uses the anon key and RLS policies
 * Bypasses Vercel's serverless function timeout limit
 */
export async function uploadFileDirectly(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Generate a unique filename while keeping extension
    const fileExt = file.name?.split(".").pop() ?? "bin";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Upload directly to Supabase bucket
    // This uses the browser client with anon key
    // RLS policies must allow INSERT for this to work
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file, {
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        message: error.message || "Upload failed",
      };
    }

    if (!data || !data.path) {
      return {
        success: false,
        message: "Upload succeeded but returned no path",
      };
    }

    // Call progress callback when complete
    onProgress?.(100);

    return {
      success: true,
      path: data.path,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Upload failed",
    };
  }
}
