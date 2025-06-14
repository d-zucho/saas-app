'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '@/lib/supabase'

// CAN ONLY RUN ON SERVER since we are accessing the auth object and supabase client

// create new companion
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

// fetch all companions
export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient()

  let query = supabase
    .from('Companions')
    .select() // get all companions
    .order('created_at', { ascending: false }) // order by created_at in descending order

  if (subject && topic) {
    query = query
      .ilike('subject', `%${subject}%`) // filter by subject
      .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`) // filter by topic or name
  } else if (subject) {
    query = query.ilike('subject', `%${subject}%`)
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`)
  }
  // paginate results
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data: companions, error } = await query

  if (error) throw new Error(error.message || 'Failed to fetch companions')

  return companions || []
}
