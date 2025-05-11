import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, CheckCircle, Users, Building2, Award } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Navbar } from "@/src/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-4">About Secure Ballot</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Nigeria's most secure and transparent voting platform, designed to ensure free and fair elections for the
            2027 General Elections.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="mb-4">
              Secure Ballot was founded with a clear mission: to transform Nigeria's electoral process through
              cutting-edge technology, ensuring that every citizen's vote is counted accurately and securely.
            </p>
            <p className="mb-4">
              We believe that transparent, accessible, and secure elections are the cornerstone of a thriving democracy.
              Our platform combines enterprise-grade security with user-friendly design to make voting accessible to all
              Nigerians.
            </p>
            <p>
              By leveraging advanced encryption, multi-factor authentication, and tamper-proof audit logs, we're setting
              a new standard for election integrity in Nigeria and beyond.
            </p>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-T6N7GmMTPF2lCuOgVlmSFStxMaeHty.jpeg"
              alt="Nigerian voters at a polling station"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">Empowering Democracy</h3>
              <p>Through secure, transparent voting</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Security</CardTitle>
                <CardDescription>We prioritize the security of your vote above all else</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our platform employs military-grade encryption, multi-factor authentication, and tamper-proof audit
                  logs to ensure that every vote is secure and confidential. We've partnered with leading cybersecurity
                  experts to build a system that meets the highest international standards.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Transparency</CardTitle>
                <CardDescription>Open processes that build trust in our democracy</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We believe that transparency is essential for trust. Our platform provides real-time results, detailed
                  audit trails, and comprehensive monitoring tools that allow independent observers to verify the
                  integrity of the election process from start to finish.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Making voting available to all eligible citizens</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We've designed Secure Ballot to be accessible to all Nigerians, regardless of technical expertise or
                  physical ability. Our intuitive interface, support for multiple languages, and compatibility with
                  assistive technologies ensure that everyone can participate in the democratic process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Partners</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <Building2 className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">INEC</h3>
              <p className="text-center text-sm text-muted-foreground">Independent National Electoral Commission</p>
            </div>

            <div className="flex flex-col items-center p-6 border rounded-lg">
              <Shield className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">CyberSafe</h3>
              <p className="text-center text-sm text-muted-foreground">Nigeria's Leading Cybersecurity Foundation</p>
            </div>

            <div className="flex flex-col items-center p-6 border rounded-lg">
              <Award className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">NITDA</h3>
              <p className="text-center text-sm text-muted-foreground">
                National Information Technology Development Agency
              </p>
            </div>

            <div className="flex flex-col items-center p-6 border rounded-lg">
              <Users className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Civil Society</h3>
              <p className="text-center text-sm text-muted-foreground">Coalition of Nigerian Democracy Organizations</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Team</h2>
          <p className="mb-8 max-w-3xl">
            Secure Ballot is powered by a diverse team of technology experts, election specialists, and civic leaders
            committed to strengthening Nigeria's democracy through innovation.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Dr. Oluwaseun Adeyemi"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Dr. Oluwaseun Adeyemi</h3>
              <p className="text-muted-foreground">Chief Executive Officer</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 rounded-full overflow-hidden mb-4">
                <Image src="/placeholder.svg?height=160&width=160" alt="Amina Ibrahim" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Amina Ibrahim</h3>
              <p className="text-muted-foreground">Chief Technology Officer</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Chukwudi Okonkwo"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Chukwudi Okonkwo</h3>
              <p className="text-muted-foreground">Chief Security Officer</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Secure Voting?</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Join millions of Nigerians who are embracing a new era of transparent, secure, and accessible elections.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Login to Vote</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Secure Ballot</h3>
              <p className="text-sm text-muted-foreground">
                Nigeria's most secure and transparent voting platform for the 2027 General Elections.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-primary">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2027 Secure Ballot. All rights reserved. Powered by INEC.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
