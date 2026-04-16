// Supabase Configuration
// Silakan isi dengan URL dan Anon Key dari Dashboard Supabase Anda
const SUPABASE_URL = 'https://oqexvxvoqusiiatbgbks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXh2eHZvcXVzaWlhdGJnYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDIzMjQsImV4cCI6MjA5MTkxODMyNH0.Mz4FY6sESuDhzSE4ZZiQqbb0gGJ3pVYZibHSBVPDkvA';

// Inisialisasi Supabase Client
// Kita gunakan window.supabase (library) untuk membuat instance, 
// lalu kita simpan instance tersebut kembali ke window.supabase agar bisa dipakai script lain.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check session
window.checkAuth = async function() {
    const { data: { session }, error } = await window.supabase.auth.getSession();
    return session;
};

// Helper to sign out
window.signOut = async function() {
    await window.supabase.auth.signOut();
    window.location.href = 'index.html';
};
