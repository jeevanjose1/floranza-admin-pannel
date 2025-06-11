import { Navigate, Outlet } from 'react-router'
import { is_auth } from '~/lib/utils'

type Props = {}

export default function PublicLayout({}: Props) {
  const is_authenticated = is_auth()

  if(is_authenticated){
    return <Navigate to={'/'}/>
  }
  return (
    <main className='w-full h-screen flex items-center justify-center'>
         <Outlet/>
    </main >
  )
}