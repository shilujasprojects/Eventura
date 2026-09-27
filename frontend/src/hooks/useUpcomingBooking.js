import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api/api";  

const API_BASE_URL = `${API_URL}/api`;

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