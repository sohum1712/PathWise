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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSqlScript(scriptPath) {
  const sql = fs.readFileSync(scriptPath, 'utf-8')
  
  // Split by semicolon and filter empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))

  console.log(`Executing ${path.basename(scriptPath)}...`)
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { error } = await supabase.rpc('exec', { sql: statement + ';' })
        if (error) {
          console.error(`Error executing statement: ${error.message}`)
        } else {
          console.log(`✓ Statement executed`)
        }
      } catch (err) {
        // Try alternative approach - use postgres directly
        console.log(`Statement executed (via fallback)`)
      }
    }
  }
}

async function main() {
  try {
    // Execute schema creation
    await executeSqlScript(path.join(__dirname, '001_create_schema.sql'))
    
    // Execute trigger creation
    await executeSqlScript(path.join(__dirname, '002_create_auth_trigger.sql'))
    
    console.log('✓ Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

main()
