import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "../features/hotels/hotelSlice";
import API from "../services/HotelApi";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import "../styles/hotelList.css";
import { Helmet } from "react-helmet-async";

function HotelList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { hotels, pagination, error } = useSelector(
        (state) => state.hotels
    );

    const [search, setSearch] = useState("");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [appliedMinPrice, setAppliedMinPrice] = useState("");
    const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

    const [page, setPage] = useState(1);

    const handleApplyFilter = () => {
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setPage(1);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this hotel?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await API.delete(`/${id}`);
            alert("Deletion successful");

            dispatch(fetchHotels({
                search,
                minPrice: appliedMinPrice,
                maxPrice: appliedMaxPrice,
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
                search,
                minPrice: appliedMinPrice,
                maxPrice: appliedMaxPrice,
                page,
                limit: 6
            }));
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch, search, appliedMinPrice, appliedMaxPrice, page]);

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="hotel-page">
            <Helmet>
                <title>Explore Hotels | Hotel</title>
                <meta
                    name="description"
                    content="Find the perfect hotel for your next stay."
                />
            </Helmet>

            <div className="page-heading">
                <h1>Explore Hotels</h1>
                <p>Find the perfect place for your next stay.</p>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search hotel..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <div className="hotel-container">

                {/* Price filter */}
                <div className="filter-section">
                    <h3>Price Range</h3>

                    <input
                        type="number"
                        placeholder="Minimum price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Maximum price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />

                    <button
                        className="apply-filter-btn"
                        onClick={handleApplyFilter}
                    >
                        Apply
                    </button>
                </div>

                {/* Hotel cards */}
                <div className="hotel-list">
                    {hotels.length === 0 ? (
                        <p>No hotels found.</p>
                    ) : (
                        hotels.map((hotel) => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                onView={() => navigate(`/hotels/${hotel.id}`)}
                                onEdit={() => navigate(`/hotels/edit/${hotel.id}`)}
                                onDelete={() => handleDelete(hotel.id)}
                            />
                        ))
                    )}

                    <div className="pagination">
                        <Pagination
                            page={page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HotelList;