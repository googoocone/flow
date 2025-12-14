const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Load env validation
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const apiKeyMatch = envContent.match(/GOOGLE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error('API Key not found in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, are you there?');
        console.log(`✅ Success with ${modelName}`);
        return true;
    } catch (error) {
        console.error(`❌ Error with ${modelName}:`, error.message);
        if (error.message.includes('404')) {
            console.log('   -> Model not found or not accessible with this API key.');
        }
        return false;
    }
}

async function run() {
    // Test the requested model
    await testModel('gemini-3-pro');

    // Test potential variants
    await testModel('models/gemini-3-pro');

    // Test known stable models for comparison
    await testModel('gemini-2.5-pro');
    await testModel('gemini-2.0-flash');
    await testModel('gemini-1.5-pro');
}

run();
