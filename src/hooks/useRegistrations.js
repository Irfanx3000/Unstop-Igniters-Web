import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('igniters_registrations')
        .select(`
          *,
          events (title)
        `)
        .order('registered_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRegistration = async (registration) => {
    const { data, error } = await supabase
      .from('igniters_registrations')
      .insert([registration])
      .select()

    if (!error) {
      setRegistrations(prev => [data[0], ...prev])
    }
    return { data, error }
  }

  const deleteRegistration = async (id) => {
    const { error } = await supabase
      .from('igniters_registrations')
      .delete()
      .eq('id', id)

    if (!error) {
      setRegistrations(prev => prev.filter(reg => reg.id !== id))
    }
    return { error }
  }

  return {
    registrations,
    loading,
    addRegistration,
    deleteRegistration,
    refetch: fetchRegistrations
  }
}