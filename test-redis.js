// Simple Redis test (JavaScript - no TypeScript)
import { Redis } from '@upstash/redis';
import 'dotenv/config';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function test() {
  console.log('🧪 Testing Redis connection...\n');
  
  try {
    // Set a value
    console.log('1️⃣ Setting test key...');
    await redis.set('test-key', 'Hello from Upstash!');
    console.log('   ✅ Key set successfully\n');
    
    // Get it back
    console.log('2️⃣ Getting test key...');
    const value = await redis.get('test-key');
    console.log('   ✅ Retrieved:', value, '\n');
    
    // Delete it
    console.log('3️⃣ Deleting test key...');
    await redis.del('test-key');
    console.log('   ✅ Key deleted\n');
    
    console.log('🎉 Redis connection test PASSED!\n');
  } catch (error) {
    console.error('❌ Redis test FAILED:', error.message);
    console.error('\n💡 Make sure you have:');
    console.error('   1. Created Upstash Redis database');
    console.error('   2. Added UPSTASH_REDIS_REST_URL to .env.local');
    console.error('   3. Added UPSTASH_REDIS_REST_TOKEN to .env.local');
  }
}

test();
