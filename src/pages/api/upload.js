export const POST = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const IMAGES_BUCKET = locals.runtime.env.IMAGES_BUCKET;
    if (!IMAGES_BUCKET) {
      return new Response(JSON.stringify({ error: 'R2 Bucket binding not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a unique key for the file
    const fileExtension = file.name.split('.').pop();
    const key = `${crypto.randomUUID()}.${fileExtension}`;

    // Convert File to ArrayBuffer to PUT into R2
    const buffer = await file.arrayBuffer();

    await IMAGES_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: file.type,
      }
    });

    // In local development, returning a relative view or simulation URL:
    // Cloudflare Pages usually supports serving R2 via custom subdomains or worker binds dashboards.
    // For simplicity, we return the key or simulated local URL.
    const url = `/api/files/${key}`;

    return new Response(JSON.stringify({ success: true, url, key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
