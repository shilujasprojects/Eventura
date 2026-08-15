import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../api/api";

export default function useCategoryDetails(categoryId) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ENDPOINTS.category}/view-category/${categoryId}`);
        setCategory(res.data.data);
      } catch (error) {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading };
}