'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function SignOutButton({ compact }: { compact?: boolean }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant={compact ? 'ghost' : 'outline'}
      size={compact ? 'sm' : 'lg'}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await signOut()
          router.push('/sign-in')
          router.refresh()
        })
      }}
    >
      {pending ? 'Déconnexion…' : 'Se déconnecter'}
    </Button>
  )
}