# The Crafted Pixels — contact page

Minimal contact page with a centered form, highlighted social links with logos, and only the brand name in the top-left. No extra marketing copy, Home link, footer, or page heading.

## Add to your Vite project
1. Back up your current files.
2. Copy the included `index.html` into the project root. Its existing Contact Us link points to `./contact.html`.
3. Copy `contact.html` into the project root, `css/contact.css` into `css/`, and `js/contact.js` into `js/`.
4. Put your background image in the project root and name it `background.jpg`. Or change `url('../background.jpg')` in `css/contact.css` to your actual image path.
5. In `contact.html`, replace `yourusername`, `91YOURNUMBER` (country code and digits only), and `yourprofile` with your actual social links.
6. In `js/contact.js`, replace `YOUR_EMAIL@example.com` with the inbox you want enquiries sent to.
7. Run `npm run dev` and click Contact Us from the homepage.

## Form behavior
The form opens the visitor's default email application with the message filled in. It does not directly send/store submissions. A form service or backend is needed for direct web submission.
