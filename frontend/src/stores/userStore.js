import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      authUser: null,
      otherUsers: [], // Initialize as empty array
      selectedUser: null,
      onlineUsers: [],
      addedUsers: [], // Initialize as empty array
      setAuthUser: (user) => set({ authUser: user }),
      setOtherUsers: (users) => set({ otherUsers: Array.isArray(users) ? users : [] }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setOnlineUsers: (users) => set({ onlineUsers: Array.isArray(users) ? users : [] }),
      setAddedUsers: (users) => set({ addedUsers: Array.isArray(users) ? users : [] }),
    }),
    {
      name: 'user-storage',
    }
  )
)

export default useUserStore
