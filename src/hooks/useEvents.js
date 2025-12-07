import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export const useEvents = (type = null) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------------------------
     FETCH EVENTS (OPTIONAL FILTER BY event_type)
  ----------------------------------------------------- */
  useEffect(() => {
    fetchEvents();
  }, [type]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (type) query = query.eq("event_type", type);

      const { data, error } = await query;

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
     ADD EVENT (Admin Only – Requires Auth)
  ----------------------------------------------------- */
  const addEvent = async (eventData) => {
    try {
      // Must fetch current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { data: null, error: new Error("User not authenticated") };
      }

      const payload = {
        ...eventData,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from("events")
        .insert([payload])
        .select();

      if (error) throw error;

      // Update local UI instantly
      setEvents((prev) => [...prev, data[0]]);

      return { data: data[0], error: null };
    } catch (error) {
      console.error("Error adding event:", error);
      return { data: null, error };
    }
  };

  /* -----------------------------------------------------
     UPDATE EVENT
  ----------------------------------------------------- */
  const updateEvent = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;

      // Update UI instantly
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? data[0] : event))
      );

      return { data: data[0], error: null };
    } catch (error) {
      console.error("Error updating event:", error);
      return { data: null, error };
    }
  };

  /* -----------------------------------------------------
     DELETE EVENT
  ----------------------------------------------------- */
  const deleteEvent = async (id) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      // Remove from UI instantly
      setEvents((prev) => prev.filter((event) => event.id !== id));

      return { error: null };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { error };
    }
  };

  /* -----------------------------------------------------
     RETURN EVERYTHING
  ----------------------------------------------------- */
  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};
