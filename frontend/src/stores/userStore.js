import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      authUser: null,
      otherUsers: null,
      selectedUser: null,
      onlineUsers: null,
      setAuthUser: (user) => set({ authUser: user }),
      setOtherUsers: (users) => set({ otherUsers: users }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setOnlineUsers: (users) => set({ onlineUsers: users }),
    }),
    {
      name: 'user-storage',
    }
  )
)

export default useUserStore
