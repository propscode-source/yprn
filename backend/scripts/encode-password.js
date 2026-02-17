/**
 * Script untuk URL-encode password database
 *
 * Usage:
 *   node scripts/encode-password.js "My-Pass@123"
 *
 * Script ini akan menampilkan password yang sudah di-encode
 * untuk digunakan di connection string DATABASE_URL
 */

import process from 'process'
const password = process.argv[2]

if (!password) {
  console.log('❌ Usage: node scripts/encode-password.js "your-password"')
  console.log('\nContoh:')
  console.log('  node scripts/encode-password.js "My-Pass@123"')
  console.log('\nOutput:')
  console.log('  Original: My-Pass@123')
  console.log('  Encoded:  My%2DPass%40123')
  process.exit(1)
}

// URL-encode password
const encoded = encodeURIComponent(password)

console.log('\n📝 Password Encoding Result:\n')
console.log(`Original password: ${password}`)
console.log(`Encoded password:   ${encoded}\n`)

console.log('💡 Copy encoded password ke file backend/.env:')
console.log(`   DATABASE_URL=postgres://postgres.hmrtdkejvoeeadtxkikx:${encoded}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres\n`)

// Show character mapping
const specialChars = []
for (let i = 0; i < password.length; i++) {
  const char = password[i]
  const encodedChar = encodeURIComponent(char)
  if (char !== encodedChar) {
    specialChars.push(`${char} → ${encodedChar}`)
  }
}

if (specialChars.length > 0) {
  console.log('🔍 Character mapping:')
  specialChars.forEach(mapping => console.log(`   ${mapping}`))
  console.log()
}
