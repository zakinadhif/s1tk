import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMdxFiles(full));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

export function findCycle(graph: Record<string, string[]>): string[] | null {
  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string, path: string[]): string[] | null {
    if (stack.has(node)) return [...path, node];
    if (visited.has(node)) return null;
    visited.add(node);
    stack.add(node);
    for (const neighbor of graph[node] ?? []) {
      const result = dfs(neighbor, [...path, node]);
      if (result) return result;
    }
    stack.delete(node);
    return null;
  }

  for (const node of Object.keys(graph)) {
    const cycle = dfs(node, []);
    if (cycle) return cycle;
  }
  return null;
}

async function main() {
  const contentDir = join(process.cwd(), 'src', 'content');
  const files = await collectMdxFiles(contentDir);

  const graph: Record<string, string[]> = {};

  for (const file of files) {
    const raw = await readFile(file, 'utf-8');
    const { data } = matter(raw);
    const slug = file
      .replace(contentDir + '\\', '')
      .replace(contentDir + '/', '')
      .replace(/\\/g, '/')
      .replace(/\.mdx?$/, '')
      .split('/')
      .at(-1) ?? '';

    graph[slug] = Array.isArray(data.prereq) ? data.prereq : [];
  }

  // Warn about prereqs referencing non-existent slugs
  const allSlugs = new Set(Object.keys(graph));
  for (const [slug, prereqs] of Object.entries(graph)) {
    for (const prereq of prereqs) {
      if (!allSlugs.has(prereq)) {
        console.warn(`  warn: "${slug}" references unknown prereq "${prereq}"`);
      }
    }
  }

  const cycle = findCycle(graph);
  if (cycle) {
    console.error('  error: Cycle detected in prereq graph:');
    console.error('  ' + cycle.join(' → '));
    process.exit(1);
  }

  console.log(`  ok: Prereq graph is acyclic (${Object.keys(graph).length} topics checked).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
