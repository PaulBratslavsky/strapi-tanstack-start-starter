import { Link } from '@tanstack/react-router'
import { LogoutButton } from './logout-button'

interface ILoggedInUserProps {
  username: string
  email: string
}

export function LoggedInUser({
  userData,
}: {
  readonly userData: ILoggedInUserProps
}) {
  return (
    <div className="flex gap-2 items-center">
      <Link to="/dashboard/account" className="font-semibold hover:text-primary">
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  )
}
