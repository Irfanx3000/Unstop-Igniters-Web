import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */
  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("igniters_registrations")
        .select("*") // ✅ remove relation for realtime safety
        .order("registered_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REALTIME ---------------- */
  useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel("registrations-admin") // ✅ stable unique name
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "igniters_registrations",
        },
        () => {
          fetchRegistrations(); // safest approach
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ---------------- MUTATIONS ---------------- */
  const addRegistration = async (registration) => {
    const { data, error } = await supabase
      .from("igniters_registrations")
      .insert([registration])
      .select();

    return { data, error };
  };

  const deleteRegistration = async (id) => {
    const { error } = await supabase
      .from("igniters_registrations")
      .delete()
      .eq("id", id);

    return { error };
  };

  return {
    registrations,
    loading,
    addRegistration,
    deleteRegistration,
    refetch: fetchRegistrations,
  };
};
