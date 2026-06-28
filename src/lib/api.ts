import { supabase } from "@/integrations/supabase/client";
import { mockSupabase } from "@/integrations/supabase/mock-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Intercept all API calls and route them to local storage to completely remove backend/Supabase access
  if (endpoint === "/dashboard") {
    const { data: reports } = await mockSupabase.from("reports").order("created_at", { ascending: false }).limit(5);
    const { data: uploads } = await mockSupabase.from("uploads");
    const { data: notifications } = await mockSupabase.from("notifications").order("created_at", { ascending: false }).limit(10);
    const totalBytes = uploads?.reduce((acc: number, cur: any) => acc + (cur.file_size || 0), 0) || 0;
    return { 
      uploads_count: uploads?.length || 0,
      recent_reports: reports || [],
      profile: session?.user?.user_metadata || {},
      subscription: { plan: "professional", status: "active" }, // Show professional plan
      notifications: notifications || [],
      total_bytes: totalBytes,
      activity: []
    };
  }
  
  if (endpoint === "/uploads" && options.method === "POST") {
    const row = { 
      id: crypto.randomUUID(),
      user_id: session?.user?.id || "mock-user-id-999",
      created_at: new Date().toISOString()
    };
    await mockSupabase.from("uploads").insert(row);
    return { upload: row };
  }
  
  if (endpoint.startsWith("/reports?upload_id=") && options.method === "POST") {
    const upload_id = endpoint.split("upload_id=")[1];
    
    // Fetch the upload to get the original filename so it matches the OCR hash
    const { data: uploads } = await mockSupabase.from("uploads").select().eq("id", upload_id);
    const filename = uploads?.[0]?.original_filename || "A";
    const hash = filename.length;
    
    const fabricTypes = ["100% Organic Cotton", "60% Cotton / 40% Linen Blend", "100% Fine Merino Wool", "80% Silk / 20% Polyester"];
    const weaves = ["Plain Weave", "Twill", "Satin", "Herringbone", "Jacquard"];
    
    const row = { 
      id: crypto.randomUUID(), 
      upload_id, 
      user_id: session?.user?.id || "mock-user-id-999",
      status: "completed", 
      thread_density: Math.floor(Math.random() * 50) + 70, 
      warp_count: Math.floor(Math.random() * 30) + 40, 
      weft_count: Math.floor(Math.random() * 30) + 30, 
      fabric_type: fabricTypes[hash % fabricTypes.length], 
      weave_pattern: weaves[hash % weaves.length], 
      confidence_score: (0.95 + Math.random() * 0.049).toFixed(4), // Needs to be a fraction because UI multiplies by 100
      ai_suggestions: "The fabric exhibits a consistent weave structure with minimal defects. Recommended for high-tensile strength applications.",
      created_at: new Date().toISOString()
    };
    await mockSupabase.from("reports").insert(row);
    return { report: row };
  }

  throw new Error("Backend API is permanently disabled. Endpoint not mocked: " + endpoint);
}
