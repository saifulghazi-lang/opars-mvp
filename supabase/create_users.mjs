/**
 * OPARS User Creation Script
 * 
 * Run this script to create all UKMShape committee users in Supabase.
 * 
 * Usage:
 * 1. Get your service_role key from Supabase Dashboard > Settings > API
 * 2. Run: node create_users.mjs YOUR_SERVICE_ROLE_KEY YOUR_PASSWORD
 * 
 * Example:
 *   node create_users.mjs eyJhbGciOiJIUzI1NiIs... MySecurePassword123!
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qsdozpztsuxssgzbyyhc.supabase.co';

// UKMShape Committee Members
const USERS = [
  {
    email: 'directorshape@ukm.edu.my',
    name: 'Pengarah UKMShape',
    role: 'admin',
    position: 'Pengarah',
    department: 'Pengurusan',
    phone: '03-8927-2102'
  },
  {
    email: 'tp1ukmshape@ukm.edu.my',
    name: 'Dr. Kamarul Baraini binti Keliwon',
    role: 'member',
    position: 'Timbalan Pengarah I',
    department: 'Akademik',
    phone: '03-8927-2101'
  },
  {
    email: 'tp2ukmshape@ukm.edu.my',
    name: 'Prof. Madya Dr. Azahan bin Awang',
    role: 'member',
    position: 'Timbalan Pengarah II',
    department: 'Hal Ehwal Pelajar',
    phone: '03-8927-2103'
  },
  {
    email: 'tp3ukmshape@ukm.edu.my',
    name: 'Dr. Rozilawati binti Ahmad',
    role: 'member',
    position: 'Timbalan Pengarah III',
    department: 'Pemasaran',
    phone: '03-8927-2104'
  },
  {
    email: 'tp4ukmshape@ukm.edu.my',
    name: 'Dr. Ng Lay Shi',
    role: 'member',
    position: 'Timbalan Pengarah IV',
    department: 'Pentadbiran',
    phone: '03-8927-2105'
  },
  {
    email: 'rrozita@ukm.edu.my',
    name: 'Rozita binti Rani',
    role: 'admin',
    position: 'Ketua Pentadbiran',
    department: 'Pentadbiran',
    phone: '03-8927-2130'
  }
];

async function createUsers(serviceRoleKey, password) {
  const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🚀 Creating OPARS users...\n');

  for (const user of USERS) {
    console.log(`Creating ${user.position} (${user.email})...`);

    // Create user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        name: user.name,
        position: user.position
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`  ⚠️  User already exists, skipping...`);
      } else {
        console.log(`  ❌ Error: ${authError.message}`);
      }
      continue;
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        position: user.position,
        department: user.department,
        phone: user.phone
      });

    if (profileError) {
      console.log(`  ⚠️  Profile error: ${profileError.message}`);
    } else {
      console.log(`  ✅ Created successfully!`);
    }
  }

  console.log('\n✨ Done! All users created.');
  console.log(`\n📋 Login credentials:`);
  console.log(`   Password: (the one you provided)`);
  console.log(`   Emails: See list above`);
}

// Main
const serviceRoleKey = process.argv[2];
const password = process.argv[3];

if (!serviceRoleKey || !password) {
  console.log('❌ Missing arguments!\n');
  console.log('Usage: node create_users.mjs SERVICE_ROLE_KEY PASSWORD');
  console.log('\nExample:');
  console.log('  node create_users.mjs eyJhbGci... MySecurePassword123!\n');
  console.log('Get your service_role key from:');
  console.log('Supabase Dashboard > Settings > API > service_role (secret)');
  process.exit(1);
}

createUsers(serviceRoleKey, password);
