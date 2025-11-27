# OPARS Deployment Guide: Audit Trail & Edge Functions

## Step 1: Deploy Database Migration (Audit Trail Table)

### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/audit_trail.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success message

## Step 2: Install Supabase CLI

### Windows Installation
Open PowerShell **as Administrator** and run:
```powershell
# Using Scoop (Recommended)
scoop install supabase

# OR using npm (if you have admin rights)
npm install -g supabase
```

If you don't have Scoop, install it first:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Verify Installation
```bash
supabase --version
```

## Step 3: Login to Supabase
```bash
supabase login
```
This will open a browser window for authentication.

## Step 4: Link Your Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
**Where to find YOUR_PROJECT_REF:**
- Go to Supabase Dashboard
- Look at the URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`
- Copy the part after `/project/`

## Step 5: Deploy Edge Function
```bash
cd c:\Users\User\Documents\OPARS
supabase functions deploy submit-vote
```

## Step 6: Test the Deployment

### Test via Browser (Easiest)
1. Go to `http://localhost:5173`
2. Log in as Member Demo
3. Click on any proposal
4. Click "Approve"
5. Check your Supabase Dashboard > Table Editor > `legal_audit_log`
6. You should see a new row with your IP address!

### Test via SQL Query
In Supabase SQL Editor, run:
```sql
SELECT * FROM legal_audit_log ORDER BY timestamp DESC LIMIT 5;
```

## Troubleshooting

### "supabase: command not found"
- Close and reopen PowerShell after installation
- Ensure you installed with admin rights

### "Project ref not found"
- Double-check your project ref from the dashboard URL
- Ensure you're logged in (`supabase login`)

### "Permission denied" on npm install
- Run PowerShell as Administrator
- OR use Scoop instead (doesn't require admin after initial install)

### Edge Function not deploying
- Ensure you're in the project directory
- Check that `supabase/functions/submit-vote/index.ts` exists
- Try `supabase functions list` to see all functions

## Alternative: Manual Edge Function Deployment

If CLI doesn't work, you can deploy via the Supabase Dashboard:
1. Go to **Edge Functions** in your Supabase Dashboard
2. Click **New Function**
3. Name it `submit-vote`
4. Copy the contents of `supabase/functions/submit-vote/index.ts`
5. Paste and deploy

## Next Steps After Deployment
- Cast a vote to test audit logging
- Verify IP addresses are captured
- Check that no one can modify audit logs (try UPDATE/DELETE - should fail)
