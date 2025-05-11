import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Navbar } from "@/src/components/navbar"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          <p className="text-muted-foreground">Last updated: March 11, 2025</p>
          <p>
            Welcome to Secure Ballot. By using our services, you agree to comply with and be bound by the following
            terms and conditions. Please read them carefully.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Secure Ballot, you agree to be bound by these Terms of Service and all applicable laws
            and regulations. If you do not agree with any part of these terms, you may not use our services.
          </p>
          <h2>2. Eligibility</h2>
          <p>
            To use Secure Ballot, you must be a registered voter in Nigeria, at least 18 years old, and possess a valid
            National Identification Number (NIN) and Voter Identification Number (VIN).
          </p>
          <h2>3. User Responsibilities</h2>
          <p>As a user of Secure Ballot, you agree to:</p>
          <ul>
            <li>Provide accurate and up-to-date information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Not share your account or voting access with others</li>
            <li>Report any suspicious activities or security concerns immediately</li>
          </ul>
          <h2>4. Voting Process</h2>
          <p>
            Secure Ballot provides a platform for online voting in Nigerian elections. By using our service, you
            acknowledge that:
          </p>
          <ul>
            <li>Your vote is final once submitted and cannot be changed</li>
            <li>You are responsible for ensuring your vote is cast before the election deadline</li>
            <li>Technical issues beyond our control may occasionally affect service availability</li>
          </ul>
          <h2>5. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use,
            and protect your personal data.
          </p>
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of Secure Ballot are owned by us or our licensors and are protected
            by copyright, trademark, and other intellectual property laws.
          </p>
          <h2>7. Limitation of Liability</h2>
          <p>
            Secure Ballot and its affiliates shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use or inability to use our services.
          </p>
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We will notify users of any significant
            changes via email or through our platform.
          </p>
          <h2>9. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the Federal
            Republic of Nigeria.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@secureballot.ng">legal@secureballot.ng</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
