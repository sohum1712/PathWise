import Link from 'next/link'

interface LogoProps {
  href?: string
  className?: string
}

export function Logo({ href = '/', className = '' }: LogoProps) {
  return (
    <Link href={href} className={`inline-block ${className}`}>
      <span
        style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600 }}
        className="text-xl tracking-tight"
      >
        PathWise
      </span>
    </Link>
  )
}
