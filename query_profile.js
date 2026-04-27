const URL = 'https://oqexvxvoqusiiatbgbks.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXh2eHZvcXVzaWlhdGJnYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDIzMjQsImV4cCI6MjA5MTkxODMyNH0.Mz4FY6sESuDhzSE4ZZiQqbb0gGJ3pVYZibHSBVPDkvA';

fetch(`${URL}/rest/v1/profiles?select=*`, {
    headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`
    }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
