"use client";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
      <p className="text-center">Last updated: February 2025</p>

      <section>
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to our website. Your privacy is important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>OAuth Authentication:</strong> When you log in using
            **Google or GitHub**, we may receive your **name, email, profile
            picture, and unique ID** from the provider.
          </li>
          {/* <li>
            <strong>Personal Information:</strong> If you choose to provide
            additional details, such as your username or preferences.
          </li> */}
          <li>
            <strong>Usage Data:</strong> Information about your interactions
            with our platform, such as visited pages and actions taken.
          </li>
          <li>
            <strong>Cookies & Tracking:</strong> We use cookies to enhance your
            experience and remember your login session.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          3. How We Use Your Information
        </h2>
        <p>We use your data to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Authenticate and manage your account using Google or GitHub OAuth.
          </li>
          <li>Provide and improve our services.</li>
          <li>Enhance security and prevent unauthorized access.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          4. OAuth & Third-Party Services
        </h2>
        <p>
          We use **Google and GitHub OAuth** for authentication. When you sign
          in, these services may share your **name, email, and profile picture**
          with us. We do **not store your passwords** and only use the
          authentication tokens provided.
        </p>
        <p>For more details, check their privacy policies:</p>
        <ul className="list-disc list-inside">
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

      <section>
        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          We use cookies to remember your login session. You can disable cookies
          in your browser settings, but some features may not work properly.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access, update, or delete your personal data.</li>
          <li>Revoke OAuth permissions from Google or GitHub at any time.</li>
          <li>Request a copy of the data we hold about you.</li>
        </ul>
        <p>
          To remove access, visit your **Google** or **GitHub account settings**
          and revoke permissions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page.
        </p>
      </section>
    </div>
  );
}
