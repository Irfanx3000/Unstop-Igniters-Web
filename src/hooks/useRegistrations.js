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
        .select(`
          *,
          events ( title )
        `)
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
      .channel("registrations-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "igniters_registrations",
        },
        () => {
          // 🔥 SAFEST: refetch instead of partial mutation
          fetchRegistrations();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime registrations subscribed");
        }
      });

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

    // ❌ DO NOT set state here
    // realtime listener will trigger fetchRegistrations

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
