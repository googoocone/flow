
const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data, error } = await supabase
        .from('success_cases')
        .select('*');

    if (error) {
        console.error('Error fetching success_cases:', error);
    } else {
        console.log('Success Cases found:', data.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkData();
