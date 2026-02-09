import { supabase } from "../lib/supabase";
import { User } from "../types/User";

/** Normaliza objeto usuario de Supabase (snake_case) a camelCase para el frontend */
function normalizeUser(row: Record<string, unknown> | null): User | null {
  if (!row) return null;
  return {
    ...row,
    name: (row.name ?? "") as string,
    lastName: (row.lastname ?? "") as string,
    studentId: (row.studentid ?? "") as string | undefined,
    professorId: (row.professorid ?? "") as string | undefined,
    dniUrl: (row.dniurl ?? "") as string | undefined,
    degreeUrl: (row.degreeurl ?? "") as string | undefined,
    createdAt: (row.createdat ?? row.created_at ?? "") as string | undefined,
    updatedAt: (row.updatedat ?? "") as string | undefined,
    enrollmentDate: (row.enrollmentdate ?? "") as string | undefined,
    semester: (row.semester ?? undefined) as number | undefined,
  } as User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  // Use Supabase Auth for session management
  async getSession() {
    return await supabase.auth.getSession();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) throw userError;

    return {
      user: normalizeUser(userData),
      token: data.session?.access_token || "",
      refreshToken: data.session?.refresh_token || "",
    };
  }

  async register(userData: any): Promise<AuthResponse> {
    // Handle FormData or object input
    let email: string, password: string, name: string, lastName: string;
    let dniFile: File | null = null;
    let degreeFile: File | null = null;

    if (userData instanceof FormData) {
      email = userData.get("email") as string;
      password = userData.get("password") as string;
      name = userData.get("name") as string;
      lastName = userData.get("lastName") as string;
      dniFile = userData.get("dniUrl") as File;
      degreeFile = userData.get("degreeUrl") as File;
    } else {
      email = userData.email;
      password = userData.password;
      name = userData.name;
      lastName = userData.lastName;
    }

    // Clean names for Supabase Auth (remove special chars)
    const cleanName =
      name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
    const cleanLastName =
      lastName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    // Clean email - more thorough sanitization
    const cleanEmail = email?.trim().toLowerCase() || "";
    console.log("Original email:", `"${email}"`);
    console.log("Cleaned email:", `"${cleanEmail}"`);

    // Validate email format manually before sending to Supabase
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error(`Email inválido: "${cleanEmail}"`);
    }

    // Validate required fields
    if (!cleanEmail || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    // Let Supabase handle email validation
    // Validate password
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Upload files to Supabase Storage if present
    let dniUrl = "";
    let degreeUrl = "";

    if (dniFile) {
      const fileExt = dniFile.name.split(".").pop();
      const fileName = `dni_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      dniUrl = await this.uploadFile(dniFile, "documents", `dni/${fileName}`);
    }

    if (degreeFile) {
      const fileExt = degreeFile.name.split(".").pop();
      const fileName = `degree_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      degreeUrl = await this.uploadFile(
        degreeFile,
        "documents",
        `degrees/${fileName}`,
      );
    }

    // Use Supabase Auth for real registration
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
    });

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase auth error:", error);

      // Handle rate limit specifically
      if (error.message?.includes("rate limit")) {
        throw new Error(
          "Demasiados intentos. Por favor espera 1-2 minutos antes de intentar de nuevo. O prueba con un email completamente diferente.",
        );
      }

      // Handle email already exists
      if (error.message?.includes("already registered")) {
        throw new Error(
          "Este email ya está registrado. Intenta con otro email o inicia sesión.",
        );
      }

      throw error;
    }

    if (!data.user) throw new Error("Registration failed");

    // Insert into public.users table (PostgreSQL uses lowercase for these column names)
    const insertData: any = {
      id: data.user.id,
      email: cleanEmail,
      name: name,
      lastname: lastName,
      status: "PENDIENTE",
      role: "STUDENT",
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    // Add document URLs if uploaded
    if (dniUrl) insertData.dniurl = dniUrl;
    if (degreeUrl) insertData.degreeurl = degreeUrl;

    // Add additional fields if they exist in FormData
    if (userData instanceof FormData) {
      const country = userData.get("country");
      const docType = userData.get("docType");
      const docNumber = userData.get("docNumber");
      const nationality = userData.get("nationality");
      const phoneType = userData.get("phoneType");
      const phonePrefix = userData.get("phonePrefix");
      const phoneArea = userData.get("phoneArea");
      const phoneNumber = userData.get("phoneNumber");
      const degree = userData.get("degree");
      const programType = userData.get("programType");
      const program = userData.get("program");
      const startPeriod = userData.get("startPeriod");

      if (country) insertData.country = country;
      if (docType) insertData.doctype = docType;
      if (docNumber) insertData.docnumber = docNumber;
      if (nationality) insertData.nationality = nationality;
      if (phoneType) insertData.phonetype = phoneType;
      if (phonePrefix) insertData.phoneprefix = phonePrefix;
      if (phoneArea) insertData.phonearea = phoneArea;
      if (phoneNumber) insertData.phonenumber = phoneNumber;
      if (degree) insertData.degree = degree;
      if (programType) insertData.programtype = programType;
      if (program) insertData.program = program;
      if (startPeriod) insertData.startperiod = startPeriod;
    }

    console.log("Inserting into public.users table with data:", insertData);

    const { data: newUserData, error: insertError } = await supabase
      .from("users")
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error details:", insertError);
      throw insertError;
    }

    const user = normalizeUser(newUserData);
    if (!user) throw new Error("Error al crear el perfil");

    return {
      user,
      token: data.session?.access_token || "",
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // User endpoints
  async getProfile(): Promise<User> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("getProfile error:", error);
      throw error;
    }
    const profile = normalizeUser(userData);
    if (!profile) throw new Error("Perfil no encontrado en la base de datos");
    return profile;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .update({
        ...userData,
        updatedat: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    const updated = normalizeUser(data);
    if (!updated) throw new Error("Error al actualizar el perfil");
    return updated;
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    // Supabase allows updating password directly if logged in
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  // Degrees endpoints
  async getDegrees(): Promise<any[]> {
    const { data, error } = await supabase
      .from("Degree")
      .select("*")
      .eq("isActive", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getDegree(id: string): Promise<any> {
    const { data, error } = await supabase
      .from("Degree")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Courses endpoints
  async getCourses(): Promise<any[]> {
    const { data, error } = await supabase
      .from("Course")
      .select("*, professor:User!Course_professorId_fkey(*), degree:Degree(*)")
      .eq("status", "ACTIVE")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getCourse(id: string): Promise<any> {
    const { data, error } = await supabase
      .from("Course")
      .select("*, professor:User!Course_professorId_fkey(*), degree:Degree(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async enrollInCourse(courseId: string): Promise<any> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // This usually involves a transaction in the backend
    // For simplicity, we'll do direct inserts/updates here
    // In a real app, this should be a Supabase RPC (PostgreSQL function)

    const { data: enrollment, error: enrollError } = await supabase
      .from("Enrollment")
      .upsert({
        studentId: user.id,
        courseId: courseId,
        status: "INSCRITO",
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (enrollError) throw enrollError;

    // Increment currentStudents in Course
    const { error: updateError } = await supabase.rpc(
      "increment_course_students",
      { row_id: courseId },
    );
    // Note: increment_course_students RPC needs to be created in Supabase

    return enrollment;
  }

  async dropCourse(courseId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("Enrollment")
      .update({
        status: "RETIRADO",
        updatedAt: new Date().toISOString(),
      })
      .match({ studentId: user.id, courseId: courseId });

    if (error) throw error;

    // Decrement currentStudents in Course
    await supabase.rpc("decrement_course_students", { row_id: courseId });
  }

  async getEnrolledCourses(): Promise<any[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("Enrollment")
      .select(
        "course:Course(*, professor:User!Course_professorId_fkey(*), degree:Degree(*))",
      )
      .eq("studentId", user.id)
      .eq("status", "INSCRITO");

    if (error) throw error;
    return data.map((e: any) => e.course);
  }

  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    // In the backend it sent an email. We can't do that directly from frontend without an edge function.
    // For now, we just return success or could log it to a table.
    return { success: true, message: "Suscripción exitosa" };
  }

  async submitContactForm(formData: any): Promise<ApiResponse> {
    // Log to a Contact table or similar
    const { error } = await supabase.from("Contact").insert([formData]);
    if (error) throw error;
    return { success: true, message: "Mensaje enviado exitosamente" };
  }

  async submitChatbotInquiry(data: any): Promise<ApiResponse> {
    const { error } = await supabase.from("ChatbotInquiry").insert([data]);
    if (error) throw error;
    return { success: true, message: "Consulta enviada exitosamente" };
  }

  // Admin endpoints
  async getUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("createdat", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getPendingUsers(): Promise<User[]> {
    try {
      // Query más básico posible - sin orden
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .limit(10); // Limitar a 10 para pruebas

      if (error) {
        console.error("getPendingUsers error:", error);
        throw error;
      }

      console.log("Usuarios obtenidos:", data);

      // Filtrar usuarios pendientes en el frontend
      const pendingUsers = data
        .filter((u: any) => u.status === "PENDIENTE")
        .map((u: any) => normalizeUser(u) as User);
      console.log("Usuarios pendientes:", pendingUsers);

      return pendingUsers;
    } catch (err) {
      console.error("Error completo en getPendingUsers:", err);
      throw err;
    }
  }

  async approveUser(userId: string): Promise<User> {
    console.log("Aprobando usuario con ID:", userId);

    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          status: "APROBADO",
          updatedat: new Date().toISOString(),
        })
        .match({ id: userId }) // Usar match en lugar de in/eq
        .select(); // Quitar .single()

      if (error) {
        console.error("approveUser error:", error);
        throw error;
      }

      console.log("Usuario aprobado:", data);
      return data[0] as User; // Retornar primer elemento
    } catch (err) {
      console.error("Error completo en approveUser:", err);
      throw err;
    }
  }

  async rejectUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({
        status: "RECHAZADO",
        updatedat: new Date().toISOString(),
      })
      .in("id", [userId])
      .select()
      .single();

    if (error) {
      console.error("rejectUser error:", error);
      throw error;
    }
    return data as User;
  }

  async getUserStats(): Promise<any> {
    // This is more complex in Supabase without edge functions, but we can do multiple counts
    const { count: total } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    const { count: students } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .in("role", ["STUDENT"]);
    const { count: professors } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .in("role", ["PROFESSOR"]);
    const { count: admins } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .in("role", ["ADMIN"]);
    const { count: active } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .in("status", ["APROBADO"]);

    return {
      total,
      students,
      professors,
      admins,
      active,
    };
  }

  /**
   * Obtiene una URL firmada para documentos de Supabase Storage.
   * Necesario cuando el bucket es privado (ej. documentos sensibles como DNI/analíticos).
   */
  async getSignedDocumentUrl(url: string): Promise<string> {
    if (!url || !url.includes("supabase") || !url.includes("/storage/")) {
      return url;
    }

    try {
      const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
      if (!match) return url;

      const [, bucket, path] = match;
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(decodeURIComponent(path), 3600);

      if (error) {
        console.warn("getSignedDocumentUrl error, usando URL original:", error);
        return url;
      }
      return data.signedUrl;
    } catch {
      return url;
    }
  }

  async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    // Direct upload without bucket creation (assume bucket exists)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  }

  async wakeUp(): Promise<void> {
    // No longer needed with direct Supabase access
  }
}

export const api = new ApiClient();
export default api;
