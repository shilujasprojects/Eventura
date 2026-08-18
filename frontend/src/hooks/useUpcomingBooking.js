import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function useUpcomingBooking(eventId) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings/event/${eventId}/upcoming`);
        setBooking(res.data.data);
      } catch (error) {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [eventId]);

  return { booking, loading };
}