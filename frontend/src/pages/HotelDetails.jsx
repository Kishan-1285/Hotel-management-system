import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/HotelApi";

import { Helmet } from "react-helmet-async";

function HotelDetails() {
    const { id } = useParams();

    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        const getHotel = async () => {
            try {
                const response = await API.get(`/${id}`);
                setHotel(response.data.hotel);
            } catch (error) {
                console.log(error);
            }
        };
        getHotel();
    }, [id]);

    if (!hotel) {
        return <p>Loading hotel details...</p>;
    }

    return (
        <div className="hotel-details">
            <Helmet>
                <title>{hotel.title} | Hotel finder</title>

                <meta
                    name="description"
                    content={hotel.description}
                />
            </Helmet>
            <h1>{hotel.title}</h1>

            <img
                src={`http://localhost:4000${hotel.image}`}
                alt={hotel.title}
                width="400"
            />

            <p>{hotel.description}</p>
            <h3>Price: ₹{hotel.price}</h3>
            <p>Latitude: {hotel.latitude}</p>
            <p>Longitude: {hotel.longitude}</p>
        </div>
    );
}

export default HotelDetails;
