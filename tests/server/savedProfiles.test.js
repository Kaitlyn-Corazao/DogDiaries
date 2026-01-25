import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/index.js';

// Ensure test mode so server doesn't listen
process.env.NODE_ENV = 'test';

const sample = {
  name: 'Sir Barkington III',
  profession: 'Professional Ball Chaser',
  family: 'Line of distinguished retrievers',
  accomplishments: ['Caught tail once', 'Never missed a meal'],
  lifeStory: 'Loves naps and sunbeams.',
  pictureStory: 'Just discovered a new smell.',
  imageUrl: 'https://example.com/dog.jpg',
};

let createdId = null;

describe('Saved Profiles API', () => {
  it('healthcheck returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('creates a saved profile', async () => {
    const res = await request(app)
      .post('/api/saved-profiles')
      .set('Content-Type', 'application/json')
      .send(sample);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('lists saved profiles', async () => {
    const res = await request(app).get('/api/saved-profiles?pageSize=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('checks existence of a saved profile', async () => {
    const res = await request(app)
      .get(`/api/saved-profiles/exists?imageUrl=${encodeURIComponent(sample.imageUrl)}&name=${encodeURIComponent(sample.name)}`);
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
    expect(res.body).toHaveProperty('id');
  });

  it('deletes a saved profile by id', async () => {
    const res = await request(app).delete(`/api/saved-profiles/${createdId}`);
    expect(res.status).toBe(204);
  });
});
