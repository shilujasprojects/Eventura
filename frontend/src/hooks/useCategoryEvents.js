import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../api/api";

export default function useCategoryEvents(categoryId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(ENDPOINTS.event, {
          params: { category: categoryId, status: "Active" },
        });
        setEvents(res.data.data || []);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryId]);

  return { events, loading };
}