# Deploying Supabase Edge Functions

## Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`

## Deployment Steps

### 1. Link to Your Supabase Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
You can find your project ref in your Supabase Dashboard URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`

### 2. Deploy the submit-vote Function
```bash
supabase functions deploy submit-vote
```

### 3. Verify Deployment
After deployment, the function will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/submit-vote
```

## Environment Variables
The Edge Function automatically has access to:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No additional configuration required!

## Testing
You can test the function using cURL:
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/submit-vote \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"proposal_id": "some-uuid", "vote_status": "Approve"}'
```

## Troubleshooting
- **401 Unauthorized**: Check that the user is logged in and token is valid
- **Function not found**: Ensure you've deployed with `supabase functions deploy submit-vote`
- **CORS errors**: The function includes CORS headers for `*` origin
