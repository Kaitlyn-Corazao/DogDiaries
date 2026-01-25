import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('@azure/cosmos', () => {
  const store = [];
  return {
    CosmosClient: class {
      database() {
        return {
          container() {
            return {
              items: {
                async create(item) {
                  store.push(item);
                  return { resource: item };
                },
                query(querySpec) {
                  const offsetParam = querySpec?.parameters?.find((p) => p.name === '@offset')?.value ?? 0;
                  const limitParam = querySpec?.parameters?.find((p) => p.name === '@limit')?.value ?? store.length;
                  const items = [...store].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
                  const slice = items.slice(offsetParam, offsetParam + limitParam);
                  return {
                    async fetchNext() {
                      return { resources: slice };
                    }
                  };
                },
              },
              item(id) {
                return {
                  async delete() {
                    const idx = store.findIndex((entry) => entry.id === id);
                    if (idx >= 0) store.splice(idx, 1);
                  },
                };
              },
            };
          },
        };
      }
    },
  };
});

import app from '../../server/index.js';

const makeSample = (suffix) => ({
  name: `Paging Dog ${suffix}`,
  profession: 'Scroller',
  family: '',
  accomplishments: ['A', 'B'],
  lifeStory: 'Story',
  pictureStory: 'Pic',
  imageUrl: `https://example.com/paging-${suffix}.jpg`,
});

describe('Saved Profiles paging', () => {
  it('returns continuation token with pageSize=1 and fetches next page', async () => {
    const createdIds = [];
    try {
      // Create two items
      const res1 = await request(app)
        .post('/api/saved-profiles')
        .send(makeSample(`X-${Date.now()}`))
        .set('Content-Type', 'application/json');
      const res2 = await request(app)
        .post('/api/saved-profiles')
        .send(makeSample(`Y-${Date.now()}`))
        .set('Content-Type', 'application/json');
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);

      if (res1.body?.id) createdIds.push(res1.body.id);
      if (res2.body?.id) createdIds.push(res2.body.id);

      // List first page
      const list1 = await request(app).get('/api/saved-profiles?pageSize=1');
      expect(list1.status).toBe(200);
      expect(Array.isArray(list1.body.items)).toBe(true);
      expect(list1.body.items.length).toBe(1);
      expect(list1.body.nextCursor).toBeTypeOf('string');

      const cursor = list1.body.nextCursor;

      // List second page with cursor
      const list2 = await request(app).get(
        `/api/saved-profiles?pageSize=1&cursor=${encodeURIComponent(cursor)}`
      );
      expect(list2.status).toBe(200);
      expect(list2.body.items.length).toBe(1);
    } finally {
      // Cleanup only the items created by this test
      await Promise.all(
        createdIds.map((id) => request(app).delete(`/api/saved-profiles/${id}`))
      );
    }
  });
});
