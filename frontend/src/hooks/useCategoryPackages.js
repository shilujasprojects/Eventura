import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../api/api";

export default function useCategoryPackages(categoryId) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(ENDPOINTS.package, {
          params: { category: categoryId, status: "Active" },
        });
        setPackages(res.data.data || []);
      } catch (error) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [categoryId]);

  return { packages, loading };
}