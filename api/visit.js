import { createClient } from '@supabase/supabase-js';

// Initialize your database client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Retrieve the visitor's IP address from Vercel's request headers
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

        // Insert the IP address into your database table named 'visitor_logs'
        const { data, error } = await supabase
            .from('visitor_logs')
            .insert([{ ip_address: ip }]);

        if (error) throw error;

        // Respond with success
        return res.status(200).json({ success: true, message: "Visit logged." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Failed to log visit." });
    }
}
