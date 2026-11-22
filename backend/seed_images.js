const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const images = [
  {
    name: 'hotel-1.jpg',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-2.jpg',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-3.jpg',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-4.jpg',
    url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-5.jpg',
    url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-6.jpg',
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-7.jpg',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-8.jpg',
    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-9.jpg',
    url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'hotel-10.jpg',
    url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80'
  }
];

async function downloadImages() {
  console.log('Downloading 10 seed hotel images into uploads directory...');
  for (const item of images) {
    const dest = path.join(uploadsDir, item.name);
    if (!fs.existsSync(dest)) {
      try {
        const res = await fetch(item.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`✓ Downloaded ${item.name}`);
      } catch (err) {
        console.error(`Failed to download ${item.name}:`, err.message);
      }
    } else {
      console.log(`- ${item.name} already exists`);
    }
  }
  console.log('Done downloading seed images.');
}

downloadImages();
