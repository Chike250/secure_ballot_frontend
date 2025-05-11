import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Navbar } from "@/src/components/navbar"

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          <p className="text-muted-foreground">Last updated: March 11, 2025</p>
          <p>
            At Secure Ballot, we are committed to protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you
            use our online voting platform.
          </p>
          <h2>Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>Personal Identification Information (NIN, VIN)</li>
            <li>Contact Information (email address, phone number)</li>
            <li>Demographic Information (age, gender, location)</li>
            <li>Voting Preferences and History</li>
            <li>Device and Browser Information</li>
          </ul>
          <h2>How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>To verify your identity and eligibility to vote</li>
            <li>To process and record your vote securely</li>
            <li>To prevent fraud and ensure the integrity of the election</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To improve our services and user experience</li>
          </ul>
          <h2>Data Security</h2>
          <p>
            We implement strict security measures to protect your data, including encryption, access controls, and
            regular security audits. Your voting choices are anonymized and cannot be linked back to your personal
            information.
          </p>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (subject to legal requirements)</li>
            <li>Object to certain processing of your data</li>
          </ul>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@secureballot.ng">privacy@secureballot.ng</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
