import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { CosmosClient } from '@azure/cosmos';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const MAX_SHORT_TEXT = 200;
const MAX_MEDIUM_TEXT = 500;
const MAX_LONG_TEXT = 4000;
const MAX_ACCOMPLISHMENTS = 10;

const toSafeString = (value, maxLen) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
};

const toStringArray = (value, maxLen, itemMaxLen) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim().slice(0, itemMaxLen) : ''))
    .filter(Boolean)
    .slice(0, maxLen);
};

// API Routes

/**
 * @typedef {Object} SavedProfile
 * @property {string} id
 * @property {string} name
 * @property {string} profession
 * @property {string} family
 * @property {string[]} accomplishments
 * @property {string} lifeStory
 * @property {string} pictureStory
 * @property {string} imageUrl
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SavedProfileList
 * @property {SavedProfile[]} items
 * @property {string|null} nextCursor
 */

// Cosmos DB setup
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_KEY = process.env.COSMOS_KEY;
const COSMOS_DB_NAME = process.env.COSMOS_DB_NAME || 'DogDiaries';
const COSMOS_CONTAINER = process.env.COSMOS_CONTAINER || 'profiles';

let cosmosContainer = null;
if (COSMOS_ENDPOINT && COSMOS_KEY) {
  try {
    const cosmosClient = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY });
    const database = cosmosClient.database(COSMOS_DB_NAME);
    cosmosContainer = database.container(COSMOS_CONTAINER);
    console.log('✅ Cosmos DB configured:', { COSMOS_DB_NAME, COSMOS_CONTAINER });
  } catch (e) {
    console.error('❌ Failed to configure Cosmos DB:', e);
  }
} else {
  console.warn('⚠️ Cosmos DB not configured. Set COSMOS_ENDPOINT and COSMOS_KEY.');
}

// GET /api/health - basic service healthcheck
app.get('/api/health', async (req, res) => {
  try {
    let cosmosConnected = false;
    if (cosmosContainer) {
      try {
        // Lightweight ping by reading zero items
        await cosmosContainer.items.query('SELECT TOP 1 c.id FROM c').fetchNext();
        cosmosConnected = true;
      } catch {
        cosmosConnected = false;
      }
    }
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      cosmos: { connected: cosmosConnected }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err?.message || 'unknown' });
  }
});

// GET /api/dog-image - Fetch random dog image from Dog CEO API
app.get('/api/dog-image', async (req, res) => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();

    console.log('Dog CEO API Response:', data);
    
    if (data.status === 'success') {
      res.json({ imageUrl: data.message });
    } else {
      throw new Error('Failed to fetch dog image');
    }
  } catch (error) {
    console.error('Error fetching dog image:', error);
    res.status(500).json({ error: 'Failed to fetch dog image' });
  }
});

// POST /api/generate-profile - Generate dog profile with Azure AI
app.post('/api/generate-profile', async (req, res) => {
  const { imageUrl } = req.body;
  
  // Mock profile as fallback - moved inside handler where imageUrl is available
  const mockProfile = {
    name: "Sir Barkington III",
    profession: "Professional Ball Chaser",
    family: "Born into a distinguished line of retrievers",
    accomplishments: [
      "Successfully caught own tail (2019)",
      "Three-time winner of 'Best Spot Stealer'",
      "Mastered the art of selective hearing"
    ],
    lifeStory: "From humble beginnings in a suburban backyard, Sir Barkington III rose to prominence through sheer determination and an unwavering commitment to belly rubs. His journey from playful pup to distinguished gentleman has inspired countless other canines to pursue their dreams of napping in sunbeams and guarding the house from suspicious squirrels.",
    pictureStory: "This photograph was taken on a crisp autumn morning, just moments after Sir Barkington discovered a particularly interesting smell. The photographer, his beloved human, had attempted to capture a dignified portrait, but Sir Barkington had other ideas. The resulting image perfectly encapsulates his philosophy: life is too short not to follow your nose, chase every ball, and greet every moment with unbridled enthusiasm.",
    imageUrl
  };
  
  try {
    // Call Azure OpenAI to generate dog profile
    console.log('🤖 Calling Azure OpenAI Vision to analyze dog photo...');
    
    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
    );
    
    const systemPrompt = `You are a creative writer specializing in humorous and slightly absurd dog backstories that will make a reader laugh. 
    Analyze the dog photo provided and generate a unique, funny, and heartwarming story that fits with the image.
    Consider the dog's appearance, breed characteristics, expression, setting, and any notable features.
    Return ONLY valid JSON with this exact structure:
    {
      "name": "A funny, distinguished dog name that fits their appearance",
      "profession": "A humorous job title based on their look and scenery",
      "family": "A brief, funny family background that matches their breed/appearance (one sentence)",
      "accomplishments": ["achievement 1", "achievement 2", "achievement 3"],
      "lifeStory": "A paragraph describing a dog's life story based on what you observe (2-3 sentences)",
      "pictureStory": "A detailed, absurd, humorous story about what just happened to the dog in the image. Include rumors and speculation. (3-4 sentences)"
    }`;
    
    const messages = [
      { 
        role: 'system', 
        content: systemPrompt 
      },
      { 
        role: 'user', 
        content: [
          {
            type: 'text',
            text: 'Analyze this dog photo and create a humorous, personalized profile based on what you see.'
          },
          {
            type: 'image_url',
             imageUrl: { url: imageUrl }
          }
        ]
      }
    ];
    
    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT,
      messages,
      {
        temperature: 0.9,
        maxTokens: 800  // Increased for more detailed responses
      }
    );
    
    console.log('✅ Azure OpenAI response received');
    console.log('📊 Token usage:', {
      prompt: response.usage?.promptTokens,
      completion: response.usage?.completionTokens,
      total: response.usage?.totalTokens
    });
    
    let generatedContent = response.choices[0].message.content;
    console.log('📝 Generated content:', generatedContent);
    
    // Remove markdown code blocks if present
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const profileData = JSON.parse(generatedContent);
    console.log('✅ Successfully parsed profile JSON');
    
    res.json({
      ...profileData,
      imageUrl
    });
    
  } catch (error) {
    console.error('❌ Error generating profile:', error);
    console.log('⚠️ Falling back to mock profile');
    res.json(mockProfile);  // Return mock profile instead of error
  }
});

// === Saved Profiles API ===

// GET /api/saved-profiles - list with pagination (most recent first)
app.get('/api/saved-profiles', async (req, res) => {
  try {
    if (!cosmosContainer) return res.status(500).json({ error: 'Storage not configured' });
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '20', 10), 1), 50);
    // Offset-based paging to ensure deterministic cursors
    const offset = typeof req.query.cursor === 'string' && req.query.cursor.length > 0
      ? Math.max(parseInt(req.query.cursor, 10) || 0, 0)
      : 0;
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit',
      parameters: [
        { name: '@offset', value: offset },
        { name: '@limit', value: pageSize },
      ],
    };
    const { resources } = await cosmosContainer.items.query(querySpec).fetchNext();
    const nextCursor = (Array.isArray(resources) && resources.length === pageSize)
      ? String(offset + pageSize)
      : null;
    res.json({ items: resources || [], nextCursor });
  } catch (error) {
    console.error('Error listing saved profiles:', error);
    res.status(500).json({ error: 'Failed to list saved profiles' });
  }
});

// POST /api/saved-profiles - save a profile
app.post('/api/saved-profiles', async (req, res) => {
  try {
    if (!cosmosContainer) return res.status(500).json({ error: 'Storage not configured' });
    const payload = req.body || {};
    const name = toSafeString(payload.name, MAX_SHORT_TEXT);
    const profession = toSafeString(payload.profession, MAX_SHORT_TEXT);
    const family = toSafeString(payload.family, MAX_MEDIUM_TEXT);
    const accomplishments = toStringArray(payload.accomplishments, MAX_ACCOMPLISHMENTS, MAX_SHORT_TEXT);
    const lifeStory = toSafeString(payload.lifeStory, MAX_LONG_TEXT);
    const pictureStory = toSafeString(payload.pictureStory, MAX_LONG_TEXT);
    const imageUrl = toSafeString(payload.imageUrl, MAX_MEDIUM_TEXT);

    // Basic validation
    if (!name || !profession || accomplishments.length < 1 || !lifeStory || !pictureStory || !imageUrl) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const createdAt = new Date().toISOString();
    const item = { id, name, profession, family, accomplishments, lifeStory, pictureStory, imageUrl, createdAt };
    const { resource } = await cosmosContainer.items.create(item);
    res.json(resource);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// DELETE /api/saved-profiles/:id - unsave a profile by id
app.delete('/api/saved-profiles/:id', async (req, res) => {
  try {
    if (!cosmosContainer) return res.status(500).json({ error: 'Storage not configured' });
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await cosmosContainer.item(id, id).delete();
    res.status(204).send();
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).json({ error: 'Not found' });
    }
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// GET /api/saved-profiles/exists - check by imageUrl + name
app.get('/api/saved-profiles/exists', async (req, res) => {
  try {
    if (!cosmosContainer) return res.status(500).json({ error: 'Storage not configured' });
    const imageUrl = toSafeString(req.query.imageUrl, MAX_MEDIUM_TEXT);
    const name = toSafeString(req.query.name, MAX_SHORT_TEXT);
    if (!imageUrl || !name) return res.status(400).json({ error: 'Missing imageUrl or name' });
    const querySpec = {
      query: 'SELECT c.id FROM c WHERE c.imageUrl = @imageUrl AND c.name = @name',
      parameters: [
        { name: '@imageUrl', value: imageUrl },
        { name: '@name', value: name },
      ],
    };
    const { resources } = await cosmosContainer.items.query(querySpec, { maxItemCount: 1 }).fetchNext();
    const exists = Array.isArray(resources) && resources.length > 0;
    res.json({ exists, id: exists ? resources[0].id : null });
  } catch (error) {
    console.error('Error checking existence:', error);
    res.status(500).json({ error: 'Failed to check existence' });
  }
});

// GET /api/saved-profiles/:id - fetch by id
app.get('/api/saved-profiles/:id', async (req, res) => {
  try {
    if (!cosmosContainer) return res.status(500).json({ error: 'Storage not configured' });
    const id = toSafeString(req.params.id, MAX_SHORT_TEXT);
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const { resource } = await cosmosContainer.item(id, id).read();
    if (!resource) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).json({ error: 'Not found' });
    }
    console.error('Error fetching saved profile:', error);
    res.status(500).json({ error: 'Failed to fetch saved profile' });
  }
});

// Serve static files from Vite build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server unless running in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🐕 Dog Diaries API server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
    }
  });
}

export default app;
