// Supabase Configuration
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check session
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return session;
}

// Helper to sign out
async function signOut() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}
