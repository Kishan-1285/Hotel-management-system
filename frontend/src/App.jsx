import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import HotelDetails from "./pages/HotelDetails";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<HotelList />} />
                <Route path="/hotels/new" element={<AddHotel />} />
                <Route path="/hotels/edit/:id" element={<EditHotel />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;