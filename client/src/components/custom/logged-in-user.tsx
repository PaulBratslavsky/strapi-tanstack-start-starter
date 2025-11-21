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
      <span className="font-semibold text-foreground">
        {userData.username}
      </span>
      <LogoutButton />
    </div>
  )
}
