import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/HotelApi";
import HotelForm from "../components/HotelForm";

function EditHotel() {
    const { id } = useParams();

    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        const getHotel = async () => {
            try {
                const response = await API.get(`/${id}`);
                console.log(response.data.hotel);
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
        <div>
            <HotelForm hotel={hotel} />
        </div>
    );
}

export default EditHotel;