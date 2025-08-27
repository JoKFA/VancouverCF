import { EventMigrationService } from '../lib/migration'
import { supabase } from '../lib/supabase'

// TypeScript declaration for process in browser environment
declare const process: any

async function main() {
  console.log('🚀 Starting event migration to structured recap system...')
  
  const migrationService = new EventMigrationService()
  
  try {
    // First, let's see what events exist
    console.log('📋 Fetching existing events...')
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }
    
    if (!events || events.length === 0) {
      console.log('ℹ️  No events found to migrate.')
      return
    }
    
    console.log(`Found ${events.length} events:`)
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`)
      console.log(`   📅 Date: ${new Date(event.date).toLocaleDateString()}`)
      console.log(`   📍 Location: ${event.location}`)
      console.log(`   📊 Status: ${event.status}`)
      console.log(`   📄 Has recap file: ${event.recap_file_url ? 'Yes' : 'No'}`)
    })
    
    // Run migration
    console.log('🔄 Starting migration process...')
    const results = await migrationService.migrateAllEvents()
    
    // Report results
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    
    console.log('📊 Migration Results:')
    console.log(`✅ Successfully migrated: ${successful.length} events`)
    console.log(`❌ Failed migrations: ${failed.length} events`)
    
    if (successful.length > 0) {
      console.log('✅ Successful migrations:')
      successful.forEach((result, index) => {
        console.log(`${index + 1}. Event ID: ${result.eventId}`)
        console.log(`   Recap ID: ${result.recapId}`)
      })
    }
    
    if (failed.length > 0) {
      console.log('❌ Failed migrations:')
      failed.forEach((result, index) => {
        console.log(`${index + 1}. Event ID: ${result.eventId}`)
        console.log(`   Error: ${result.error}`)
      })
    }
    
    // Create sample recaps for demonstration
    console.log('📝 Creating sample structured recaps for demonstration...')
    
    const pastEvents = events.filter(event => event.status === 'past')
    if (pastEvents.length > 0) {
      const sampleEvent = pastEvents[0]
      try {
        const sampleResult = await migrationService.createSampleRecap(sampleEvent.id)
        console.log(`✅ Created sample recap for "${sampleEvent.title}"`)
        console.log(`   Sample Recap ID: ${sampleResult.recapId}`)
      } catch (error) {
        console.log(`❌ Failed to create sample recap: ${error}`)
      }
    }
    
    console.log('🎉 Migration completed!')
    console.log('📋 Next Steps:')
    console.log('1. Check the migrated events in your admin interface')
    console.log('2. Review and customize the generated content blocks')
    console.log('3. Add real statistics, images, and testimonials')
    console.log('4. Update event descriptions if needed')
    console.log('5. Test the new recap display on the events page')
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  }
}

// Handle different environments
if (typeof window === 'undefined') {
  // Node.js environment
  main().then(() => {
    console.log('✨ Migration script completed successfully!')
  }).catch((error) => {
    console.error('Migration script failed:', error)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  })
} else {
  // Browser environment
  console.log('🌐 Migration script ready to run in browser environment')
  // Export the main function for browser use
  ;(window as any).runEventMigration = main
  console.log('Run window.runEventMigration() to start migration')
}