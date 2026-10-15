# Jason Mensching Portfolio

Static site: plain HTML, CSS and JavaScript. No build step, no dependencies.

```
index.html
assets/
  Jason-Mensching-CV.pdf   <- your CV (the Download buttons point here)
  favicon.svg
  css/styles.css
  js/main.js
.nojekyll
```

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish on GitHub Pages
1. Create a new repository on GitHub (for example `jason-portfolio`). Public is required on the free plan.
2. Upload everything in this folder to the repository root, including the `assets` folder and the hidden `.nojekyll` file. Easiest way: on the repo page choose **Add file > Upload files** and drag the folder contents in, then commit.
3. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. Wait 1 to 2 minutes. Your site will be at `https://YOUR-USERNAME.github.io/jason-portfolio/`.
5. Open it, click **Download My CV**, and confirm the PDF opens.

All asset paths are relative, so it works in a repository subpath with no extra configuration.

## Things you can edit
- **Availability label:** in `index.html`, search for `id="availability"`.
- **LinkedIn / OnlineJobs.ph links:** at the top of `assets/js/main.js`, fill in `linkedin` and `onlinejobs`. They stay hidden until you do.
- **Updated CV:** replace `assets/Jason-Mensching-CV.pdf` with the new file under the same name.

## Making the contact form deliver messages
GitHub Pages is static hosting, so it cannot receive form submissions. Until you connect a service, the form validates the entry and then opens the visitor's email app with the message prepared (the visitor still has to press send).

To deliver submissions straight to your inbox:
1. Create a free form endpoint with a service such as Formspree (https://formspree.io) and verify your email.
2. Copy the endpoint URL (it looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `formEndpoint` at the top of `assets/js/main.js`.
4. Commit the change, then send a test message from the live site.
