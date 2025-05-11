import Image from "next/image"

export function HeroImage() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-T6N7GmMTPF2lCuOgVlmSFStxMaeHty.jpeg"
        alt="Nigerian voters holding a 'Vote Right' sign at a political rally"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
      />
      <div className="absolute bottom-4 left-4 z-20 text-white">
        <h3 className="text-xl font-bold">Your Vote, Your Right</h3>
        <p className="text-sm opacity-80">Secure, Transparent, Reliable</p>
      </div>
    </div>
  )
}
