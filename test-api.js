// Simple test script to verify API endpoints work correctly
const testAPI = async () => {
  const baseURL = 'http://localhost:3001/api';
  
  console.log('🧪 Testing AI Course Creator API Endpoints...\n');
  
  try {
    // Test 1: Discover endpoint
    console.log('1️⃣ Testing /api/discover endpoint...');
    const discoverResponse = await fetch(`${baseURL}/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'sourdough baking for beginners' })
    });
    
    if (discoverResponse.ok) {
      const discoverData = await discoverResponse.json();
      console.log('✅ Discover endpoint working!');
      console.log(`   Found ${discoverData.opportunities?.length || 0} opportunities`);
      console.log(`   Sample: ${discoverData.opportunities?.[0] || 'None'}\n`);
      
      // Test 2: Outline endpoint
      console.log('2️⃣ Testing /api/outline endpoint...');
      const outlineResponse = await fetch(`${baseURL}/outline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          opportunityTitle: discoverData.opportunities?.[0] || 'Test Course',
          numChapters: 5 
        })
      });
      
      if (outlineResponse.ok) {
        const outlineData = await outlineResponse.json();
        console.log('✅ Outline endpoint working!');
        console.log(`   Course: ${outlineData.outline?.title || 'Unknown'}`);
        console.log(`   Chapters: ${outlineData.outline?.chapters?.length || 0}\n`);
        
        // Test 3: Generate endpoint
        console.log('3️⃣ Testing /api/generate endpoint...');
        if (outlineData.outline?.chapters?.[0]) {
          const generateResponse = await fetch(`${baseURL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseTitle: outlineData.outline.title,
              chapterTitle: outlineData.outline.chapters[0].title,
              learningObjectives: outlineData.outline.chapters[0].summary
            })
          });
          
          if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            console.log('✅ Generate endpoint working!');
            console.log(`   Generated content length: ${generateData.content?.length || 0} characters`);
            console.log(`   Content preview: ${generateData.content?.substring(0, 100) || 'None'}...\n`);
          } else {
            console.log('❌ Generate endpoint failed:', await generateResponse.text());
          }
        }
      } else {
        console.log('❌ Outline endpoint failed:', await outlineResponse.text());
      }
    } else {
      console.log('❌ Discover endpoint failed:', await discoverResponse.text());
    }
    
    console.log('🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

// Run the test
testAPI();