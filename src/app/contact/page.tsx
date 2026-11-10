"use client";

import { useState } from "react";
import { ArrowRight, Mail, MessageSquareText } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#17212F]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F8C]">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-[#0B192A] sm:text-5xl">
              Tell us what your property business needs.
            </h1>
            <p className="mt-5 text-base leading-7 text-[#667085]">
              Share what you are hoping to manage or improve. The current prototype does not have a connected support inbox, so this page will not send or store your message.
            </p>

            <div className="mt-8 rounded-2xl border border-[#E5EAF0] bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F7] text-[#087F8C]">
                <MessageSquareText className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-semibold text-[#17212F]">No verified contact channel is published yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                The business email address and phone number previously shown were placeholders, not verified support details. They have been removed.
              </p>
            </div>
            <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-[#526174]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]" aria-hidden="true" />
              <p>For now, use this page to preview the intended enquiry experience. Please do not enter sensitive personal or customer information.</p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E5EAF0] bg-white p-5 shadow-[0_12px_36px_rgba(11,25,42,0.05)] sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#17212F]">Enquiry form preview</h2>
              <p className="mt-1 text-sm text-[#667085]">Fields are for interface preview only. Nothing is transmitted.</p>
            </div>
            {submitted ? (
              <div role="status" className="rounded-xl border border-[#C77D0A]/20 bg-[#FFF9ED] p-4 text-sm leading-6 text-[#76500A]">
                This form is not connected, so your message was not sent or saved. No contact request has been submitted.
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[#17212F]">Name</label>
                    <input id="contact-name" name="name" autoComplete="name" required className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[#17212F]">Email</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" required className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-organisation" className="mb-1.5 block text-sm font-medium text-[#17212F]">Organisation</label>
                    <input id="contact-organisation" name="organisation" autoComplete="organization" className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="Organisation name" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-[#17212F]">Phone <span className="font-normal text-[#667085]">(optional)</span></label>
                    <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="+260" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-category" className="mb-1.5 block text-sm font-medium text-[#17212F]">Enquiry category</label>
                  <select id="contact-category" name="category" required defaultValue="" className="w-full rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F]">
                    <option value="" disabled>Select a topic</option>
                    <option>Product information</option>
                    <option>Agency workspace</option>
                    <option>Independent agent workspace</option>
                    <option>Landlord and property management</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[#17212F]">Message</label>
                  <textarea id="contact-message" name="message" rows={5} required className="w-full resize-y rounded-xl border border-[#E5EAF0] bg-[#F9FBFC] px-3.5 py-3 text-sm text-[#17212F] placeholder:text-[#8A96A5]" placeholder="How can we help?" />
                </div>
                <button type="submit" className="brand-button-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white">
                  Preview submission state <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-xs leading-5 text-[#667085]">Submitting this preview only confirms that no backend is connected. It does not submit your message.</p>
              </form>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
