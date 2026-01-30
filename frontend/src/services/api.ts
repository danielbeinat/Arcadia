const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: "STUDENT" | "PROFESSOR" | "ADMIN";
    studentId?: string;
    professorId?: string;
    program: string;
    semester?: number;
    avatar?: string;
    enrollmentDate: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "INACTIVO" | "SUSPENDIDO";
    gpa?: number;
    credits?: number;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    this.token = localStorage.getItem("auth-token");
  }

  private saveTokenToStorage(token: string): void {
    this.token = token;
    localStorage.setItem("auth-token", token);
  }

  private removeTokenFromStorage(): void {
    this.token = null;
    localStorage.removeItem("auth-token");
  }

  setToken(token: string): void {
    this.saveTokenToStorage(token);
  }

  clearToken(): void {
    this.removeTokenFromStorage();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response.data!;
  }

  async register(userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: "STUDENT" | "PROFESSOR" | "ADMIN";
    program?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } finally {
      this.clearToken();
    }
  }

  // User endpoints
  async getProfile(): Promise<AuthResponse["user"]> {
    const response = await this.request<AuthResponse["user"]>("/users/profile");
    return response.data!;
  }

  async updateProfile(
    userData: Partial<AuthResponse["user"]>,
  ): Promise<AuthResponse["user"]> {
    const response = await this.request<AuthResponse["user"]>(
      "/users/profile",
      {
        method: "PUT",
        body: JSON.stringify(userData),
      },
    );
    return response.data!;
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.request("/users/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Degrees endpoints
  async getDegrees(): Promise<any[]> {
    const response = await this.request<any[]>("/degrees");
    return response.data!;
  }

  async getDegree(id: string): Promise<any> {
    const response = await this.request<any>(`/degrees/${id}`);
    return response.data!;
  }

  // Courses endpoints
  async getCourses(): Promise<any[]> {
    const response = await this.request<any[]>("/courses");
    return response.data!;
  }

  async getCourse(id: string): Promise<any> {
    const response = await this.request<any>(`/courses/${id}`);
    return response.data!;
  }

  async enrollInCourse(courseId: string): Promise<any> {
    const response = await this.request<any>(`/courses/${courseId}/enroll`, {
      method: "POST",
    });
    return response.data!;
  }

  async dropCourse(courseId: string): Promise<void> {
    await this.request(`/courses/${courseId}/enroll`, {
      method: "DELETE",
    });
  }

  async getEnrolledCourses(): Promise<any[]> {
    const response = await this.request<any[]>("/courses/enrolled");
    return response.data!;
  }

  // Admin endpoints
  async getUsers(): Promise<any[]> {
    const response = await this.request<any[]>("/users");
    return response.data!;
  }

  async getPendingUsers(): Promise<AuthResponse["user"][]> {
    const response =
      await this.request<AuthResponse["user"][]>("/users/pending");
    return response.data!;
  }

  async approveUser(userId: string): Promise<AuthResponse["user"]> {
    const response = await this.request<AuthResponse["user"]>(
      `/users/approve/${userId}`,
      {
        method: "POST",
      },
    );
    return response.data!;
  }

  async rejectUser(userId: string): Promise<AuthResponse["user"]> {
    const response = await this.request<AuthResponse["user"]>(
      `/users/reject/${userId}`,
      {
        method: "POST",
      },
    );
    return response.data!;
  }

  async getUserStats(): Promise<any> {
    const response = await this.request<any>("/users/stats");
    return response.data!;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
