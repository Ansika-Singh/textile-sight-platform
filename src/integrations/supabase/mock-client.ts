import { toast } from "sonner";

// Helper to generate UUIDs
const genUUID = () => {
  // Generate a standard RFC4122 v4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Types
export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  role: string;
}

const DEFAULT_USER: MockUser = {
  id: "mock-user-id-999",
  email: "guest@threadcounty.com",
  user_metadata: {
    full_name: "Guest Analyst",
  },
  role: "admin", // Administrator access to view the Admin panel
};

// Mock Database initial state
const INITIAL_UPLOADS = [
  {
    id: "f3747c3f-c309-4e78-bc5a-e374cdb94d1b",
    user_id: "mock-user-id-999",
    storage_path: "fabric-images/twill-specimen.jpg",
    original_filename: "denim_specimen_04.png",
    file_size: 1048576,
    mime_type: "image/png",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "d9e8461c-8432-4752-9b2f-9273f5bda512",
    user_id: "mock-user-id-999",
    storage_path: "fabric-images/plain-specimen.jpg",
    original_filename: "linen_weave_fine.jpg",
    file_size: 2048576,
    mime_type: "image/jpeg",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "8c35f29d-482a-4318-97fb-bf07df2a613c",
    user_id: "mock-user-id-999",
    storage_path: "fabric-images/satin-specimen.jpg",
    original_filename: "silk_satin_gold.png",
    file_size: 4194304,
    mime_type: "image/png",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

const INITIAL_REPORTS = [
  {
    id: "c463f820-2f98-4cda-92e1-45cd3b5bda14",
    upload_id: "f3747c3f-c309-4e78-bc5a-e374cdb94d1b",
    user_id: "mock-user-id-999",
    status: "completed",
    thread_density: 88.0,
    warp_count: 54,
    weft_count: 34,
    fabric_type: "Cotton Denim",
    weave_pattern: "Twill Weave (2/1)",
    confidence_score: 99.8,
    ai_suggestions: "Strong diagonal warp floats. Highly uniform tension. Suitable for heavy duty metrics.",
    notes: "Production batch A-09 sample.",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "f9b8c7d6-3e4d-5c6b-7a8b-9c0d1e2f3a4b",
    upload_id: "d9e8461c-8432-4752-9b2f-9273f5bda512",
    user_id: "mock-user-id-999",
    status: "completed",
    thread_density: 52.0,
    warp_count: 28,
    weft_count: 24,
    fabric_type: "Pure Linen",
    weave_pattern: "Plain Weave (1/1)",
    confidence_score: 98.5,
    ai_suggestions: "Standard basket weave profile. Slight natural slub thickness variations observed.",
    notes: "Linen bedding specimen.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "3e4d5c6b-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    upload_id: "8c35f29d-482a-4318-97fb-bf07df2a613c",
    user_id: "mock-user-id-999",
    status: "completed",
    thread_density: 160.0,
    warp_count: 92,
    weft_count: 68,
    fabric_type: "Mulberry Silk",
    weave_pattern: "Satin Weave (5-harness)",
    confidence_score: 96.7,
    ai_suggestions: "Long warp floats create optimal face lustrous qualities. Low friction profile verified.",
    notes: "Premium yarn specimen inspection.",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

const INITIAL_PROFILES = [
  {
    id: "mock-user-id-999",
    email: "guest@threadcounty.com",
    full_name: "Guest Analyst",
    company: "ThreadCounty Labs",
    job_title: "Lead Metrology Engineer",
    avatar_url: null,
    bio: "Reviewing premium textile diagnostics using automated scanning instrumentation.",
    created_at: new Date(Date.now() - 3600000 * 100).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_ROLES = [
  {
    id: "role-1",
    user_id: "mock-user-id-999",
    role: "admin",
    created_at: new Date().toISOString(),
  }
];

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "sub-1",
    user_id: "mock-user-id-999",
    plan: "professional",
    status: "active",
    current_period_end: new Date(Date.now() + 3600000 * 24 * 30 * 6).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Load local database helper
const getMockTable = (key: string, initial: any[]) => {
  if (typeof window === "undefined") return initial;
  const data = localStorage.getItem(`threadcounty_mock_db_${key}`);
  if (!data) {
    localStorage.setItem(`threadcounty_mock_db_${key}`, JSON.stringify(initial));
    return initial;
  }
  const parsed = JSON.parse(data);
  // Auto-migrate/reset cache if legacy report-x or mock-uuid-x IDs are found
  if (parsed.length > 0 && parsed.some((item: any) => 
    String(item.id).startsWith("report-") || 
    String(item.id).startsWith("upload-") || 
    String(item.id).startsWith("mock-uuid-")
  )) {
    localStorage.setItem(`threadcounty_mock_db_${key}`, JSON.stringify(initial));
    return initial;
  }
  return parsed;
};

const saveMockTable = (key: string, data: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`threadcounty_mock_db_${key}`, JSON.stringify(data));
  }
};

// Custom event listeners for auth changes
const notifyAuthListeners = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-state-change"));
  }
};

export const mockSupabase = {
  auth: {
    signUp: async (params: { email: string; password?: string; options?: any }) => {
      const mockUser = {
        id: "mock-user-" + Math.random().toString(36).substr(2, 9),
        email: params.email,
        user_metadata: params.options?.data || { full_name: params.email.split("@")[0] },
        role: "user",
      };
      
      // Save profile
      const profiles = getMockTable("profiles", INITIAL_PROFILES);
      profiles.push({
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.user_metadata.full_name,
        company: "Independent",
        job_title: "Analyst",
        avatar_url: null,
        bio: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      saveMockTable("profiles", profiles);

      // Save user role
      const roles = getMockTable("user_roles", INITIAL_ROLES);
      roles.push({
        id: genUUID(),
        user_id: mockUser.id,
        role: "user",
        created_at: new Date().toISOString(),
      });
      saveMockTable("user_roles", roles);

      // Save subscription
      const subs = getMockTable("subscriptions", INITIAL_SUBSCRIPTIONS);
      subs.push({
        id: genUUID(),
        user_id: mockUser.id,
        plan: "free",
        status: "active",
        current_period_end: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      saveMockTable("subscriptions", subs);

      if (typeof window !== "undefined") {
        localStorage.setItem("threadcounty_mock_user", JSON.stringify(mockUser));
      }
      notifyAuthListeners();

      return { data: { user: mockUser, session: { user: mockUser, access_token: "mock-token" } }, error: null };
    },

    signInWithPassword: async (params: { email: string; password?: string }) => {
      const email = params.email.toLowerCase();
      const mockUser = {
        id: email === "demo@threadcounty.com" || email === "guest@threadcounty.com" ? "mock-user-id-999" : "mock-user-" + Math.random().toString(36).substr(2, 9),
        email: params.email,
        user_metadata: {
          full_name: email === "demo@threadcounty.com" || email === "guest@threadcounty.com" ? "Guest Analyst" : params.email.split("@")[0],
        },
        role: email === "demo@threadcounty.com" || email === "guest@threadcounty.com" ? "admin" : "user",
      };

      // Add profile if not exists
      const profiles = getMockTable("profiles", INITIAL_PROFILES);
      if (!profiles.some((p: any) => p.email.toLowerCase() === email)) {
        profiles.push({
          id: mockUser.id,
          email: mockUser.email,
          full_name: mockUser.user_metadata.full_name,
          company: "Independent",
          job_title: "Analyst",
          avatar_url: null,
          bio: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        saveMockTable("profiles", profiles);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("threadcounty_mock_user", JSON.stringify(mockUser));
      }
      notifyAuthListeners();

      return { data: { user: mockUser, session: { user: mockUser, access_token: "mock-token" } }, error: null };
    },

    signInWithOAuth: async (params: any) => {
      // Mock OAuth login (simulate error since offline)
      return { data: { provider: params?.provider, url: null }, error: new Error("OAuth is disabled in offline mode. Please use email or demo login.") };
    },

    signInAnonymously: async () => {
      const mockUser = DEFAULT_USER;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("threadcounty_mock_user", JSON.stringify(mockUser));
      }
      notifyAuthListeners();

      return { data: { user: mockUser, session: { user: mockUser, access_token: "mock-token" } }, error: null };
    },

    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("threadcounty_mock_user");
      }
      notifyAuthListeners();
      return { error: null };
    },

    getSession: async () => {
      let user = DEFAULT_USER;
      if (typeof window !== "undefined") {
        const userJson = localStorage.getItem("threadcounty_mock_user");
        if (userJson) {
          try {
            user = JSON.parse(userJson);
          } catch (e) {}
        } else {
          localStorage.setItem("threadcounty_mock_user", JSON.stringify(DEFAULT_USER));
        }
      }
      return { data: { session: { user, access_token: "mock-token" } }, error: null };
    },

    getUser: async () => {
      let user = DEFAULT_USER;
      if (typeof window !== "undefined") {
        const userJson = localStorage.getItem("threadcounty_mock_user");
        if (userJson) {
          try {
            user = JSON.parse(userJson);
          } catch (e) {}
        } else {
          localStorage.setItem("threadcounty_mock_user", JSON.stringify(DEFAULT_USER));
        }
      }
      return { data: { user }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const handleEvent = () => {
        let user = DEFAULT_USER;
        if (typeof window !== "undefined") {
          const userJson = localStorage.getItem("threadcounty_mock_user");
          if (userJson) {
            try {
              user = JSON.parse(userJson);
            } catch (e) {}
          } else {
            localStorage.setItem("threadcounty_mock_user", JSON.stringify(DEFAULT_USER));
          }
        }
        callback("SIGNED_IN", { user, access_token: "mock-token" });
      };
      
      if (typeof window !== "undefined") {
        window.addEventListener("auth-state-change", handleEvent);
      }
      
      // Fire callback immediately with current state to avoid missing initial trigger
      let initialUser = DEFAULT_USER;
      if (typeof window !== "undefined") {
        const userJson = localStorage.getItem("threadcounty_mock_user");
        if (userJson) {
          try {
            initialUser = JSON.parse(userJson);
          } catch (e) {}
        } else {
          localStorage.setItem("threadcounty_mock_user", JSON.stringify(DEFAULT_USER));
        }
      }
      setTimeout(() => callback("SIGNED_IN", { user: initialUser, access_token: "mock-token" }), 0);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              if (typeof window !== "undefined") {
                window.removeEventListener("auth-state-change", handleEvent);
              }
            }
          }
        }
      };
    },

    resetPasswordForEmail: async (email: string, options?: any) => {
      return { data: {}, error: null };
    }
  },

  // Mock database querying builder
  from: (table: string) => {
    let mockData: any[] = [];
    switch (table) {
      case "profiles":
        mockData = getMockTable("profiles", INITIAL_PROFILES);
        break;
      case "reports":
        const reports = getMockTable("reports", INITIAL_REPORTS);
        const uploads = getMockTable("uploads", INITIAL_UPLOADS);
        mockData = reports.map((r: any) => ({
          ...r,
          upload: uploads.find((u: any) => u.id === r.upload_id) || null,
        }));
        break;
      case "uploads":
        mockData = getMockTable("uploads", INITIAL_UPLOADS);
        break;
      case "user_roles":
        mockData = getMockTable("user_roles", INITIAL_ROLES);
        break;
      case "subscriptions":
        mockData = getMockTable("subscriptions", INITIAL_SUBSCRIPTIONS);
        break;
      case "contact_messages":
        mockData = getMockTable("contact_messages", []);
        break;
      default:
        mockData = [];
    }

    const builder = {
      data: mockData,
      filters: [] as any[],

      select: function(columns?: string) {
        return this;
      },

      eq: function(field: string, value: any) {
        this.data = this.data.filter((item: any) => {
          if (field === "id" || field === "user_id" || field === "upload_id") {
            return String(item[field]) === String(value);
          }
          return item[field] === value;
        });
        return this;
      },

      order: function(field: string, options?: { ascending?: boolean }) {
        const asc = options?.ascending !== false;
        this.data = [...this.data].sort((a: any, b: any) => {
          if (a[field] < b[field]) return asc ? -1 : 1;
          if (a[field] > b[field]) return asc ? 1 : -1;
          return 0;
        });
        return this;
      },

      limit: function(num: number) {
        this.data = this.data.slice(0, num);
        return this;
      },

      maybeSingle: async function() {
        const result = this.data.length > 0 ? this.data[0] : null;
        return { data: result, error: null };
      },

      single: async function() {
        if (this.data.length === 0) {
          return { data: null, error: { message: "No rows found" } };
        }
        return { data: this.data[0], error: null };
      },

      insert: function(values: any) {
        const rows = Array.isArray(values) ? values : [values];
        const newRows = rows.map((row: any) => ({
          id: row.id || genUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...row,
        }));
        
        mockData.push(...newRows);
        saveMockTable(table, mockData);

        this.data = newRows;
        return this;
      },

      update: function(values: any) {
        // Simple update on filtered items
        this.data.forEach((item: any) => {
          Object.assign(item, values, { updated_at: new Date().toISOString() });
        });

        // Save back full table
        const fullTable = getMockTable(table, []);
        const updatedTable = fullTable.map((item: any) => {
          const match = this.data.find((d: any) => d.id === item.id);
          return match ? match : item;
        });
        saveMockTable(table, updatedTable);

        return this;
      },

      delete: function() {
        // Save back remaining items
        const fullTable = getMockTable(table, []);
        const remainingTable = fullTable.filter((item: any) => {
          return !this.data.some((d: any) => d.id === item.id);
        });
        saveMockTable(table, remainingTable);
        return this;
      },

      // Then returns the final promise directly if awaited
      then: function(onfulfilled?: (value: any) => any) {
        const promise = Promise.resolve({ data: this.data, error: null });
        return promise.then(onfulfilled);
      }
    };

    return builder;
  },

  // Mock Storage operations with local Object URL caching for the active browser session
  storage: {
    from: (bucket: string) => {
      // Local session cache for holding uploaded image urls
      if (!(window as any).__threadcounty_file_urls) {
        (window as any).__threadcounty_file_urls = {};
      }
      const fileUrls = (window as any).__threadcounty_file_urls;

      return {
        upload: async (path: string, file: any, options?: any) => {
          if (file instanceof Blob || file instanceof File) {
            try {
              const url = URL.createObjectURL(file);
              fileUrls[path] = url;
            } catch (e) {
              console.error("Failed to create Object URL for mock storage upload:", e);
            }
          }
          return { data: { path }, error: null };
        },
        createSignedUrl: async (path: string, expiresIn: number) => {
          // If the file was uploaded in this session, return its local Object URL
          if (fileUrls[path]) {
            return { data: { signedUrl: fileUrls[path] }, error: null };
          }

          // Default fallback mock pictures
          let url = "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800";
          if (path.includes("avatars")) {
            url = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"; // Default avatar
          } else if (path.includes("twill")) {
            url = "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"; // Real blue denim texture
          } else if (path.includes("plain")) {
            url = "https://images.unsplash.com/photo-1584905066893-7d5c14eaaf3a?auto=format&fit=crop&q=80&w=800"; // Real linen texture
          } else if (path.includes("satin")) {
            url = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800"; // Real white/gold satin silk texture
          }
          return { data: { signedUrl: url }, error: null };
        },
        remove: async (paths: string[]) => {
          paths.forEach((p) => {
            if (fileUrls[p]) {
              try {
                URL.revokeObjectURL(fileUrls[p]);
              } catch (e) {}
              delete fileUrls[p];
            }
          });
          return { data: {}, error: null };
        }
      };
    }
  },

  channel: (name: string) => {
    return {
      on: (event: any, filter: any, callback: any) => {
        return {
          subscribe: () => {
            return {
              unsubscribe: () => {}
            };
          }
        };
      }
    };
  },
  
  removeChannel: (channel: any) => {
    if (channel?.unsubscribe) {
      channel.unsubscribe();
    }
  },

  rpc: async (fn: string, args?: any) => {
    // Mock rpc calls
    if (fn === "delete_user_self") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("threadcounty_mock_user");
      }
      return { data: null, error: null };
    }
    return { data: null, error: null };
  }
};
