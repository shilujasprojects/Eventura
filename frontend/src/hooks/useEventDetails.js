import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../api/api";

export default function useEventDetails(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ENDPOINTS.event}/${eventId}`);
        setEvent(res.data.data);
      } catch (error) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading };
}