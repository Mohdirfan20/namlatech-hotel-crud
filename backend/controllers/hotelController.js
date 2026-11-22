const { query } = require('../db');
const { deleteFile } = require('../middleware/upload');

/**
 * Controller: Get all hotels with search, price range filter, and pagination
 * Query params: search, minPrice, maxPrice, limit, offset
 */
const getHotels = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Search by title (case-insensitive ILIKE match)
    if (search && search.trim() !== '') {
      conditions.push(`title ILIKE $${paramIndex}`);
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Filter by minPrice
    if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
      conditions.push(`price >= $${paramIndex}`);
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    // Filter by maxPrice
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
      conditions.push(`price <= $${paramIndex}`);
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query for pagination
    const countSql = `SELECT COUNT(*) AS total FROM hotels ${whereClause};`;
    const countResult = await query(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Data query with LIMIT and OFFSET
    const dataValues = [...values, limit, offset];
    const dataSql = `
      SELECT id, title, description, image_path, latitude, longitude, price, created_at, updated_at
      FROM hotels
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    const dataResult = await query(dataSql, dataValues);

    res.json({
      data: dataResult.rows,
      total,
      limit,
      offset
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get single hotel by ID
 */
const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM hotels WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Create new hotel with image upload
 * Accepts multipart/form-data: image, title, description, latitude, longitude, price
 */
const createHotel = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    const errors = [];

    if (!title || title.trim() === '') errors.push('Title is required');
    if (!description || description.trim() === '') errors.push('Description is required');

    const parsedLat = parseFloat(latitude);
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }

    const parsedLng = parseFloat(longitude);
    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      errors.push('Longitude must be a valid number between -180 and 180');
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.push('Price must be a valid number greater than 0');
    }

    if (!req.file) {
      errors.push('Hotel image is required');
    }

    if (errors.length > 0) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Relative path stored in database (e.g. /uploads/hotel-123.jpg)
    const image_path = `/uploads/${req.file.filename}`;

    const insertSql = `
      INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const insertValues = [
      title.trim(),
      description.trim(),
      image_path,
      parsedLat,
      parsedLng,
      parsedPrice
    ];

    const result = await query(insertSql, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(err);
  }
};

/**
 * Controller: Update hotel by ID
 * Accepts multipart/form-data. Image is optional on update.
 */
const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    // Check if hotel exists
    const checkResult = await query('SELECT * FROM hotels WHERE id = $1;', [id]);
    if (checkResult.rows.length === 0) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const existingHotel = checkResult.rows[0];
    const errors = [];

    if (!title || title.trim() === '') errors.push('Title is required');
    if (!description || description.trim() === '') errors.push('Description is required');

    const parsedLat = parseFloat(latitude);
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }

    const parsedLng = parseFloat(longitude);
    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      errors.push('Longitude must be a valid number between -180 and 180');
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.push('Price must be a valid number greater than 0');
    }

    if (errors.length > 0) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    let finalImagePath = existingHotel.image_path;

    // If new image was uploaded, delete old image file and update path
    if (req.file) {
      finalImagePath = `/uploads/${req.file.filename}`;
      // Delete old file if it wasn't one of the static fallback presets or delete safely
      deleteFile(existingHotel.image_path);
    }

    const updateSql = `
      UPDATE hotels
      SET title = $1,
          description = $2,
          image_path = $3,
          latitude = $4,
          longitude = $5,
          price = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;
    const updateValues = [
      title.trim(),
      description.trim(),
      finalImagePath,
      parsedLat,
      parsedLng,
      parsedPrice,
      id
    ];

    const result = await query(updateSql, updateValues);
    res.json(result.rows[0]);
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    next(err);
  }
};

/**
 * Controller: Delete hotel by ID
 * Query param: deleteImage (default: true)
 */
const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shouldDeleteImage = req.query.deleteImage !== 'false';

    // Check existing
    const checkResult = await query('SELECT * FROM hotels WHERE id = $1;', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotel = checkResult.rows[0];

    // Delete database record using native parameterized query
    await query('DELETE FROM hotels WHERE id = $1;', [id]);

    // Delete image from disk if requested
    if (shouldDeleteImage && hotel.image_path) {
      deleteFile(hotel.image_path);
    }

    res.json({
      message: 'Hotel deleted successfully',
      id: parseInt(id, 10)
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};
