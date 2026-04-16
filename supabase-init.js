// Supabase Configuration
// Silakan isi dengan URL dan Anon Key dari Dashboard Supabase Anda
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Inisialisasi Supabase Client
// Inisialisasi Supabase Client
// Kita tempelkan ke window agar bisa diakses oleh <script> lain di HTML
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
