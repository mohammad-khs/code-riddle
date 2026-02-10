// route.ts - Generate signed upload URL for direct Supabase uploads
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing fileName or fileType" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Generate a unique filename while keeping extension
    const fileExt = fileName.split(".").pop() ?? "bin";
    const uniqueFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Create a signed URL for uploading (10 minute expiry for upload)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("uploads")
      .createSignedUrl(uniqueFileName, 600);

    if (signedError) {
      console.error("Signed URL error:", signedError);
      return NextResponse.json(
        { success: false, message: signedError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl: signedData.signedUrl,
      fileName: uniqueFileName,
      path: uniqueFileName,
    });
  } catch (err) {
    console.error("Get upload URL error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
