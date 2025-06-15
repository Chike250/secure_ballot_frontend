import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Find answers to common questions about Secure Ballot and the voting
            process.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12 md:mb-16">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>General Questions</CardTitle>
                <CardDescription>
                  Basic information about Secure Ballot and online voting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Secure Ballot?</AccordionTrigger>
                    <AccordionContent>
                      Secure Ballot is Nigeria's most secure and transparent
                      online voting platform, designed for the 2027 General
                      Elections. It allows eligible Nigerian voters to cast
                      their votes securely from anywhere, using multi-factor
                      authentication and end-to-end encryption to ensure vote
                      integrity and confidentiality.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Is online voting secure?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, Secure Ballot uses enterprise-grade security measures
                      including multi-factor authentication, end-to-end
                      encryption with ECC & AES-256, and tamper-proof audit
                      logs. Our system has been rigorously tested by independent
                      cybersecurity experts and certified by INEC to meet the
                      highest security standards.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Who can use Secure Ballot?
                    </AccordionTrigger>
                    <AccordionContent>
                      All Nigerian citizens who are registered voters with a
                      valid National Identification Number (NIN) and Voter
                      Identification Number (VIN) can use Secure Ballot. You
                      must be at least 18 years old and have completed the voter
                      registration process with INEC.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      Which elections can I vote in?
                    </AccordionTrigger>
                    <AccordionContent>
                      Secure Ballot supports voting in Presidential,
                      Gubernatorial, House of Representatives, and Senatorial
                      elections. The specific elections available to you will
                      depend on your registered constituency and the current
                      election schedule as determined by INEC.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      Is Secure Ballot officially recognized by INEC?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, Secure Ballot is officially certified and recognized
                      by the Independent National Electoral Commission (INEC) as
                      an authorized voting platform for the 2027 General
                      Elections. Our platform was developed in partnership with
                      INEC to ensure compliance with all electoral laws and
                      regulations.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>
                Find what you're looking for faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#voting-process"
                    className="text-primary hover:underline"
                  >
                    Voting Process
                  </Link>
                </li>
                <li>
                  <Link
                    href="#security-privacy"
                    className="text-primary hover:underline"
                  >
                    Security & Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#technical-issues"
                    className="text-primary hover:underline"
                  >
                    Technical Issues
                  </Link>
                </li>
                <li>
                  <Link
                    href="#results-verification"
                    className="text-primary hover:underline"
                  >
                    Results & Verification
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact Support
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div id="voting-process" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Voting Process</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="voting-1">
              <AccordionTrigger>
                How do I register to vote on Secure Ballot?
              </AccordionTrigger>
              <AccordionContent>
                You don't need to register separately for Secure Ballot. If
                you're already a registered voter with INEC and have a valid NIN
                and VIN, you can simply log in to the platform using these
                credentials. The system will verify your identity and
                eligibility automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voting-2">
              <AccordionTrigger>
                What do I need to vote online?
              </AccordionTrigger>
              <AccordionContent>
                To vote online, you'll need:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your 11-digit National Identification Number (NIN)</li>
                  <li>Your 19-character Voter Identification Number (VIN)</li>
                  <li>
                    Access to your registered phone number to receive a one-time
                    password (OTP)
                  </li>
                  <li>
                    A device with internet access (smartphone, tablet, or
                    computer)
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voting-3">
              <AccordionTrigger>
                How long is the voting period?
              </AccordionTrigger>
              <AccordionContent>
                The voting period for the 2027 General Elections will last for 3
                weeks. This extended period allows all eligible voters
                sufficient time to cast their votes, reducing congestion and
                ensuring accessibility for everyone, including those in remote
                areas or with limited internet access.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voting-4">
              <AccordionTrigger>
                Can I change my vote after submitting it?
              </AccordionTrigger>
              <AccordionContent>
                No, once your vote is submitted, it cannot be changed. This is
                to maintain the integrity of the election process. Before final
                submission, you'll be asked to confirm your selection, so please
                review your choices carefully before confirming.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voting-5">
              <AccordionTrigger>
                What if I'm unable to vote online?
              </AccordionTrigger>
              <AccordionContent>
                INEC will maintain traditional polling stations for voters who
                are unable to use the online platform. If you encounter
                difficulties with online voting, you can visit your designated
                polling station during the voting period with your voter's card
                to cast your vote in person.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div id="security-privacy" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Security & Privacy</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="security-1">
              <AccordionTrigger>
                How is my vote kept confidential?
              </AccordionTrigger>
              <AccordionContent>
                Your vote is encrypted immediately after submission using ECC &
                AES-256 encryption, which separates your identity from your
                voting choice. The system maintains two separate databases: one
                for voter verification and another for anonymous vote tallying.
                These databases cannot be linked, ensuring your vote remains
                confidential.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-2">
              <AccordionTrigger>
                Can anyone see who I voted for?
              </AccordionTrigger>
              <AccordionContent>
                No, not even the system administrators can see who you voted
                for. Once your vote is cast, it's anonymized and encrypted. The
                system only records that you have voted (to prevent double
                voting) but does not store any information that could link your
                identity to your specific voting choices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-3">
              <AccordionTrigger>
                What security measures are in place to prevent fraud?
              </AccordionTrigger>
              <AccordionContent>
                Secure Ballot employs multiple security measures:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Multi-factor authentication using NIN, VIN, and OTP</li>
                  <li>End-to-end encryption of all data</li>
                  <li>
                    Tamper-proof audit logs that record all system activities
                  </li>
                  <li>Real-time monitoring for suspicious activities</li>
                  <li>
                    Regular security audits by independent cybersecurity experts
                  </li>
                  <li>Blockchain technology to ensure vote immutability</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-4">
              <AccordionTrigger>
                How do you prevent someone from voting on my behalf?
              </AccordionTrigger>
              <AccordionContent>
                To vote, a person would need access to your NIN, VIN, and the
                phone number registered with INEC to receive the OTP.
                Additionally, the system employs behavioral analytics and device
                fingerprinting to detect suspicious login attempts. If unusual
                activity is detected, additional verification steps will be
                required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-5">
              <AccordionTrigger>
                What happens to my data after the election?
              </AccordionTrigger>
              <AccordionContent>
                After the election results are certified, personal
                identification data is securely archived according to INEC
                regulations. The anonymized voting data is retained for
                historical and statistical purposes. All data storage complies
                with Nigeria's data protection regulations and international
                best practices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div id="technical-issues" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Technical Issues</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tech-1">
              <AccordionTrigger>
                What if I don't receive my OTP?
              </AccordionTrigger>
              <AccordionContent>
                If you don't receive your OTP within 5 minutes, you can request
                a new one by clicking the "Resend OTP" button. If you still
                don't receive it, verify that you're using the phone number
                registered with INEC. If problems persist, contact our support
                team or visit your local INEC office for assistance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2">
              <AccordionTrigger>
                What devices and browsers are supported?
              </AccordionTrigger>
              <AccordionContent>
                Secure Ballot works on most modern devices including
                smartphones, tablets, and computers. We support the latest
                versions of Chrome, Firefox, Safari, and Edge browsers. For the
                best experience, we recommend using a device with a stable
                internet connection and updated browser software.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-3">
              <AccordionTrigger>
                What if my internet connection drops while voting?
              </AccordionTrigger>
              <AccordionContent>
                If your internet connection drops during the voting process,
                your vote will not be submitted until you confirm it. When your
                connection is restored, you can continue from where you left
                off. The system saves your progress temporarily on your device
                until final submission.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-4">
              <AccordionTrigger>
                Is the platform accessible for people with disabilities?
              </AccordionTrigger>
              <AccordionContent>
                Yes, Secure Ballot is designed to be accessible to all users,
                including those with disabilities. The platform complies with
                Web Content Accessibility Guidelines (WCAG) 2.1 standards and
                supports screen readers, keyboard navigation, and other
                assistive technologies. We also offer high-contrast mode and
                text resizing options.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div id="results-verification" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Results & Verification</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="results-1">
              <AccordionTrigger>
                How can I verify my vote was counted?
              </AccordionTrigger>
              <AccordionContent>
                After voting, you'll receive a unique, anonymous receipt code.
                You can use this code on the verification portal to confirm that
                your vote was recorded in the system. This verification method
                allows you to check that your vote was counted without revealing
                who you voted for.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="results-2">
              <AccordionTrigger>
                When will election results be available?
              </AccordionTrigger>
              <AccordionContent>
                Preliminary results will be available in real-time as votes are
                cast. However, official results will be announced by INEC after
                the voting period ends and all votes have been verified and
                tallied. This typically occurs within 48 hours after the close
                of voting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="results-3">
              <AccordionTrigger>
                How are the votes counted and verified?
              </AccordionTrigger>
              <AccordionContent>
                Votes are automatically tallied by the system as they are cast.
                The counting process is overseen by INEC officials and
                independent observers. Multiple verification mechanisms,
                including cryptographic proofs and blockchain validation, ensure
                that the vote count is accurate and hasn't been tampered with.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="results-4">
              <AccordionTrigger>
                Can I see detailed results for my constituency?
              </AccordionTrigger>
              <AccordionContent>
                Yes, detailed results broken down by constituency, local
                government area, and state will be available on the results
                dashboard after the official announcement. You can view vote
                distributions, turnout statistics, and comparative analyses for
                all elections.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our support
            team is ready to help.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Support</Link>
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
                Nigeria's most secure and transparent voting platform for the
                2027 General Elections.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
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
  );
}
