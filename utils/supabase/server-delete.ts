import { createClient } from "./server";

/**
 * Delete a file from Supabase storage
 * Server-side only function for admin operations
 * Requires admin credentials
 */
export async function deleteFileFromSupabase(
  filePath: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();

    if (!filePath) {
      return { success: true }; // No file to delete
    }

    const { error } = await supabase.storage.from("uploads").remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return {
        success: false,
        message: error.message || "Delete failed",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Delete failed",
    };
  }
}
