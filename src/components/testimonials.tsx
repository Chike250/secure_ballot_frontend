import { Quote } from "lucide-react"
import { Card, CardContent } from "@/src/components/ui/card"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  image?: string
}

function Testimonial({ quote, author, role, image }: TestimonialProps) {
  return (
    <Card className="h-full glassmorphism">
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-primary/40 mb-4" />
        <blockquote className="mb-4 text-lg">"{quote}"</blockquote>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
            {image ? (
              <img src={image || "/placeholder.svg"} alt={author} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {author
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-muted-foreground">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Testimonial
        quote="Secure Ballot's encryption protocols are state-of-the-art. Their implementation of ECC & AES-256 encryption ensures votes remain confidential and tamper-proof."
        author="Dr. Isa Ibrahim Pantami"
        role="Cybersecurity Expert, Former Minister of Communications"
      />

      <Testimonial
        quote="I've thoroughly tested Secure Ballot's security measures, and I'm impressed. The multi-factor authentication and end-to-end encryption make it virtually impenetrable."
        author="Osita Chidoka"
        role="Chief Security Officer, CyberSafe Foundation"
      />

      <Testimonial
        quote="As someone who values transparency in our electoral process, I'm confident that Secure Ballot represents a significant step forward for Nigerian democracy."
        author="Chimamanda Ngozi Adichie"
        role="Award-winning Author & Public Figure"
      />

      <Testimonial
        quote="The user experience is exceptional. Secure Ballot makes voting accessible to all Nigerians while maintaining the highest security standards."
        author="Bankole Wellington (Banky W)"
        role="Musician & Political Activist"
      />

      <Testimonial
        quote="INEC's partnership with Secure Ballot demonstrates our commitment to leveraging technology for free, fair, and secure elections in Nigeria."
        author="Prof. Mahmood Yakubu"
        role="INEC Chairman"
      />

      <Testimonial
        quote="The real-time monitoring capabilities of Secure Ballot bring unprecedented transparency to our electoral process. This is the future of voting in Nigeria."
        author="Aisha Yesufu"
        role="Activist & Public Speaker"
      />
    </div>
  )
}
