// Dummy worker to satisfy Cloudflare Builds CI check
// This project is a static site (SPA), so this worker is not actively used for serving the app.

export default {
  fetch(): Response {
    return new Response('HydroLearning LMS - Static Site');
  },
};
