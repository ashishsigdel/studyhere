"use client";
import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-gray-800 dark:text-gray-200">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: May 2025
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Your privacy is important to us. This Privacy Policy describes how we
          collect, use, and safeguard your data while you use our platform.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>OAuth Authentication:</strong> Name, email, profile picture,
            and ID from Google or GitHub.
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, actions taken, and
            session duration.
          </li>
          <li>
            <strong>Cookies:</strong> For login sessions and interface
            preferences.
          </li>
        </ul>
      </section>

      {/* How We Use Info */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Authenticate and manage user sessions.</li>
          <li>Improve and personalize your experience.</li>
          <li>Detect and prevent unauthorized access.</li>
        </ul>
      </section>

      {/* IP Tracking */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. IP Address Tracking</h2>
        <p>
          We may log your IP address to monitor for unusual activity or abuse.
          This helps us protect our platform and its users.
        </p>
      </section>

      {/* LocalStorage */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Local Storage Usage</h2>
        <p>
          We may use browser localStorage to temporarily store user preferences
          or session data. This is used solely to improve performance and reduce
          server requests.
        </p>
      </section>

      {/* OAuth & Third-Party */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          6. OAuth & Third-Party Services
        </h2>
        <p>
          We use Google and GitHub OAuth to authenticate users. We do not store
          your password—only authentication tokens securely.
        </p>
        <p>Refer to their privacy policies for more info:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub Privacy Policy
            </a>
          </li>
        </ul>
      </section>

      {/* Cookies */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Cookies</h2>
        <p>
          Cookies are used to manage login sessions and basic preferences. You
          may disable cookies, but the app may not function fully.
        </p>
      </section>

      {/* Your Rights */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">8. Your Rights</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Access, edit, or delete your data.</li>
          <li>
            Revoke permissions via your Google or GitHub account settings.
          </li>
          <li>Request a copy of stored data.</li>
        </ul>
      </section>

      {/* Changes */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">9. Updates to This Policy</h2>
        <p>
          We may revise this policy. Updates will be posted on this page with
          the updated date.
        </p>
      </section>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Have questions?{" "}
        <Link
          href="https://ashishsigdel.com.np/contact"
          className="text-blue-500 hover:underline"
        >
          Contact us
        </Link>
        .
      </div>
    </div>
  );
}
