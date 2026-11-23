import { useState } from "react";
import API from "../services/HotelApi";
import "../styles/hotelForm.css";
import { useDispatch } from "react-redux";
import { fetchHotels } from "../features/hotels/hotelSlice";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HotelForm({ hotel }) {

    const [title, setTitle] = useState(hotel ? hotel.title : "");
    const [descrip, setDescrip] = useState(hotel ? hotel.description : "");
    const [lat, setLat] = useState(hotel ? hotel.latitude : "");
    const [lon, setLon] = useState(hotel ? hotel.longitude : "");
    const [price, setPrice] = useState(hotel ? hotel.price : "");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(
        hotel && hotel.image
            ? `http://localhost:4000${hotel.image}`
            : ""
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeImage = () => {
        setImage(null);
        setPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", descrip);
        formData.append("latitude", lat);
        formData.append("longitude", lon);
        formData.append("price", price);
        formData.append("image", image);

        try {
            if (hotel) {
                await API.put(`/${hotel.id}`, formData);
                alert("Hotel updated successfully!");
            } else {
                await API.post("/", formData);
                alert("Hotel added successfully!");
            }
            dispatch(fetchHotels({ page: 1, limit: 6 }));
            navigate("/");

        } catch (error) {
            console.log(error);
            alert("Failed to add hotel");
        }
        setTitle("");
        setImage("");
        setDescrip("");
        setLat("");
        setLon("");
        setPrice("");
        setPreview("");
    };


    return (
        <>
            <Helmet>
                <title>{hotel ? "Edit Hotel" : "Add Hotel"} | StayFinder</title>

                <meta
                    name="description"
                    content={hotel ? "Edit hotel details." : "Add a new hotel to StayFinder."}
                />
            </Helmet>
            <form className="hotel-form-container" onSubmit={handleSubmit}>
                <h2>{hotel ? "Edit Hotel" : "Add Hotel"}</h2>

                <label>Hotel Title</label>
                <input
                    type="text"
                    required
                    minLength={4}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Description</label>
                <textarea
                    required
                    minLength={10}
                    value={descrip}
                    onChange={(e) => setDescrip(e.target.value)}
                />

                <label>Latitude</label>
                <input
                    type="number"
                    required
                    min="-90"
                    max="90"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                />

                <label>Longitude</label>
                <input
                    type="number"
                    required
                    min="-180"
                    max="180"
                    step="any" value={lon}
                    onChange={(e) => setLon(e.target.value)}
                />

                <label>Price</label>
                <input
                    type="number"
                    required
                    min="1"
                    step="0.02" value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <label>Image</label>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                        const selectedImage = e.target.files[0];

                        if (selectedImage) {
                            setImage(selectedImage);
                            setPreview(URL.createObjectURL(selectedImage));
                        }
                    }}
                />
                {preview && (
                    <div>
                        <img
                            src={preview}
                            alt="Hotel preview"
                            width="200"
                        />
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={removeImage}
                        >
                            Remove Image
                        </button>
                    </div>
                )}

                <button type="submit">
                    {hotel ? "Update Hotel" : "Add hotel"}
                </button>
            </form>

        </>
    );
}

export default HotelForm;