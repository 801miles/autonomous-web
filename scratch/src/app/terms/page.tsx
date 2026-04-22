import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Archon Terms of Service — the agreement governing use of the Archon platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20 px-6">
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 blur-[160px] rounded-full" />
      </div>

      <article className="max-w-3xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">Legal</p>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-foreground/40">Last updated: April 20, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the Archon platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Archon is an autonomous multi-agent architecture orchestration platform that transforms user intent into production-grade technical specifications. The Service includes a free intake and visualization tier, and a paid export tier.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>To access premium features, you must create an account through our authentication partner, Clerk. You are responsible for maintaining the security of your account credentials. You may not share your account with others.</p>
        </Section>

        <Section title="4. Payments & Refunds">
          <ul>
            <li>The Architectural Export is a <strong>one-time payment of $29 USD</strong>.</li>
            <li>Payments are processed securely through Stripe.</li>
            <li>Once an export has been initiated and delivered, the payment is non-refundable.</li>
            <li>If you encounter a technical issue preventing export delivery, contact us at <span className="text-primary">support@archon.systems</span> for resolution.</li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <ul>
            <li><strong>Your Content:</strong> You retain all ownership rights to the specifications generated from your intake data. Archon claims no intellectual property rights over your generated output.</li>
            <li><strong>Our Platform:</strong> The Archon platform, including its code, design, algorithms, and branding, is the intellectual property of Archon Systems and is protected by applicable copyright and trademark laws.</li>
          </ul>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to:</p>
          <ul>
            <li>Reverse engineer, decompile, or disassemble the Service.</li>
            <li>Use the Service for any unlawful purpose.</li>
            <li>Attempt to circumvent payment mechanisms or exploit the export paywall.</li>
            <li>Distribute, sublicense, or resell access to the Service without written permission.</li>
          </ul>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>The Service is provided &quot;as is&quot; without warranties of any kind. Archon Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount you paid for the Service.</p>
        </Section>

        <Section title="8. Termination">
          <p>We reserve the right to suspend or terminate your account at our discretion if you violate these Terms. Upon termination, your right to use the Service ceases immediately, though your previously exported specifications remain yours.</p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>We may modify these Terms at any time. We will provide notice of material changes via email or an in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="10. Governing Law">
          <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
        </Section>

        <Section title="11. Contact">
          <p>For questions regarding these Terms, contact <span className="text-primary">legal@archon.systems</span>.</p>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="text-sm text-foreground/50 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-foreground/50">
        {children}
      </div>
    </section>
  );
}
