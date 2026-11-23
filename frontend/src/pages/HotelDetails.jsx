import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/HotelApi";
import { Helmet } from "react-helmet-async";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const hotelMarkerIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function HotelDetails() {
    const [userLocation, setUserLocation] = useState(null);
    const [locationMessage, setLocationMessage] = useState("");

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

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationMessage(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                setLocationMessage(
                    "Current location accessed successfully."
                );
            },
            (error) => {
                console.log(error);

                setLocationMessage(
                    "Unable to access current location. Please allow location permission."
                );
            }
        );
    }, []);

    if (!hotel) {
        return <p>Loading hotel details...</p>;
    }

    const latitude = Number(hotel.latitude);
    const longitude = Number(hotel.longitude);

    const validCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;

    return (
        <div className="hotel-details">

            <Helmet>
                <title>{hotel.title} | StayFinder</title>
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

            <h2>Hotel Location</h2>

            {validCoordinates ? (
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{
                        height: "400px",
                        width: "100%"
                    }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                        position={[latitude, longitude]}
                        icon={hotelMarkerIcon}
                    >
                        <Popup>
                            {hotel.title}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p>Valid hotel coordinates are not available.</p>
            )}

            <p>{locationMessage}</p>

        </div>
    );
}

export default HotelDetails;