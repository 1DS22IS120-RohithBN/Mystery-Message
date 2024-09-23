'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <a href="/api/auth/signin">
      <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-lg mt-5 ml-10"
       onClick={() => signIn()}>Sign in</button>
    </a>
  )
}
