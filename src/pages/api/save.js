export const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { pageId, layouts, theme } = body;

    const DB = locals.runtime.env.DB;
    if (!DB) {
      return new Response(JSON.stringify({ error: 'DB binding not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!pageId) {
      return new Response(JSON.stringify({ error: 'pageId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Update Page Theme settings
    await DB.prepare('UPDATE pages SET theme_json = ? WHERE id = ?')
      .bind(JSON.stringify(theme), pageId)
      .run();

    // 2. Clear old widgets for this page and insert new layout positions
    // (This is a simplified overwrite strategy for saving layout items)
    await DB.prepare('DELETE FROM widgets WHERE page_id = ?').bind(pageId).run();

    const stmt = DB.prepare(
      'INSERT INTO widgets (id, page_id, type, grid_x, grid_y, grid_w, grid_h, config_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    // Usually `layouts.lg` lists boxes containing item positions: { i, x, y, w, h }
    const batchOps = (layouts?.lg || []).map(box => {
      const widgetId = crypto.randomUUID();
      return stmt.bind(
        widgetId,
        pageId,
        box.i, // box.i is the widget ID / Type identifier
        box.x,
        box.y,
        box.w,
        box.h,
        JSON.stringify({ customConfig: {} })
      );
    });

    if (batchOps.length > 0) {
      await DB.batch(batchOps);
    }

    return new Response(JSON.stringify({ success: true, message: 'Saved successfully!' }), {
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
