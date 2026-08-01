import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AccountNav from '../components/ui/AccountNav';
import AddressLink from '../components/ui/AddressLink';
import BookingDates from '../components/ui/BookingDates';
import PlaceGallery from '../components/ui/PlaceGallery';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const SingleBookedPlace = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/bookings');

      // filter the data to get current booking
      const filteredBooking = data.booking.filter(
        (booking) => booking._id === id,
      );

      setBooking(filteredBooking[0]);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <AccountNav />
      {booking?.place ? (
        <div className="mt-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold md:text-3xl">
            {booking?.place?.title}
          </h1>

          {/* Address Link */}
          <AddressLink
            className="my-3 inline-flex items-center gap-1 font-semibold text-gray-800 underline"
            placeAddress={booking.place?.address}
          />

          {/* Grey Booking Info Card & Pink Price Box */}
          <div className="my-6 flex flex-col justify-between rounded-2xl bg-gray-100 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="mb-2 text-xl font-medium text-gray-800 md:text-2xl">
                Your booking information
              </h2>
              <BookingDates
                booking={booking}
                className="text-base text-gray-600 md:text-lg"
              />
            </div>
            
            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-[#ff385c] px-8 py-4 text-white shadow-md sm:mt-0">
              <span className="text-sm font-normal opacity-90">Total price</span>
              <span className="text-2xl font-bold md:text-3xl">
                ₹{booking?.price}
              </span>
            </div>
          </div>

          {/* Place Gallery / Images Grid */}
          <PlaceGallery place={booking?.place} />
        </div>
      ) : (
        <div className="py-12 text-center text-xl font-semibold text-gray-600">
          No data found
        </div>
      )}
    </div>
  );
};

export default SingleBookedPlace;