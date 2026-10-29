"use client";

import { PageShell, PageMain, PageHero, ProsePanel } from "@/components/page-shell";
import { Shield } from "lucide-react";

const h2 = "mb-2.5 text-lg font-semibold text-foreground";
const h3 = "mb-1.5 mt-4 font-semibold text-foreground";
const link = "text-primary underline-offset-2 hover:underline";

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={Shield}
          accent="primary"
          title="Privacy Policy"
          description="Last updated: October 28, 2026"
        />
        <ProsePanel>
          <div className="space-y-7 text-sm leading-relaxed text-muted-foreground">
            <p>
              This Privacy Policy explains what information Voidforge (the Warframe build planner at
              void-forge.org, the &quot;Service&quot;) collects, how we use, store and share it, and how you can delete it.
              It covers the website, the &quot;Sign in with Google&quot; option and the optional Voidforge Discord bot.
            </p>

            <section>
              <h2 className={h2}>1. Information We Collect</h2>
              <p>Voidforge collects minimal data necessary to operate the Service:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Account Data:</strong> If you sign in via Google OAuth or email/password, we store your name, email address, and profile picture (when provided). Passwords are stored as one-way hashes, not plain text. You may also set a public username, bio, and custom avatar image.</li>
                <li><strong>Build Data:</strong> Weapon, warframe, companion, modular, archwing, and railjack builds you save to the cloud are stored in our database, linked to your account. Public builds and upvote activity may be visible to other users.</li>
                <li><strong>Public Profile Data:</strong> If you set a username, bio, avatar, or publish builds, that information may be visible on your public profile page and in community features such as Discover. Your email address is not displayed on public profile pages.</li>
                <li><strong>Issue Reports:</strong> If you submit a data report, we store the details you provide (item name, issue flags, comments, and optional reporter name). Reports may be linked to your account when you are signed in.</li>
                <li><strong>Email Preferences:</strong> Whether you want to receive the Voidforge newsletter. You can change this at any time (see section 2).</li>
                <li><strong>Discord Link (optional):</strong> If you link your Discord account to use the Voidforge Discord bot, we store your Discord user ID, username, and avatar, plus the Discord access and refresh tokens needed to list the servers you manage (Discord scopes <code>identify</code> and <code>guilds</code>). Bot settings you choose for a server (alert channels, roles, platform, time zone) are stored with that server.</li>
                <li><strong>Supporter Donations:</strong> If you donate through Buy Me a Coffee, Buy Me a Coffee sends us the supporter email address, the amount, and the event type so we can show a Supporter badge on a matching account.</li>
                <li><strong>Player Sync:</strong> If you use Player Sync, the in-game name and platform you enter are sent to Digital Extremes&apos; public Warframe Arsenal service to fetch your loadout. We do not store the name or the result on our servers; the imported loadout is saved in your browser.</li>
                <li><strong>Local Storage:</strong> If you use Voidforge without signing in, builds and loadouts may be stored in your browser&apos;s local storage. We do not have access to this data.</li>
                <li><strong>Technical Data:</strong> We may temporarily process IP addresses and request metadata for rate limiting, abuse prevention, and security (for example, limiting report submissions).</li>
              </ul>
            </section>

            <section>
              <h2 className={h2}>2. How We Use Your Information</h2>
              <ul className="list-inside list-disc space-y-1">
                <li>To authenticate your identity and provide account features</li>
                <li>To store and retrieve your saved builds and loadouts</li>
                <li>To display your profile information (name, avatar, username, bio) within the app and on public profile pages where applicable</li>
                <li>To operate community features such as public build discovery and upvotes</li>
                <li>To review and respond to data issue reports you submit</li>
                <li>To enforce community standards, including moderation actions such as hiding public content or banning accounts that violate our Terms</li>
                <li>To send you emails about your account: sign-up verification codes and, when a moderator chooses to notify you, a notice that one of your builds was removed or an update on a report you filed</li>
                <li>To send the Voidforge newsletter (site news and updates). Every newsletter includes a one-click unsubscribe link, and you can turn it off in Profile → Settings</li>
                <li>To run the Discord bot features you set up, if you link Discord</li>
              </ul>
              <p className="mt-2">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              <p className="mt-2">We do not show advertising, and we do not use your information for advertising, profiling, or to train artificial intelligence or machine learning models.</p>
            </section>

            <section>
              <h2 className={h2}>3. Google User Data</h2>
              <p>This section describes exactly how Voidforge handles data it receives when you choose &quot;Sign in with Google&quot;.</p>

              <h3 className={h3}>What we access</h3>
              <p>
                We request only the basic sign-in scopes <code>openid</code>, <code>email</code> and <code>profile</code>. From
                Google we receive your Google account ID, your name, your email address, and the URL of your Google profile
                picture. We do not request access to your Gmail, Google Drive, Calendar, Contacts, or any other Google service.
              </p>

              <h3 className={h3}>How we use it</h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Your Google account ID links your Google sign-in to your Voidforge account so you can sign in again.</li>
                <li>Your email address identifies your account and is used for the account emails and the newsletter described in section 2 (you can opt out of the newsletter at any time).</li>
                <li>Your name and profile picture are used as your display name and avatar if you have not set your own. Your email address is never shown publicly.</li>
              </ul>

              <h3 className={h3}>How we store it</h3>
              <p>
                Your Google account ID, name, email address and profile picture URL are stored in our database with your
                Voidforge account. Google&apos;s sign-in token is used once, at sign-in, to read this profile information; we do
                not store Google access or refresh tokens.
              </p>

              <h3 className={h3}>How we share it</h3>
              <p>
                We do not sell, rent, or transfer Google user data to anyone, and we do not use it for advertising. It is shared
                only as needed to run the Service: your email address is passed to our email delivery provider (Resend) when we
                send you an email, and your name and avatar appear on your public profile and builds if you publish them. We may
                also disclose information if required by law.
              </p>

              <h3 className={h3}>How to delete it</h3>
              <p>
                Deleting your account (section 5) deletes your Google sign-in link and the Google profile data stored with it.
                You can also remove Voidforge&apos;s access at any time from your Google Account at{" "}
                <a href="https://myaccount.google.com/permissions" className={link} target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
              </p>

              <h3 className={h3}>Limited Use</h3>
              <p>
                Voidforge&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                <a href="https://developers.google.com/terms/api-services-user-data-policy" className={link} target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>,
                including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className={h2}>4. Cookies and Local Storage</h2>
              <p>
                Voidforge uses session cookies for authentication and browser local storage for saving builds and
                loadouts offline. We do not use tracking cookies or third-party analytics services.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><code>framehub_session</code>: keeps you signed in. It is a signed, HTTP-only cookie that expires after 30 days or when you sign out.</li>
                <li><code>oauth_state</code>, <code>discord_oauth_state</code>, <code>discord_oauth_uid</code>: short-lived security cookies used only while you sign in with Google or link Discord (removed when that finishes; the Discord ones expire after 10 minutes).</li>
                <li>Local storage also keeps display preferences such as theme and mode, and Player Sync preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className={h2}>5. Data Retention</h2>
              <p>
                Your account and build data are retained as long as your account is active.
                You can delete individual builds from your profile page at any time and remove your custom avatar
                from profile settings. Issue reports are retained so staff can track corrections and follow up when needed.
                You can permanently delete your entire account from Profile → Settings → Danger Zone
                (cloud builds and linked Discord data are removed; local browser builds are not).
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Deleting your account also deletes your Google or other sign-in links, your sessions, and your upvotes.</li>
                <li>Issue reports you filed and donation records are kept after account deletion but are no longer linked to your account. Donation records keep the email address Buy Me a Coffee sent us.</li>
                <li>Email verification codes expire after 10 minutes and are deleted when used.</li>
                <li>Rate-limiting data (such as IP addresses) is held only in server memory for the length of the limit window and is not written to our database.</li>
              </ul>
            </section>

            <section>
              <h2 className={h2}>6. Data Security</h2>
              <p>
                We use industry-standard security measures including encrypted connections (HTTPS)
                and secure authentication via OAuth 2.0. However, no method of electronic transmission
                or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p className="mt-2">
                Passwords are hashed with PBKDF2 and a unique salt. Session cookies are signed and HTTP-only. Within
                Voidforge, account email addresses are visible only to staff (moderators and admins) through the moderation tools.
              </p>
            </section>

            <section>
              <h2 className={h2}>7. Third-Party Services</h2>
              <p>
                Voidforge uses Google OAuth and optional email/password authentication. Google sign-in is subject to
                Google&apos;s Privacy Policy and Terms of Service. We only receive the profile information
                you authorize Google to share with us. Optional donations through Buy Me a Coffee are handled by
                Buy Me a Coffee under their own terms and privacy policies; we do not receive your payment credentials.
                If your donation email matches your verified Voidforge account, we may display a cosmetic Supporter
                badge on your profile.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Resend</strong> delivers our emails and receives the recipient address and message content.</li>
                <li><strong>Cloudflare</strong> carries traffic to void-forge.org, so it processes connection data such as IP addresses.</li>
                <li><strong>Discord</strong> handles the Discord account link and bot, under Discord&apos;s own privacy policy.</li>
                <li><strong>Digital Extremes</strong> (the Warframe Arsenal service) receives the in-game name you enter in Player Sync.</li>
                <li>Google profile pictures are loaded from Google&apos;s image servers.</li>
              </ul>
            </section>

            <section>
              <h2 className={h2}>8. Children&apos;s Privacy</h2>
              <p>
                Voidforge is not directed at children under the age of 13. We do not knowingly collect
                personal information from children under 13. If you believe a child has provided us
                with personal information, please contact us so we can delete it.
              </p>
            </section>

            <section>
              <h2 className={h2}>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of significant
                changes by updating the &quot;Last updated&quot; date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className={h2}>10. Contact</h2>
              <p>
                If you have questions about this Privacy Policy or your data, please use the{" "}
                <a href="/report-issue" className={link}>Report Issue</a> page.
              </p>
            </section>
          </div>
        </ProsePanel>
      </PageMain>
    </PageShell>
  );
}
