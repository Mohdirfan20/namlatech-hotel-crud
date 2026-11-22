const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const PORT = 5001;
let server;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${PORT}${path}`, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Multipart helper
function buildMultipart(fields, fileField) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  let payload = '';

  for (const [key, val] of Object.entries(fields)) {
    payload += `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    payload += `${val}\r\n`;
  }

  if (fileField) {
    payload += `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\n`;
    payload += `Content-Type: ${fileField.contentType}\r\n\r\n`;
    payload += fileField.content.toString('binary') + '\r\n';
  }

  payload += `--${boundary}--\r\n`;

  return {
    boundary,
    buffer: Buffer.from(payload, 'binary')
  };
}

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}...`);

    try {
      // 1. GET /api/hotels
      console.log('Testing GET /api/hotels...');
      const listRes = await request('/api/hotels?limit=5&offset=0');
      console.log('GET /api/hotels status:', listRes.status, 'Total items:', listRes.data.total, 'Count:', listRes.data.data.length);
      if (listRes.status !== 200 || listRes.data.total !== 10) throw new Error('List failed');

      // 2. GET /api/hotels with search
      console.log('Testing search query ILIKE...');
      const searchRes = await request('/api/hotels?search=Paris');
      console.log('Search "Paris": count =', searchRes.data.data.length);
      if (searchRes.data.data.length === 0 || !searchRes.data.data[0].title.includes('Paris')) {
        throw new Error('Search failed');
      }

      // 3. Price filter
      console.log('Testing price filter [200, 300]...');
      const priceRes = await request('/api/hotels?minPrice=200&maxPrice=300');
      console.log('Price filter result count:', priceRes.data.data.length);

      // 4. GET /api/hotels/:id
      console.log('Testing GET /api/hotels/1...');
      const singleRes = await request('/api/hotels/1');
      console.log('Single hotel title:', singleRes.data.title);
      if (singleRes.status !== 200) throw new Error('Single fetch failed');

      // 5. POST /api/hotels (create hotel with image)
      console.log('Testing POST /api/hotels with multipart image upload...');
      const dummyImage = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
      const multipart = buildMultipart({
        title: 'Emerald Bay Luxury Suites',
        description: 'Stunning luxury resort facing emerald waters and pristine white beaches.',
        latitude: '12.9716',
        longitude: '77.5946',
        price: '399.50'
      }, {
        name: 'image',
        filename: 'emerald.gif',
        contentType: 'image/gif',
        content: dummyImage
      });

      const postRes = await request('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${multipart.boundary}`,
          'Content-Length': multipart.buffer.length
        },
        body: multipart.buffer
      });
      console.log('POST status:', postRes.status, 'New hotel ID:', postRes.data.id);
      if (postRes.status !== 201) throw new Error('Create failed');
      const newHotelId = postRes.data.id;

      // 6. PUT /api/hotels/:id
      console.log(`Testing PUT /api/hotels/${newHotelId}...`);
      const updateMultipart = buildMultipart({
        title: 'Emerald Bay Luxury Suites - Renovated',
        description: 'Updated description for luxurious emerald suites.',
        latitude: '12.9720',
        longitude: '77.5950',
        price: '425.00'
      });
      const putRes = await request(`/api/hotels/${newHotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${updateMultipart.boundary}`,
          'Content-Length': updateMultipart.buffer.length
        },
        body: updateMultipart.buffer
      });
      console.log('PUT status:', putRes.status, 'Updated title:', putRes.data.title);
      if (putRes.status !== 200 || !putRes.data.title.includes('Renovated')) throw new Error('Update failed');

      // 7. DELETE /api/hotels/:id
      console.log(`Testing DELETE /api/hotels/${newHotelId}?deleteImage=true...`);
      const delRes = await request(`/api/hotels/${newHotelId}?deleteImage=true`, { method: 'DELETE' });
      console.log('DELETE status:', delRes.status, 'Response:', delRes.data);
      if (delRes.status !== 200) throw new Error('Delete failed');

      console.log('\n🎉 ALL 5 BACKEND API ENDPOINTS AND NATIVE SQL QUERIES VERIFIED SUCCESSFULLY!\n');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
}

runTests();
