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
- `public/` — static site assets (HTML, CSS, images, javascripts) served by Express

## Module 2: MVC Refactor

Refactored the project into an MVC structure. Static HTML content and Express route handlers now live under `app_server/`, and the Travel page is rendered dynamically through a controller and an HBS template instead of being served as a static file.

- `app_server/controllers/` — route handler logic (`main.js` for the homepage, `travel.js` for `/travel`)
- `app_server/models/` — reserved for data models (added in a later module)
- `app_server/routes/` — Express routers, wired to their controllers
- `app_server/views/` — Handlebars templates
  - `partials/` — shared `header.hbs` / `footer.hbs` fragments
  - `layouts/` — `layout.hbs` page wrapper

Visiting `/travel` now renders `app_server/views/travel.hbs` dynamically (built from the original `public/travel.html`, with header/footer replaced by Handlebars partials). The original static `public/travel.html` is still present and reachable at `/travel.html`, unchanged.
