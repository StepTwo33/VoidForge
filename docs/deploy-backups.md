# Off-site database backups (Google Drive)

Every deploy already writes a local SQLite backup to `db-backups/dev.db.<timestamp>.bak`
in the repo on the server. `scripts/deploy.sh` also uploads that same file to an
**rclone remote** (Google Drive, or anything else rclone supports) and keeps the
newest 14 copies there.

**Nothing sensitive lives in this repo.** The Drive login is stored only in the
server user's own rclone config file (`~/.config/rclone/rclone.conf`), which is
never committed. The script reads just two settings from the environment:

| Variable | Default | Meaning |
| --- | --- | --- |
| `VOIDFORGE_BACKUP_REMOTE` | `gdrive` | Name of the rclone remote to use |
| `VOIDFORGE_BACKUP_FOLDER` | `Voidforge-backups` | Folder on that remote |

Off-site backup is best-effort: if rclone is missing, the remote isn't configured,
or the upload fails, the script prints a warning and **the deploy still completes**.
The local backup in `db-backups/` is always made regardless.

## One-time setup on the server

Run these as the same user the app runs as (**jason**), because systemd uses that
user's rclone config.

1. **Install rclone.** Use your distro package or the official installer from
   <https://rclone.org/install/>, then check `rclone version`.

2. **Create the Google Drive remote:**
   ```
   rclone config
   ```
   Choose `n` (new remote), name it `gdrive`, storage type `drive` (Google Drive),
   and follow the prompts. The defaults are fine; when it offers to open a browser
   to sign in, complete the Google sign-in as yourself. If the server has no
   browser, rclone prints a command to run on a machine that does, and you paste
   the result back. Finish with `q`.

3. **Check it works:**
   ```
   rclone listremotes          # should print: gdrive:
   rclone lsd gdrive:          # should list your Drive folders
   rclone mkdir gdrive:Voidforge-backups
   ```

4. **Tell the app about it.** If you used the name `gdrive` and the default
   folder, nothing needs setting. Otherwise add the variables to the systemd
   unit with an override:
   ```
   sudo systemctl edit framehub
   ```
   ```ini
   [Service]
   Environment=VOIDFORGE_BACKUP_REMOTE=gdrive
   Environment=VOIDFORGE_BACKUP_FOLDER=Voidforge-backups
   ```
   Then `sudo systemctl daemon-reload`.
   (Only needed if you changed the names. `/etc/default/framehub` works too if
   the unit has `EnvironmentFile=/etc/default/framehub`. deploy.sh runs in your
   shell, so `export VOIDFORGE_BACKUP_REMOTE=...` before running it also works.
   Don't rely on the repo `.env` for these: deploy.sh doesn't source it.)

5. **Test before the next deploy:**
   ```
   rclone copyto db-backups/<some-existing>.bak gdrive:Voidforge-backups/test.bak
   rclone lsl gdrive:Voidforge-backups
   rclone deletefile gdrive:Voidforge-backups/test.bak
   ```
   Or just run the next deploy and look for the
   `==> Uploading dev.db.<timestamp>.bak to gdrive:Voidforge-backups` line.

## Retention

- Remote: the newest **14** backups are kept; older ones are deleted after each
  successful upload. Change the `keep=14` in `offsite_backup()` if you want more.
- Local: `db-backups/` on the server is not pruned automatically. Delete old
  files by hand every so often.

## Restore

1. Stop the app: `sudo systemctl stop framehub`.
2. List what's available: `rclone lsl gdrive:Voidforge-backups`.
3. Download the copy you want:
   ```
   rclone copyto gdrive:Voidforge-backups/dev.db.<timestamp>.bak /home/jason/dev-restore.db
   ```
4. Back up the current DB first (`cp dev.db dev-before-restore.db`), then replace
   it with the restored file, keeping the same path/owner the app expects.
5. Start the app: `sudo systemctl start framehub`, and check the site.

If the database file lives somewhere other than `./dev.db`, use the path from
`DATABASE_URL` in the server `.env`.
