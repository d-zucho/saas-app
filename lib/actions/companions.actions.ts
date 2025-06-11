'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'

// CAN ONLY RUN ON SERVER
// because it accesses database
export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth()
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('Companions')
    .insert({ ...formData, author })
    .select()

  if (error || !data)
    throw new Error(
      error?.message || 'Failed to create a companion' + error?.code
    )

  return data[0]
}
