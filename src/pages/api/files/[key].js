export const GET = async ({ params, locals }) => {
  try {
    const { key } = params;

    const IMAGES_BUCKET = locals.runtime.env.IMAGES_BUCKET;
    if (!IMAGES_BUCKET) {
      return new Response('R2 Bucket not found', { status: 500 });
    }

    const object = await IMAGES_BUCKET.get(key);
    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    // Prepare headers for the response
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    // Return the body stream
    return new Response(object.body, {
      headers
    });

  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
