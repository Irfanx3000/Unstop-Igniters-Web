import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export const useEvents = (type = null) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [type])

  const fetchEvents = async () => {
    try {
      let query = supabase.from('events').select('*').order('event_date', { ascending: true })
      
      if (type) {
        query = query.eq('event_type', type)
      }

      const { data, error } = await query

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async (event) => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()

    if (!error) {
      setEvents(prev => [...prev, data[0]])
    }
    return { data, error }
  }

  const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()

    if (!error) {
      setEvents(prev => prev.map(event => event.id === id ? data[0] : event))
    }
    return { data, error }
  }

  const deleteEvent = async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (!error) {
      setEvents(prev => prev.filter(event => event.id !== id))
    }
    return { error }
  }

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  }
}