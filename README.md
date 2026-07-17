# Travlr Getaways

CS-465 Full Stack Development I — Travlr Getaways full stack web application, built module by module throughout the course.

## Module 1: Static Website Shell

A working shell of the customer-facing Travlr Getaways site, built with Node.js and the Express framework. Express serves the static HTML mockup pages from the `public` folder.

### Setup

```
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in a browser.

### Project Structure

- `app.js` — Express application setup
- `bin/www` — server entry point
- `routes/` — Express route handlers
- `views/` — Handlebars (hbs) view templates
- `public/` — static site assets (HTML, CSS, images, javascripts) served by Express
