import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export const useTeam = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTeamMember = async (member) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()

    if (!error) {
      setTeamMembers(prev => [...prev, data[0]])
    }
    return { data, error }
  }

  const updateTeamMember = async (id, updates) => {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()

    if (!error) {
      setTeamMembers(prev => prev.map(member => member.id === id ? data[0] : member))
    }
    return { data, error }
  }

  const deleteTeamMember = async (id) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (!error) {
      setTeamMembers(prev => prev.filter(member => member.id !== id))
    }
    return { error }
  }

  return {
    teamMembers,
    loading,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeam
  }
}