import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "../features/hotels/hotelSlice";
import "../styles/hotelList.css";
import API from "../services/HotelApi";
function HotelList() {

    const dispatch = useDispatch();
    const { hotels, loading, pagination, error } = useSelector(
        (state) => state.hotels
    );

    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this hotel?"
        );

        if (!confirmDelete) {
            return;
        }
        try {
            await API.delete(`/${id}`);
            alert("deletion success");
            dispatch(fetchHotels({
                search,
                minPrice,
                maxPrice,
                page,
                limit: 6
            }));
        } catch (error) {
            console.log(error);
            alert("Failed to delete");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(fetchHotels({
                search: search,
                minPrice: minPrice,
                maxPrice: maxPrice,
                page: page,
                limit: 6
            }));
        }, 500);

        return () => {
            clearTimeout(timer);
        };

    }, [dispatch, search, minPrice, maxPrice, page]);

    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div className="hotel-page">

            <div className="page-heading">
                <h1>Explore Hotels</h1>
                <p>Find the perfect place for your next stay.</p>
            </div>

            <div className="hotel-container">

                <div className="filter-section">
                    <h3>Search Hotels</h3>

                    <input
                        type="text"
                        placeholder="Search hotel..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}

                    />

                    <h3>Price Range</h3>

                    <input
                        type="number"
                        placeholder="Minimum price"
                        value={minPrice}
                        onChange={(e) => {
                            setMinPrice(e.target.value);
                            setPage(1);
                        }}
                    />

                    <input
                        type="number"
                        placeholder="Maximum price"
                        value={maxPrice}
                        onChange={(e) => {
                            setMaxPrice(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="hotel-list">

                    {hotels.length === 0 ? (
                        <p>No hotels found.</p>
                    ) : (
                        hotels.map((hotel) => (
                            <div className="hotel-card" key={hotel.id}>

                                <img
                                    src={`http://localhost:4000${hotel.image}`}
                                    alt={hotel.title}
                                />

                                <div className="hotel-info">
                                    <h2>{hotel.title}</h2>
                                    <p>{hotel.description}</p>
                                    <h3>₹{hotel.price}</h3>
                                    <div className="hotel-actions">
                                        <button onClick={() => navigate(`/hotels/edit/${hotel.id}`)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(hotel.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                    <div className="pagination">

                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>
                            Page {pagination.page || 1} of {pagination.totalPages || 1}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= (pagination.totalPages || 1)}
                        >
                            Next
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );

}

export default HotelList;
