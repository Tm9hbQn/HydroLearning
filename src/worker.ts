// Dummy worker to satisfy Cloudflare Builds CI check
// This project is a static site (SPA), so this worker is not actively used for serving the app.

export default {
  async fetch(_request: Request, _env: any, _ctx: any): Promise<Response> {
    return new Response('HydroLearning LMS - Static Site');
  },
};
