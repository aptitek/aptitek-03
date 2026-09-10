import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const pagesDir = path.resolve(projectRoot, 'src', 'pages');

interface PdfTask {
  sourceFile: string;
  route: string;
  outputPdfPath: string;
}

/**
 * Extract frontmatter YAML block and parse basic properties
 */
function parseFrontmatter(content: string): Record<string, string | boolean> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const lines = match[1].split('\n');
  const result: Record<string, string | boolean> = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Strip quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value.toLowerCase() === 'true') {
      result[key] = true;
    } else if (value.toLowerCase() === 'false') {
      result[key] = false;
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Recursively find all MDX and Astro files in src/pages that declare `pdf: true`
 */
function discoverPdfPages(dir: string): PdfTask[] {
  const tasks: PdfTask[] = [];

  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && /\.(mdx|astro)$/i.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter.pdf === true) {
          // Derive route from file path relative to src/pages
          const relPath = path.relative(pagesDir, fullPath);
          const cleanRoute =
            '/' +
            relPath
              .replace(/\.(mdx|astro)$/i, '')
              .replace(/\/index$/, '')
              .replace(/^index$/, '');

          const targetPdf =
            typeof frontmatter.pdfUrl === 'string'
              ? frontmatter.pdfUrl.replace(/^\//, '')
              : `pdf${cleanRoute}.pdf`;

          tasks.push({
            sourceFile: fullPath,
            route: cleanRoute || '/',
            outputPdfPath: targetPdf,
          });
        }
      }
    }
  }

  if (fs.existsSync(dir)) {
    scan(dir);
  }

  return tasks;
}

/**
 * Minimal static HTTP server to serve the dist directory
 */
function startStaticServer(port: number): Promise<http.Server> {
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  const server = http.createServer((req, res) => {
    const reqPath = decodeURI((req.url || '/').split('?')[0]);

    let filePath = path.join(distDir, reqPath);

    // If path is a directory or route without extension, try index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (
      !fs.existsSync(filePath) &&
      fs.existsSync(path.join(filePath, 'index.html'))
    ) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function main() {
  console.log('🔍 Scanning src/pages for MDX pages with `pdf: true`...');
  const tasks = discoverPdfPages(pagesDir);

  if (tasks.length === 0) {
    console.log('ℹ️ No pages with `pdf: true` found. Skipping PDF generation.');
    return;
  }

  console.log(`📄 Found ${tasks.length} page(s) marked for PDF generation:`);
  for (const t of tasks) {
    console.log(`   - Route: ${t.route} -> Output: ${t.outputPdfPath}`);
  }

  if (!fs.existsSync(distDir)) {
    console.error(
      '❌ Error: dist/ directory does not exist. Please run `astro build` before generating PDFs.',
    );
    process.exit(1);
  }

  const port = 4399;
  const server = await startStaticServer(port);
  console.log(`🌐 Static server started at http://127.0.0.1:${port}`);

  console.log('🚀 Launching Playwright Chromium...');
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    for (const task of tasks) {
      console.log(`\n⏳ Rendering PDF for ${task.route}...`);
      const page = await browser.newPage();

      // Navigate to the static page
      const url = `http://127.0.0.1:${port}${task.route}`;
      await page.goto(url, { waitUntil: 'networkidle' });

      // Emulate print media so @media print styles apply
      await page.emulateMedia({ media: 'print' });

      // Target output file paths
      const publicOutput = path.resolve(
        projectRoot,
        'public',
        task.outputPdfPath,
      );
      const distOutput = path.resolve(projectRoot, 'dist', task.outputPdfPath);

      fs.mkdirSync(path.dirname(publicOutput), { recursive: true });
      fs.mkdirSync(path.dirname(distOutput), { recursive: true });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      fs.writeFileSync(publicOutput, pdfBuffer);
      fs.writeFileSync(distOutput, pdfBuffer);

      const sizeKb = (pdfBuffer.byteLength / 1024).toFixed(1);
      console.log(`✅ Saved: ${publicOutput} (${sizeKb} KB)`);
      console.log(`✅ Saved: ${distOutput}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
    console.log('\n🎉 PDF generation completed successfully!');
  }
}

main().catch((err) => {
  console.error('❌ Error during PDF generation:', err);
  process.exit(1);
});
