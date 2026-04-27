/**
 * Script untuk memberi subscription Basic kepada jsnugroho03@gmail.com
 * Jalankan dengan: node add_subscription.js
 * 
 * Memerlukan SERVICE ROLE KEY (bukan anon key) untuk mengakses auth.users
 * Set environment variable: SUPABASE_SERVICE_KEY=<your-service-role-key>
 */

const SUPABASE_URL = 'https://oqexvxvoqusiiatbgbks.supabase.co';
const TARGET_EMAIL = 'jsnugroho03@gmail.com';

// Menggunakan service role key (lebih banyak akses)
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXh2eHZvcXVzaWlhdGJnYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDIzMjQsImV4cCI6MjA5MTkxODMyNH0.Mz4FY6sESuDhzSE4ZZiQqbb0gGJ3pVYZibHSBVPDkvA';

const KEY = SERVICE_KEY || ANON_KEY;

async function main() {
    console.log('=== Kreavix Subscription Manager ===');
    console.log(`Target: ${TARGET_EMAIL}`);
    console.log(`Using key type: ${SERVICE_KEY ? 'SERVICE ROLE' : 'ANON (limited access)'}\n`);

    // Step 1: Cari user di auth.users (perlu service role)
    if (SERVICE_KEY) {
        console.log('Step 1: Mencari user di auth.users...');
        const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`
            }
        });
        const authData = await authRes.json();
        
        if (authData.users) {
            const user = authData.users.find(u => u.email === TARGET_EMAIL);
            if (!user) {
                console.log('❌ User tidak ditemukan di auth.users');
                console.log('Pastikan user sudah mendaftar terlebih dahulu.');
                return;
            }
            
            console.log(`✅ User ditemukan! UUID: ${user.id}`);
            await addSubscription(user.id, SERVICE_KEY);
        } else {
            console.log('Response:', JSON.stringify(authData, null, 2));
        }
    } else {
        // Tanpa service key - coba cari di profiles table
        console.log('⚠️  Tidak ada SERVICE_KEY. Mencoba di profiles table...');
        console.log('Step 1: Mencari di profiles table...');
        
        const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(TARGET_EMAIL)}&select=*`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`
            }
        });
        const profiles = await profileRes.json();
        console.log('Profiles result:', JSON.stringify(profiles, null, 2));
        
        if (Array.isArray(profiles) && profiles.length > 0) {
            const userId = profiles[0].id;
            console.log(`✅ Profile ditemukan! UUID: ${userId}`);
            await addSubscription(userId, KEY);
        } else {
            console.log('\n❌ Tidak bisa mengakses data. Anda memerlukan:');
            console.log('   1. SERVICE ROLE KEY dari Supabase Dashboard > Project Settings > API');
            console.log('   2. Jalankan: $env:SUPABASE_SERVICE_KEY="your-key"; node add_subscription.js');
            console.log('\nATAU gunakan SQL di Supabase Dashboard > SQL Editor:');
            printManualSQL();
        }
    }
}

async function addSubscription(userId, key) {
    console.log('\nStep 2: Memeriksa subscription yang ada...');
    
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&select=*`, {
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
        }
    });
    const existing = await checkRes.json();
    console.log('Existing subscriptions:', JSON.stringify(existing, null, 2));

    console.log('\nStep 3: Menambah/mengupdate subscription Basic...');
    
    const subData = {
        user_id: userId,
        plan_name: 'Basic',
        billing_cycle: 'monthly',
        status: 'Active'
    };

    // Try insert first
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
        method: 'POST',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(subData)
    });
    
    const insertResult = await insertRes.json();
    
    if (insertRes.ok) {
        console.log('✅ Subscription berhasil ditambahkan!');
        console.log('Result:', JSON.stringify(insertResult, null, 2));
    } else {
        console.log('Insert gagal:', JSON.stringify(insertResult, null, 2));
        
        // Try update if exists
        if (Array.isArray(existing) && existing.length > 0) {
            console.log('\nMencoba update subscription yang ada...');
            const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ plan_name: 'Basic', billing_cycle: 'monthly', status: 'Active' })
            });
            const updateResult = await updateRes.json();
            console.log('Update result:', JSON.stringify(updateResult, null, 2));
        }
    }
}

function printManualSQL() {
    console.log('\n=== SQL MANUAL (Supabase SQL Editor) ===');
    console.log(`
-- Step 1: Cari user ID
SELECT id, email FROM auth.users WHERE email = '${TARGET_EMAIL}';

-- Step 2: Cek apakah profile exists
SELECT * FROM profiles WHERE email = '${TARGET_EMAIL}';

-- Step 3: Insert subscription (ganti USER_UUID dengan id dari Step 1)
INSERT INTO subscriptions (user_id, plan_name, billing_cycle, status)
SELECT id, 'Basic', 'monthly', 'Active' 
FROM auth.users 
WHERE email = '${TARGET_EMAIL}';

-- Atau jika sudah ada subscription, update:
UPDATE subscriptions 
SET plan_name = 'Basic', billing_cycle = 'monthly', status = 'Active'
WHERE user_id = (SELECT id FROM auth.users WHERE email = '${TARGET_EMAIL}');
`);
}

main().catch(console.error);
