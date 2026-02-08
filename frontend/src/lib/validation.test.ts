import { describe, it, expect } from "vitest";
import { loginSchema, inscriptionSchema } from "./validation";

describe("loginSchema", () => {
  it("acepta email y contraseña válidos", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña corta", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("inscriptionSchema", () => {
  it("acepta datos válidos", () => {
    const result = inscriptionSchema.safeParse({
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      program: "Informática",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza contraseñas que no coinciden", () => {
    const result = inscriptionSchema.safeParse({
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      password: "SecurePass123",
      confirmPassword: "DifferentPass",
      program: "Informática",
    });
    expect(result.success).toBe(false);
  });
});
