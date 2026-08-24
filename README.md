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

## Module 8: Final Journal

### Architecture

This project is built on the **MEAN stack**, split across three separate trees that each handle a different job:

- **`app_server`** is the customer-facing site. It's an Express app that renders most pages as static HTML/CSS served straight out of `public/` (about, contact, meals, news, rooms), but the home and travel pages were converted to **Handlebars (`hbs`)** templates so they could pull trip data in at render time instead of being hard-coded.
- **`app_api`** is a pure REST API — Express routes call controllers, which talk to Mongoose models, which talk to MongoDB. It never renders HTML; every response is a JSON body with an HTTP status code.
- **`app_admin`** is a completely separate **Angular 17** single-page application. It doesn't share a server process with `app_server` or `app_api` — it runs on its own (`ng serve`, port 4200) and calls `app_api` cross-origin, which is why CORS had to be explicitly opened up on the `/api` routes.

Comparing these three approaches side by side: static HTML is the simplest but completely inert — there's no way to reflect a database change without editing the file. Handlebars is a middle ground — the server injects data into the page before sending it, so the content is dynamic, but every update still means a full page reload. Angular is the most capable of the three: it fetches JSON asynchronously and re-renders just the piece of the DOM that changed, which is what makes the admin trip-listing/add-trip/edit-trip experience feel like an app rather than a website — but that power costs a whole second build/deploy target and a network boundary (CORS, auth headers) that the other two don't have to think about.

**Why MongoDB?** The MEAN stack was the constraint I was building inside, so a JavaScript-native database made sense end to end. More specifically, MongoDB's document model is a natural fit for something like a trip listing — each trip is really just a self-contained record (code, name, dates, price, images) rather than something that needs to be normalized across many relational tables. The tradeoff is that Mongo's schema flexibility means the database itself won't stop you from inserting bad data — so I leaned on **Mongoose** (`app_api/models/travlr.js`, `user.js`) to enforce required fields, types, and uniqueness at the application layer instead of the database layer.

### Functionality

**JSON vs. JavaScript:** JSON (JavaScript Object Notation) looks like JavaScript object-literal syntax, but it's actually a much smaller, language-agnostic *data format* — no functions, no comments, keys must be double-quoted strings, and it can't contain anything that isn't data. JavaScript, by contrast, is a full programming language. That distinction is exactly why JSON works as the glue between my frontend and backend: `app_api` doesn't know or care that Angular is on the other end of the request, and Angular doesn't know or care that Express and MongoDB are behind `app_api` — both sides only have to agree on the shape of the JSON. Express sends it with `res.status(...).json(...)`, and Angular's `HttpClient` deserializes it straight into TypeScript objects/interfaces (`TripDataService`) without either side needing to know the other's implementation details.

Concretely, the API surface looks like this:

| Method | URL | Auth required | Controller |
|---|---|---|---|
| GET | `/api/trips` | no | `tripsList` |
| GET | `/api/trips/:tripCode` | no | `tripsFindByCode` |
| POST | `/api/trips` | **JWT** | `tripsAddTrip` |
| PUT | `/api/trips/:tripCode` | **JWT** | `tripsUpdateTrip` |
| DELETE | `/api/trips/:tripCode` | **JWT** | `tripsDeleteTrip` |
| POST | `/api/register` | no | `register` |
| POST | `/api/login` | no | `login` |

**Refactoring examples:**

- **Module 1 → Module 4:** Originally the site was just `app_server` rendering static/Handlebars pages. I pulled all the data access out into a brand-new `app_api` tier (`controllers` / `models` / `routes`), which decoupled "serving a webpage" from "reading and writing trip data" — a change that made it possible to add the Angular admin app later without touching the customer-facing site at all.
- **Module 4 → Module 6:** Adding `app_admin` exposed two things the earlier code hadn't needed to handle: CORS (every HTTP verb had to be explicitly whitelisted, not just the origin) and a date-format mismatch, since MongoDB stores full datetime strings but an HTML `<input type="date">` expects a plain date — I added a small conversion step rather than pushing that formatting problem into the database layer.
- **Module 6 → Module 7:** Rather than rewriting the trips routes, I added `passport.js`, an `authentication` controller, a `user` model, and an `authenticateJWT` middleware, then wrapped just the POST/PUT/DELETE routes with it. The public GET routes and their existing behavior didn't change at all — the auth layer sits on top of the existing structure instead of replacing it.

The Software Design Document's design-constraints section actually calls this out directly: the architecture was built with room to grow (it documents broader classes like `Travel_Agent` and booking that aren't implemented yet) so that later features wouldn't force a rewrite — the Module 6 and 7 additions are a real example of that plan playing out.

### Testing

My rule of thumb, which I wrote down for myself early and stuck to for the rest of the project: **never trust the Angular side until the API endpoint has already worked on its own.** In practice that meant hitting the raw endpoint with Postman/curl first, confirming the status code and JSON body, and checking the record directly in MongoDB — only after that would I wire the same endpoint into an Angular form or button. That discipline caught the CORS and date-formatting bugs mentioned above before they had a chance to look like "the Angular code is broken," when the real problem was upstream.

Testing authentication added its own layer on top of that: I verified protected routes independently for all three cases — a request with no token (expect 401), a request with a bad/expired token (expect 401), and a request with a valid token (expect success) — all through Postman before ever testing through the logged-in SPA. That separation mattered because a bug in the UI can *look* like an auth bug (e.g., a button that should be hidden showing up anyway) when it's really two independent things that both have to be checked: whether the interface hides privileged actions from a logged-out user, and whether the API itself actually rejects an unauthenticated request regardless of what the UI shows.

The most instructive testing/deployment difficulty I ran into wasn't in the auth code at all — it was environment packaging. My Module 4 submission was graded 14/100, and my Module 7 submission initially failed grading too, both times because the `node_modules` folder I zipped up had been built on Linux and included native binaries that don't exist on Windows. The grader's machine couldn't even boot the app, so the actual login flow, JWT handling, and protected endpoints were never evaluated — only the packaging was. It was a good, if frustrating, reminder that "the code works on my machine" and "the code is testable by someone else" are two different bars, especially once native dependencies are involved.

### Reflection

This course took me from a server that only knew how to render a page to a full three-tier application with a real authentication boundary between public and privileged actions — and most of what stuck with me wasn't the syntax of any one framework, it was the discipline around it: testing an API endpoint in isolation before trusting a UI built on top of it, treating "it works on my machine" as an unproven claim until it's been packaged and run somewhere else, and designing a data layer with room to grow instead of bolting features on reactively. Those are habits that transfer directly to any full stack work I do next, regardless of whether the next project happens to be MEAN, or something else entirely.

Working across Express, MongoDB/Mongoose, and Angular in the same project also gave me a much clearer sense of where responsibility should live in a full stack app — validation at the Mongoose layer instead of hoping the database enforces it, authorization at the API layer instead of hoping the UI hides it well enough, and JSON as the one contract both sides have to agree on so neither one needs to know how the other is implemented. Between the working Travlr Getaways codebase, the Software Design Document, and this journal, I think this project is a genuinely strong piece of my portfolio — it shows I can take a project from a static site to an authenticated multi-tier application, and that I can debug and reason about problems (like the deployment/packaging issue) that go beyond just writing application code.
