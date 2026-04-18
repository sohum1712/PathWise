import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpSuccess() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please check your email and click the verification link to activate your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Once verified, you&apos;ll be redirected to your dashboard automatically.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
