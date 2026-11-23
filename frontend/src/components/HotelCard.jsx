function HotelCard({ hotel, onDelete, onEdit, onView }) {
    return (
        <div
            className="hotel-card"
            onClick={onView}
        >
            <img
                src={`http://localhost:4000${hotel.image}`}
                alt={hotel.title}
            />

            <div className="hotel-info">
                <h2>{hotel.title}</h2>
                <p>{hotel.description}</p>
                <h3>₹{hotel.price}</h3>

                <div className="hotel-actions">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}>
                        Edit
                    </button>

                    <button onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
