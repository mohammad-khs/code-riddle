// route.ts - Next.js server route (Node runtime)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  // createClient() is synchronous here
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // generate a unique filename while keeping extension
    const fileExt = file.name?.split(".").pop() ?? "bin";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // convert to Buffer for Node
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // upload to private bucket 'uploads'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType: (file as any).type || "application/octet-stream",
        // you can add `upsert: false` (default false) if you want a strict fail-on-existing
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: uploadError.message },
        { status: 500 }
      );
    }
    if (!uploadData || !uploadData.path) {
      console.error("Upload succeeded but no upload path returned", uploadData);
      return NextResponse.json(
        { success: false, message: "Upload did not return a path" },
        { status: 500 }
      );
    }

    // create signed URL for private bucket (adjust expiresInSeconds as needed)
    const expiresInSeconds = 60; // 1 minute
    const { data: signedData, error: signedError } = await supabase.storage
      .from("uploads")
      .createSignedUrl(uploadData.path, expiresInSeconds);

    if (signedError) {
      console.error("Signed URL error:", signedError);
      return NextResponse.json(
        { success: false, message: signedError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: signedData.signedUrl , path: uploadData.path });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
