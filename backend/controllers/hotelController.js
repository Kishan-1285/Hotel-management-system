const pool = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

const getHotels = async (req, res) => {
    try {
        const { search = "", minPrice, maxPrice, page = 1, limit = 6 } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(Math.max(parseInt(limit) || 6, 1), 50);
        const offset = (pageNumber - 1) * limitNumber;

        const conditions = [];
        const values = [];

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        const min = minPrice === "" || minPrice === undefined
            ? null : Number(minPrice);

        const max = maxPrice === "" || maxPrice === undefined
            ? null : Number(maxPrice);

        if (min !== null && (!Number.isFinite(min) || min < 0)) {
            return res.status(400).json({ message: "Invalid minimum price" });
        }

        if (max !== null && (!Number.isFinite(max) || max < 0)) {
            return res.status(400).json({ message: "Invalid maximum price" });
        }

        if (min !== null && max !== null && min > max) {
            return res.status(400).json({
                message: "Minimum price cannot exceed maximum price"
            });
        }

        if (min !== null) {
            values.push(min);
            conditions.push(`price >= $${values.length}`);
        }

        if (max !== null) {
            values.push(max);
            conditions.push(`price <= $${values.length}`);
        }

        const where = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const count = await pool.query(
            `SELECT COUNT(*) FROM hotels ${where}`,
            values
        );

        const result = await pool.query(
            `SELECT * FROM hotels
             ${where}
             ORDER BY created_at DESC
             LIMIT $${values.length + 1}
             OFFSET $${values.length + 2}`,
            [...values, limitNumber, offset]
        );

        res.status(200).json({
            hotels: result.rows,
            pagination: {
                total: Number(count.rows[0].count),
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(Number(count.rows[0].count) / limitNumber)
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to fetch hotels" });
    }
};


const getHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    res.status(200).json({
      hotel: result.rows[0]
    });

  } catch (error) {
    console.error("Get hotel error:", error.message);

    res.status(500).json({
      message: "Failed to fetch hotel"
    });
  }
};

const createHotel = async (req, res) => {
    try {

        const { title, description, latitude, longitude, price } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a hotel image"
            });
        }

        if (!title || !price || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const hotelPrice = Number(price);
        const hotelLatitude = Number(latitude);
        const hotelLongitude = Number(longitude);

        if (
            !Number.isFinite(hotelPrice) ||
            hotelPrice <= 0 ||
            !Number.isFinite(hotelLatitude) ||
            hotelLatitude < -90 ||
            hotelLatitude > 90 ||
            !Number.isFinite(hotelLongitude) ||
            hotelLongitude < -180 ||
            hotelLongitude > 180
        ) {
            return res.status(400).json({
                message: "Please enter valid price and coordinates"
            });
        }

        const imagePath = "/uploads/" + req.file.filename;

        const result = await pool.query(
            `INSERT INTO hotels
       (image, title, description, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                imagePath,
                title.trim(),
                description || "",
                hotelLatitude,
                hotelLongitude,
                hotelPrice
            ]
        );

        res.status(201).json({
            message: "Hotel added successfully",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Create hotel error:", error.message);

        res.status(500).json({
            message: "Failed to add hotel"
        });
    }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    const existingHotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (existingHotel.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    if (
      !title?.trim() ||
      price === undefined || price === "" ||
      latitude === undefined || latitude === "" ||
      longitude === undefined || longitude === ""
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const hotelPrice = Number(price);
    const hotelLatitude = Number(latitude);
    const hotelLongitude = Number(longitude);

    if (
      !Number.isFinite(hotelPrice) || hotelPrice <= 0 ||
      !Number.isFinite(hotelLatitude) ||
      hotelLatitude < -90 || hotelLatitude > 90 ||
      !Number.isFinite(hotelLongitude) ||
      hotelLongitude < -180 || hotelLongitude > 180
    ) {
      return res.status(400).json({
        message: "Please enter valid price and coordinates"
      });
    }
    const imagePath = req.file
      ? "/uploads/" + req.file.filename
      : existingHotel.rows[0].image;

    const result = await pool.query(
      `UPDATE hotels
       SET image = $1,
           title = $2,
           description = $3,
           latitude = $4,
           longitude = $5,
           price = $6
       WHERE id = $7
       RETURNING *`,
      [
        imagePath,
        title.trim(),
        description || "",
        hotelLatitude,
        hotelLongitude,
        hotelPrice,
        id
      ]
    );

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: result.rows[0]
    });

  } catch (error) {
    console.error("Update hotel error:", error.message);
    res.status(500).json({
      message: "Failed to update hotel"
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    const hotel = result.rows[0];

    await pool.query(
      "DELETE FROM hotels WHERE id = $1",
      [id]
    );

    if (hotel.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(hotel.image)
      );

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Image deletion error:", error.message);
        }
      }
    }

    res.status(200).json({
      message: "Hotel deleted successfully"
    });

  } catch (error) {
    console.error("Delete hotel error:", error.message);

    res.status(500).json({
      message: "Failed to delete hotel"
    });
  }
};


module.exports = {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel
};

