import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HotelListPage from './pages/HotelListPage';
import HotelDetailPage from './pages/HotelDetailPage';
import ReservationPage from './pages/ReservationPage';
import AddEditHotelPage from './pages/AddEditHotelPage';
import AdminManagePage from './pages/AdminManagePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/manage" element={<AdminManagePage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/reserve" element={<ReservationPage />} />
          <Route path="/add" element={<AddEditHotelPage />} />
          <Route path="/edit/:id" element={<AddEditHotelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
