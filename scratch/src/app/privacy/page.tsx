import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Archon Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20 px-6">
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[160px] rounded-full" />
      </div>

      <article className="max-w-3xl mx-auto w-full prose-invert space-y-8">
        <div className="space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/30">Legal</p>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-foreground/40">Last updated: April 20, 2026</p>
        </div>

        <Section title="1. Information We Collect">
          <p>When you use Archon, we may collect the following information:</p>
          <ul>
            <li><strong>Account Data:</strong> When you sign up via Clerk, we receive your email address and a unique user identifier. We do not store passwords.</li>
            <li><strong>Intake Responses:</strong> The answers you provide during the 5-question intake are processed locally in your browser and are not transmitted to our servers unless you choose to export.</li>
            <li><strong>Payment Data:</strong> Payments are processed by Stripe. We store your Stripe Customer ID and payment status but never see or store your credit card details.</li>
            <li><strong>Usage Data:</strong> We collect anonymous analytics about page visits and feature usage to improve the platform.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul>
            <li>To provide and maintain the Archon orchestration service.</li>
            <li>To process payments and manage your export entitlements.</li>
            <li>To communicate important service updates.</li>
            <li>To improve the platform based on aggregated usage patterns.</li>
          </ul>
        </Section>

        <Section title="3. Data Storage & Security">
          <p>Your data is stored securely using industry-standard encryption. Authentication is managed by Clerk, and payments by Stripe — both are SOC 2 Type II certified. Intake session data is stored locally in your browser&apos;s sessionStorage and is never persisted on our servers.</p>
        </Section>

        <Section title="4. Third-Party Services">
          <ul>
            <li><strong>Clerk</strong> — Authentication provider (<a href="https://clerk.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener">Privacy Policy</a>)</li>
            <li><strong>Stripe</strong> — Payment processor (<a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener">Privacy Policy</a>)</li>
          </ul>
        </Section>

        <Section title="5. Your Rights">
          <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <span className="text-primary">privacy@archon.systems</span>.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use essential cookies for authentication session management. We do not use advertising or third-party tracking cookies.</p>
        </Section>

        <Section title="7. Changes to This Policy">
          <p>We may update this policy from time to time. We will notify you of any material changes via email or an in-app notification.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions about this policy? Reach out at <span className="text-primary">legal@archon.systems</span>.</p>
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
