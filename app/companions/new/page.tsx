import CompanionForm from '@/components/CompanionForm'
import React from 'react'
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const NewCompanionPage  = async () => {
    const { userId } = await auth()

  //   if user is not signed in, redirect to sign in page
    if (!userId) redirect('/sign-in')
  return (
    <main className='min-lg:w-1/3 min-md:w-2/3 items-center justify-center'>
      <article className='w-full gap-4 flex flex-col'>
        <h1>Companion Builder</h1>
        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanionPage
