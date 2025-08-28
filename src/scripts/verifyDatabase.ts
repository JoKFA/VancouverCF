import { supabase } from '../lib/supabase'

/**
 * Database verification script
 * Checks if all required tables and columns exist for the recap system
 */

async function verifyDatabase() {
  console.log('🔍 Verifying database setup for event recap system...\n')
  
  try {
    // Check if event_recaps table exists by trying to query it
    console.log('1. Checking event_recaps table...')
    const { error: recapError } = await supabase
      .from('event_recaps')
      .select('*')
      .limit(1)

    if (recapError) {
      console.error('❌ event_recaps table does not exist or has issues:')
      console.error('   Error:', recapError.message)
      console.log('   📝 You need to run the SQL commands in database/create_recap_tables.sql')
      return false
    }

    console.log('✅ event_recaps table exists')

    // Check if events table exists (should already exist)
    console.log('2. Checking events table...')
    const { error: eventError } = await supabase
      .from('events')
      .select('*')
      .limit(1)

    if (eventError) {
      console.error('❌ events table has issues:', eventError.message)
      return false
    }

    console.log('✅ events table exists')

    // Test inserting a sample recap (and immediately delete it)
    console.log('3. Testing recap insertion and deletion...')
    
    // Get first event to use as test
    const { data: testEvent } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .single()

    if (!testEvent) {
      console.log('⚠️  No events found in database. Create an event first to fully test the system.')
    } else {
      // Try to insert a test recap
      const testRecap = {
        event_id: testEvent.id,
        title: 'Test Recap',
        summary: 'Test summary',
        content_blocks: [
          {
            id: 'test-1',
            type: 'text',
            order: 0,
            content: { text: 'Test content' }
          }
        ],
        seo_meta: {
          description: 'Test description',
          keywords: ['test']
        },
        published: false
      }

      const { data: insertedRecap, error: insertError } = await supabase
        .from('event_recaps')
        .insert([testRecap])
        .select()
        .single()

      if (insertError) {
        console.error('❌ Failed to insert test recap:', insertError.message)
        return false
      }

      console.log('✅ Successfully inserted test recap')

      // Delete the test recap
      const { error: deleteError } = await supabase
        .from('event_recaps')
        .delete()
        .eq('id', insertedRecap.id)

      if (deleteError) {
        console.error('❌ Failed to delete test recap:', deleteError.message)
        console.log('   (The test recap was created successfully, you may want to clean it up manually)')
      } else {
        console.log('✅ Successfully deleted test recap')
      }
    }

    // Check existing events for migration readiness
    console.log('4. Checking events for migration...')
    const { data: allEvents } = await supabase
      .from('events')
      .select('id, title, status, recap_file_url')

    if (allEvents && allEvents.length > 0) {
      console.log(`📊 Found ${allEvents.length} events in database:`)
      
      const eventsWithFiles = allEvents.filter(e => e.recap_file_url)
      const pastEvents = allEvents.filter(e => e.status === 'past')
      
      console.log(`   - ${pastEvents.length} past events`)
      console.log(`   - ${eventsWithFiles.length} events with recap files`)
      console.log(`   - ${allEvents.length - eventsWithFiles.length} events without recap files`)

      if (eventsWithFiles.length > 0) {
        console.log('   📄 Events with recap files ready for migration:')
        eventsWithFiles.forEach((event, index) => {
          console.log(`     ${index + 1}. ${event.title}`)
        })
      }
    } else {
      console.log('📝 No events found in database')
    }

    // Check existing recaps
    console.log('5. Checking existing structured recaps...')
    const { data: existingRecaps } = await supabase
      .from('event_recaps')
      .select('*')

    if (existingRecaps && existingRecaps.length > 0) {
      console.log(`📄 Found ${existingRecaps.length} existing structured recaps:`)
      existingRecaps.forEach((recap, index) => {
        console.log(`   ${index + 1}. ${recap.title} (${recap.published ? 'Published' : 'Draft'})`)
      })
    } else {
      console.log('📝 No structured recaps found (this is normal for first-time setup)')
    }

    console.log('\n🎉 Database verification completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to the admin panel (/admin)')
    console.log('2. Navigate to the "Event Recaps" tab')
    console.log('3. Click "Run Migration" to migrate existing events')
    console.log('4. Create sample recaps to test the new system')

    return true

  } catch (error) {
    console.error('💥 Database verification failed:', error)
    return false
  }
}

// Run verification
verifyDatabase().then((success) => {
  if (success) {
    console.log('\n✨ All checks passed! Your database is ready for the new recap system.')
  } else {
    console.log('\n❌ Database setup incomplete. Please check the errors above.')
  }
}).catch((error) => {
  console.error('Verification script failed:', error)
})