# Voidforge cutover runbook

Canonical site: **https://void-forge.org**  
Legacy domain (keep redirecting while you own it): **https://frame-hub.com**  
GitHub: **https://github.com/StepTwo33/VoidForge**

Do Cloudflare + server steps in this order. The app already 301s `frame-hub.com` → `void-forge.org` if the old host ever hits Next; **Cloudflare Redirect Rules are still the primary path**.

---

## 0. Update git remotes (laptop + Fedora)

```bash
git remote set-url origin https://github.com/StepTwo33/VoidForge.git
git fetch origin
```

---

## A. Cloudflare: void-forge.org (new zone)

1. Add site `void-forge.org` and switch nameservers at the registrar.
2. **SSL/TLS**
   - Encryption mode: **Full (strict)**
   - Edge Certificates → **Always Use HTTPS**: On
   - Edge Certificates → **HSTS**: enable (start with 6–12 months; include subdomains only if all HTTPS)
3. **Tunnel** (pick one)

### Option A — reuse existing tunnel `frame-hub`
1. Zero Trust → Networks → Tunnels → `frame-hub` → Public Hostname
2. Add:
   - `void-forge.org` → `http://localhost:3000`
   - `www.void-forge.org` → `http://localhost:3000`
3. On the server, keep your existing config file or copy it:
   ```bash
   cp ~/.cloudflared/config-framehub.yml ~/.cloudflared/config-voidforge.yml
   # edit ingress hostnames to void-forge.org / www
   ```
4. In server `.env` (if still using the old tunnel name):
   ```bash
   CLOUDFLARED_CONFIG=$HOME/.cloudflared/config-voidforge.yml
   CLOUDFLARED_TUNNEL=frame-hub
   ```

### Option B — new tunnel `void-forge`
```bash
cloudflared tunnel login
cloudflared tunnel create void-forge
# note credentials JSON path under ~/.cloudflared/
```
Example `~/.cloudflared/config-voidforge.yml`:
```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /home/<you>/.cloudflared/<TUNNEL_UUID>.json

ingress:
  - hostname: void-forge.org
    service: http://localhost:3000
  - hostname: www.void-forge.org
    service: http://localhost:3000
  - service: http_status:404
```
```bash
cloudflared tunnel route dns void-forge void-forge.org
cloudflared tunnel route dns void-forge www.void-forge.org
```
Server `.env`:
```bash
CLOUDFLARED_CONFIG=$HOME/.cloudflared/config-voidforge.yml
CLOUDFLARED_TUNNEL=void-forge
```

4. DNS: `@` and `www` should be **proxied** CNAMEs to the tunnel (Cloudflare usually creates these via `tunnel route dns`).

---

## B. Cloudflare: frame-hub.com (redirect only)

1. Keep the `frame-hub.com` zone active.
2. **Rules → Redirect Rules → Create rule**
   - If: Hostname equals `frame-hub.com` OR `www.frame-hub.com`
   - Then: Dynamic redirect to  
     `concat("https://void-forge.org", http.request.uri.path)`  
     Status: **301**  
     Preserve query string: **On**
3. Remove / stop pointing the old domain’s tunnel public hostname at the Next app once the redirect rule is live (avoids split-brain).

Quick check:
```bash
curl -sI https://frame-hub.com/warframe-builder | head
# expect: 301 Location: https://void-forge.org/warframe-builder
```

---

## C. Email (Resend)

1. In Resend, add/verify domain **void-forge.org** (DKIM + SPF as they show).
2. DNS TXT for DMARC:
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:support@void-forge.org; fo=1`
3. Server `.env`:
   ```bash
   EMAIL_FROM_SUPPORT=Voidforge <support@void-forge.org>
   EMAIL_FROM_NEWSLETTER=Voidforge News <news@void-forge.org>
   ```
4. Optional: keep Cloudflare Email Routing for `support@frame-hub.com` so old mail still arrives while people update bookmarks.

---

## D. OAuth consoles

### Google Cloud OAuth
Add authorized redirect URI:
- `https://void-forge.org/api/auth/callback`  
Keep the old `frame-hub.com` URI until redirects-only, then remove it.

### Discord Developer Portal
OAuth2 redirect:
- `https://void-forge.org/api/bot/discord/callback`

---

## E. Server `.env` + deploy

```bash
AUTH_URL=https://void-forge.org
NEXT_PUBLIC_APP_URL=https://void-forge.org
PUBLIC_DOMAIN=https://void-forge.org
TRUSTED_HOSTS=void-forge.org,www.void-forge.org
FRAMEHUB_MAINTAINER=1
# or: VOIDFORGE_MAINTAINER=1

# Tunnel (see section A)
# CLOUDFLARED_CONFIG=$HOME/.cloudflared/config-voidforge.yml
# CLOUDFLARED_TUNNEL=void-forge   # or frame-hub if reusing

EMAIL_FROM_SUPPORT=Voidforge <support@void-forge.org>
EMAIL_FROM_NEWSLETTER=Voidforge News <news@void-forge.org>
```

Then:
```bash
cd /path/to/VoidForge   # or your clone path
git remote set-url origin https://github.com/StepTwo33/VoidForge.git
git fetch origin
./scripts/deploy.sh dev
# restart app (and bot if used)
./start.sh
# or: systemctl restart <your-unit>
```

---

## F. Smoke checks

- [ ] `https://void-forge.org` loads; header/footer say **Voidforge**
- [ ] `https://frame-hub.com/warframe-builder` → 301 → `https://void-forge.org/warframe-builder`
- [ ] Sign-in (Google + email) works
- [ ] Share / community build links use void-forge.org
- [ ] Discord bot OAuth callback works
- [ ] Test email send (verification or newsletter test)
- [ ] Header GitHub link → `StepTwo33/VoidForge`
- [ ] Update Modbird RSS URLs to:
  - `https://void-forge.org/feeds/builds-recent.xml`
  - `https://void-forge.org/feeds/builds.xml`
  - `https://void-forge.org/feeds/updates.xml`

---

## G. After go-live

- Update Discord channel topics / invites that still say Frame Hub
- Re-run Cloudflare security scan on **void-forge.org**
- Leave frame-hub.com redirects until you are ready to drop the domain

### Notes on sessions / offline builds
Cookie `framehub_session` and `framehub_*` localStorage keys were **not** renamed on purpose, so signed-in users and offline builds keep working after the hostname change (same browser profile still sees host-only cookies only for the host that set them — users who only used frame-hub.com will need to sign in once on void-forge.org; local builds stay in that browser’s storage for the origin that created them).
