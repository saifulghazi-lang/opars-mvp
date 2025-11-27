import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // WARNING: Lock this down to your Vercel domain in Prod
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // 1. Handle CORS Pre-flight (The missing link)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Capture IP
        // 'x-forwarded-for' is standard in Supabase/Vercel environments
        const clientIp = req.headers.get('x-forwarded-for') || 'unknown'

        // 3. Auth Check
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        // 4. Parse Body
        const { proposal_id, vote_status, comments } = await req.json()

        if (!proposal_id || !vote_status) throw new Error('Missing required fields')

        // 5. Perform the RPC or Insert (Passing the IP explicitly)
        // We insert into 'reviews' directly
        const { data: review, error: insertError } = await supabase
            .from('reviews')
            .upsert({
                proposal_id,
                reviewer_id: user.id,
                vote_status,
                comments: comments || null,
            }, { onConflict: 'proposal_id,reviewer_id' })
            .select()
            .single()

        if (insertError) throw insertError

        // 6. Log to Audit Trail (Since we don't have ip_address on reviews table yet)
        const { error: auditError } = await supabase
            .from('legal_audit_log')
            .insert({
                user_id: user.id,
                action: 'VOTE_CAST',
                ip_address: clientIp, // <--- The Critical Data Point
                resource_id: proposal_id,
                metadata: {
                    vote_status,
                    comments: comments || null,
                    review_id: review.id
                }
            })

        if (auditError) console.error('Audit log failed:', auditError)

        return new Response(JSON.stringify({ success: true, review }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
