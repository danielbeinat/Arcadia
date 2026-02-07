import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export const TestSupabase: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Test 1: Conexión básica
      addResult("🔍 Test 1: Probando conexión con Supabase...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      addResult("✅ Conexión exitosa");

      // Test 2: Tabla users existe
      addResult("🔍 Test 2: Verificando tabla users...");
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("email, role, status")
        .limit(1);
      if (usersError) throw usersError;
      addResult(`✅ Tabla users OK - ${users?.length || 0} usuarios encontrados`);

      // Test 3: Admin user existe
      addResult("🔍 Test 3: Buscando usuario admin...");
      const { data: admin, error: adminError } = await supabase
        .from("users")
        .select("email, role, status")
        .eq("email", "admin@arcadia.edu")
        .single();
      if (adminError && adminError.code !== 'PGRST116') {
        throw adminError;
      }
      if (admin) {
        addResult(`✅ Admin encontrado: ${admin.email} (${admin.role})`);
      } else {
        addResult("⚠️ Admin no encontrado - créalo manualmente");
      }

      // Test 4: Storage bucket
      addResult("🔍 Test 4: Verificando bucket 'documents'...");
      try {
        const { data: bucket } = await supabase.storage.getBucket("documents");
        if (bucket) {
          addResult("✅ Bucket 'documents' encontrado");
        } else {
          addResult("⚠️ Bucket 'documents' no existe - créalo desde dashboard");
        }
      } catch (bucketError) {
        addResult("⚠️ Bucket 'documents' no existe - créalo desde dashboard");
      }

      // Test 5: Registro de prueba
      addResult("🔍 Test 5: Probando registro de usuario...");
      const testEmail = `test_${Date.now()}@example.com`;
      const { data: authData, error: regError } = await supabase.auth.signUp({
        email: testEmail,
        password: "test123456",
      });
      
      if (regError && !regError.message?.includes("already registered")) {
        throw regError;
      }
      
      if (authData?.user) {
        // Insertar en tabla users
        const { error: insertError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: testEmail,
          name: "Test",
          lastName: "User",
          role: "STUDENT",
          status: "PENDIENTE",
          program: "Test Program",
        });
        
        if (insertError) throw insertError;
        addResult(`✅ Registro exitoso: ${testEmail}`);
      } else {
        addResult("✅ Registro funcionó (usuario ya existía)");
      }

      addResult("🎉 Todos los tests completados!");

    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 10,
      left: 10,
      background: "white",
      border: "2px solid #667eea",
      borderRadius: 12,
      padding: 20,
      maxWidth: 500,
      maxHeight: 400,
      overflow: "auto",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      zIndex: 9999
    }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#667eea" }}>🧪 Tests de Supabase</h3>
      
      <button
        onClick={runTests}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#ccc" : "#667eea",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 15,
          width: "100%"
        }}
      >
        {loading ? "⏳ Ejecutando..." : "🚀 Ejecutar Tests"}
      </button>

      <div style={{
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: 6,
        padding: 10,
        fontSize: 12,
        fontFamily: "monospace",
        maxHeight: 250,
        overflow: "auto"
      }}>
        {results.length === 0 ? (
          <div style={{ color: "#666" }}>Clic en "Ejecutar Tests" para verificar Supabase</div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: 5 }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "#666" }}>
        💾 Ejecuta el SQL en supabase-setup.sql si hay errores
      </div>
    </div>
  );
};
