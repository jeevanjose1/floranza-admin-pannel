import type { ReactElement } from "react"
import { has_permission } from "~/lib/utils"
import { useGetProfile } from "~/services/queries/auth";
import type { PERMISSIONS } from "~/shared/others/others";
type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

type Props = { permission: Permission, children: ReactElement }

export default function PermissionWrapper({ permission, children }: Props) {
  const {data:profile} = useGetProfile()
  
  const current_permission =profile?.data?.user?.permission ?JSON.parse(profile?.data?.user?.permission) :[]
  if (!has_permission(permission,current_permission)) {
    return null
  }
  return (
    <>
    {children}
    </>
  )
}