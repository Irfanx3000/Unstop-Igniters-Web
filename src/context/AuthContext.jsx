import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const checkAdminRole = async (user) => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .single()

      if (!error && data) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking admin role:', error)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        fetchUserProfile(currentUser.id)
        checkAdminRole(currentUser)
      }
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        fetchUserProfile(currentUser.id)
        checkAdminRole(currentUser)
      } else {
        setUserProfile(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) => {
    return supabase.auth.signUp({ email, password })
  }

  const signIn = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error && error.message !== "Auth session missing!") {
      throw error;
    }
  } catch (err) {
    console.error("Sign out failed:", err);
  }
};


  const value = {
    user,
    userProfile,
    signUp,
    signIn,
    signOut,
    isAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}



// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '../supabase/client'

// const AuthContext = createContext({})

// export const useAuth = () => useContext(AuthContext)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [userProfile, setUserProfile] = useState(null)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [loading, setLoading] = useState(true)

//   const fetchUserProfile = async (userId) => {
//     try {
//       const { data, error } = await supabase
//         .from('user_profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single()

//       if (!error && data) {
//         setUserProfile(data)
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error)
//     }
//   }

//   const checkAdminRole = async (user) => {
//     if (!user) return false
    
//     try {
//       if (user.email?.toLowerCase().includes('@aiktc.ac.in')) {
//         setIsAdmin(true)
//         return
//       }

//       const { data, error } = await supabase
//         .from('admin_roles')
//         .select('*')
//         .eq('email', user.email.toLowerCase())
//         .single()

//       if (!error && data) {
//         setIsAdmin(true)
//       }
//     } catch (error) {
//       console.error('Error checking admin role:', error)
//     }
//   }

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       const currentUser = session?.user ?? null
//       setUser(currentUser)
//       setLoading(false)
      
//       if (currentUser) {
//         fetchUserProfile(currentUser.id)
//         checkAdminRole(currentUser)
//       }
//     })

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log('Auth event:', event)
//       const currentUser = session?.user ?? null
//       setUser(currentUser)
      
//       if (currentUser) {
//         fetchUserProfile(currentUser.id)
//         checkAdminRole(currentUser)
//       } else {
//         setUserProfile(null)
//         setIsAdmin(false)
//       }
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   const signUp = (email, password) => {
//     return supabase.auth.signUp({ email, password })
//   }

//   const signIn = (email, password) => {
//     return supabase.auth.signInWithPassword({ email, password })
//   }

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut()
//       if (error) {
//         console.error('Sign out error:', error)
//         throw error
//       }
//       // State will be updated by the auth state change listener
//       console.log('Sign out successful')
//     } catch (error) {
//       console.error('Sign out failed:', error)
//       throw error
//     }
//   }

//   const value = {
//     user,
//     userProfile,
//     signUp,
//     signIn,
//     signOut,
//     isAdmin,
//     loading
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }