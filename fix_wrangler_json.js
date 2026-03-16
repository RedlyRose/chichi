import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'dist', 'server', 'wrangler.json');

if (fs.existsSync(filePath)) {
  console.log('Fixing wrangler.json for Cloudflare Pages compatibility...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 1. Remove ASSETS binding conflict
  delete data.assets;

  // 2. Clear KV namespaces (the anonymous SESSION causes errors on Pages)
  data.kv_namespaces = [];

  // 3. Remove triggers object which confuses the Pages parser
  delete data.triggers;

  // 4. Remove Workers-only keys that trigger Pages validator errors
  delete data.main;
  delete data.rules;
  delete data.no_bundle;

  // 5. Clear other metadata fields that trigger warnings
  delete data.cloudchamber;
  delete data.workflows;
  delete data.queues;
  delete data.dev;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated wrangler.json');
} else {
  console.log('wrangler.json not found, skipping fix.');
}
