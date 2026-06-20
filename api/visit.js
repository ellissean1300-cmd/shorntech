import { createClient } from '@supabase/supabase-js';

// Your specific Supabase project URL derived from your dashboard link
const supabaseUrl = 'https://npbpcmvbwejlhprcosbk.supabase.co';
// This reads your secret API key securely from your Vercel project settings
const supabaseKey = process.env.SUPABASE_ANON_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Only allow POST requests from your website
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Capture the visitor's real IP address from Vercel's network headers
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

        // Insert the IP address into your 'visitor_logs' table
        const { data, error } = await supabase
            .from('visitor_logs')
            .insert([{ ip_address: ip }]);

        if (error) throw error;

        return res.status(200).json({ success: true, message: "Visit logged successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Failed to log visit to database." });
    }
}
