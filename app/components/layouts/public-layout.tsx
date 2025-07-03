import { Navigate, Outlet } from 'react-router'
import { current_path, is_auth } from '~/lib/utils'
import { useGetProfile } from '~/services/queries/auth'

type Props = {}

export default function PublicLayout({ }: Props) {
  const is_authenticated = is_auth()
  const { data: profile } = useGetProfile()
  const current_permission = profile?.data?.user?.permission ? JSON.parse(profile?.data?.user?.permission) : []
  const path = current_path(current_permission)
  const path_without_id = path?.items?.filter((item) => {
    return !item.path?.includes(':')
  })

  if (is_authenticated && path_without_id) {
    return <Navigate replace to={path_without_id?.[0]?.path as string} />
  }
  return (
    <main className='w-full h-screen flex items-center justify-center'>
      <Outlet />
    </main >
  )
}