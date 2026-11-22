const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { upload } = require('../middleware/upload');

// Routes
// 1. GET /api/hotels - List with search, price range filter, offset & limit
router.get('/', hotelController.getHotels);

// 2. GET /api/hotels/:id - Get hotel details by ID
router.get('/:id', hotelController.getHotelById);

// 3. POST /api/hotels - Create hotel with image upload
router.post('/', upload.single('image'), hotelController.createHotel);

// 4. PUT /api/hotels/:id - Update hotel with optional image upload
router.put('/:id', upload.single('image'), hotelController.updateHotel);

// 5. DELETE /api/hotels/:id - Delete hotel and optional image cleanup
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
