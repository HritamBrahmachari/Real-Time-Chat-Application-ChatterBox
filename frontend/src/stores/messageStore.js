import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useMessageStore = create(
  persist(
    (set) => ({
      messages: null,
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: 'message-storage',
    }
  )
)

export default useMessageStore
