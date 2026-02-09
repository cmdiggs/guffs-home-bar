import Image from 'next/image'

export function GuffsLogo() {
  return (
    <div className="relative">
      <Image
        src="/guffs-logo.svg"
        alt="Guffs"
        width={180}
        height={60}
        priority
        className="w-auto h-12 md:h-14"
      />
    </div>
  )
}
