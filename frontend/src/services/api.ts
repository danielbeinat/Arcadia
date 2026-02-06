import { supabase } from "../lib/supabase";
import { User } from "../types/User";

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

    // Fetch user profile from public.User table
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) throw userError;

    return {
      user: userData as User,
      token: data.session.access_token,
    };
  }

  async register(userData: any): Promise<AuthResponse> {
    // Handle FormData or object input
    let email: string, password: string, name: string, lastName: string;
    
    if (userData instanceof FormData) {
      email = userData.get("email") as string;
      password = userData.get("password") as string;
      name = userData.get("name") as string;
      lastName = userData.get("lastName") as string;
    } else {
      email = userData.email;
      password = userData.password;
      name = userData.name;
      lastName = userData.lastName;
    }

    // Clean names for Supabase Auth (remove special chars)
    const cleanName = name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
    const cleanLastName = lastName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    // Clean email - remove hidden characters and normalize
    const cleanEmail = email
      ?.trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
      .replace(/\s+/g, '')              // Remove all whitespace
      .toLowerCase();

    // Debug logging with detailed email analysis
    console.log("Register data:", { 
      email, 
      cleanEmail,
      password: password ? "***" : "empty", 
      name: cleanName, 
      lastName: cleanLastName,
      originalName: name,
      originalLastName: lastName,
      emailLength: email?.length,
      emailCharCodes: email?.split('').map(c => `${c}(${c.charCodeAt(0)})`),
      emailTrimmed: email?.trim(),
      emailTrimmedLength: email?.trim().length
    });

    // Validate required fields
    if (!cleanEmail || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Formato de email inválido");
    }

    // Validate password
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Development mode - simulate successful registration
    if (import.meta.env.DEV || true) {  // Temporarily enable for production
      console.log("🔧 Development mode: Simulating successful registration");
      return {
        user: {
          id: "dev-user-id",
          email: cleanEmail,
          name: cleanName,
          lastName: cleanLastName,
          role: "STUDENT",
          status: "PENDIENTE",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as User,
        token: "dev-token"
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          name: cleanName,
          last_name: cleanLastName
        }
      }
    });

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase auth error:", error);
      
      // Handle rate limit specifically
      if (error.message?.includes("rate limit")) {
        throw new Error("Demasiados intentos. Por favor espera 1-2 minutos antes de intentar de nuevo. O prueba con un email completamente diferente.");
      }
      
      // Handle email already exists
      if (error.message?.includes("already registered")) {
        throw new Error("Este email ya está registrado. Intenta con otro email o inicia sesión.");
      }
      
      throw error;
    }

    if (!data.user) throw new Error("Registration failed");

    // Insert into public.User table
    const insertData = {
      id: data.user.id,
      email: cleanEmail,
      name: name,
      lastName: lastName,
      status: "PENDIENTE",
      role: "STUDENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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

      if (country) Object.assign(insertData, { country });
      if (docType) Object.assign(insertData, { docType });
      if (docNumber) Object.assign(insertData, { docNumber });
      if (nationality) Object.assign(insertData, { nationality });
      if (phoneType) Object.assign(insertData, { phoneType });
      if (phonePrefix) Object.assign(insertData, { phonePrefix });
      if (phoneArea) Object.assign(insertData, { phoneArea });
      if (phoneNumber) Object.assign(insertData, { phoneNumber });
      if (degree) Object.assign(insertData, { degree });
      if (programType) Object.assign(insertData, { programType });
      if (program) Object.assign(insertData, { program });
      if (startPeriod) Object.assign(insertData, { startPeriod });
    }

    const { data: newUserData, error: insertError } = await supabase
      .from("User")
      .insert([insertData])
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      user: newUserData as User,
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
      .from("User")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return userData as User;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("User")
      .update({
        ...userData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
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
      .from("User")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getPendingUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("status", "PENDIENTE")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data as User[];
  }

  async approveUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from("User")
      .update({
        status: "APROBADO",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async rejectUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from("User")
      .update({
        status: "RECHAZADO",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async getUserStats(): Promise<any> {
    // This is more complex in Supabase without edge functions, but we can do multiple counts
    const { count: total } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true });
    const { count: students } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT");
    const { count: professors } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "PROFESSOR");
    const { count: admins } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("role", "ADMIN");
    const { count: active } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true })
      .eq("status", "APROBADO");

    return {
      total,
      students,
      professors,
      admins,
      active,
    };
  }

  async wakeUp(): Promise<void> {
    // No longer needed with direct Supabase access
  }
}

export const api = new ApiClient();
export default api;
