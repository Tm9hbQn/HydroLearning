export default {
  async fetch(request: Request, _env: unknown, _ctx: unknown): Promise<Response> {
    // This is a dummy worker to satisfy Cloudflare CI checks.
    // The application is deployed via GitHub Pages.
    console.log(request.url);
    return new Response("HydroLearning Worker Active");
  },
};
