import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSql(sql) {
  const { data, error } = await supabase.rpc('exec', { sql })
  
  if (error) {
    console.error('SQL Error:', error)
    throw error
  }
  
  return data
}

async function setupDatabase() {
  try {
    console.log('Setting up Student Engagement Ecosystem database...\n')
    
    // Read schema file
    const schemaPath = path.join(__dirname, '001_create_schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    
    console.log('Executing schema creation...')
    await executeSql(schema)
    console.log('✓ Schema created successfully\n')
    
    // Read trigger file
    const triggerPath = path.join(__dirname, '002_create_auth_trigger.sql')
    const trigger = fs.readFileSync(triggerPath, 'utf-8')
    
    console.log('Executing auth trigger creation...')
    await executeSql(trigger)
    console.log('✓ Auth trigger created successfully\n')
    
    console.log('✓ Database setup completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('Setup failed:', error.message)
    process.exit(1)
  }
}

setupDatabase()
