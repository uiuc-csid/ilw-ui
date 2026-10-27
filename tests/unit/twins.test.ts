// Every Svelte story has a React twin in stories/react/ with the same title,
// story names (so the same ids), tags and description, and ilw-ui/react exports
// what ilw-ui/svelte does (docs/plans/2026-10-27-react-components.md, "Twins
// check"). Stories and exports not ported yet are listed in tests/twins-pending/;
// a port deletes its component's list. Framework-neutral stories and the parity
// Toolkit and Side By Side stories have no twin.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sanitize, storyNameFromExport, toId } from 'storybook/internal/csf';
import { extractDescription, loadCsf } from 'storybook/internal/csf-tools';
import { type AST, parse } from 'svelte/compiler';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { noTwin, readPending } from '../twins.ts';

const root = fileURLToPath(new URL('../..', import.meta.url));
const stories = join(root, 'stories');
const reactStories = join(stories, 'react');

// ilw-ui/svelte exports whose React twin has another name.
const RENAMED: Record<string, string> = { createDataTable: 'useDataTable' };

interface Story {
  id: string;
  exportName: string;
  name: string;
  tags: string[];
  description: string;
}

interface StoryFile {
  /** Repo-relative path. */
  file: string;
  title: string;
  tags: string[];
  stories: Story[];
}

function files(dir: string, suffix: string, skip?: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return path === skip ? [] : files(path, suffix, skip);
    return e.name.endsWith(suffix) ? [path] : [];
  });
}

const repoPath = (path: string) => relative(root, path).split(sep).join('/');

/** A description as addon-docs shows it: common indentation removed, trimmed. */
function dedent(text: string): string {
  const lines = text.split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)![0].length);
  const indent = Math.min(...indents);
  return lines
    .map((l) => l.slice(indent))
    .join('\n')
    .trim();
}

/** addon-svelte-csf's exportName for a story without one: 'Side By Side' → 'SideBySide'. */
function svelteExportName(name: string): string {
  return sanitize(name.replace(/([A-Z])/g, ' $1').trim())
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

type Estree = { type: string; [key: string]: unknown };

function walk(node: unknown, visit: (node: Estree) => void): void {
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === 'object') {
    if (typeof (node as Estree).type === 'string') visit(node as Estree);
    for (const [key, value] of Object.entries(node)) if (key !== 'parent') walk(value, visit);
  }
}

/** A string literal, or an array of them, from an ESTree expression. */
function literal(node: Estree | undefined, what: string): string | string[] {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node?.type === 'ArrayExpression') return (node.elements as Estree[]).map((e) => literal(e, what) as string);
  throw new Error(`${what} must be a string literal or an array of them`);
}

function readSvelte(path: string): StoryFile {
  const file = repoPath(path);
  const ast = parse(readFileSync(path, 'utf8'), { modern: true });
  let meta: Estree | undefined;
  walk(ast.module?.content, (node) => {
    if (node.type === 'CallExpression' && (node.callee as Estree).name === 'defineMeta') meta = (node.arguments as Estree[])[0];
  });
  if (meta?.type !== 'ObjectExpression') throw new Error(`${file}: no defineMeta({ … })`);
  const metaProp = (key: string) =>
    (meta!.properties as Estree[]).find((p) => (p.key as Estree | undefined)?.name === key)?.value as Estree | undefined;
  const title = literal(metaProp('title'), `${file} title`) as string;
  const tags = metaProp('tags') ? (literal(metaProp('tags'), `${file} tags`) as string[]) : [];

  const out: Story[] = [];
  let comment: AST.Comment | undefined;
  for (const node of ast.fragment.nodes) {
    if (node.type === 'Comment') comment = node;
    else if (node.type === 'Component' && node.name === 'Story') {
      const attr = (key: string) =>
        node.attributes.find((a): a is AST.Attribute => a.type === 'Attribute' && a.name === key)?.value;
      const text = (key: string) => {
        const value = attr(key);
        return Array.isArray(value) && value.length === 1 && value[0].type === 'Text' ? value[0].data : undefined;
      };
      const name = text('name');
      if (!name) throw new Error(`${file}: a <Story> without a literal name`);
      const exportName = text('exportName') ?? svelteExportName(name);
      const tagsAttr = attr('tags');
      const storyTags =
        tagsAttr && !Array.isArray(tagsAttr) && tagsAttr !== true
          ? (literal(tagsAttr.expression as unknown as Estree, `${file} ${name} tags`) as string[])
          : [];
      // Storybook tags a story with a play function, as loadCsf does for the React one.
      if (attr('play')) storyTags.push('play-fn');
      out.push({
        id: toId(title, storyNameFromExport(exportName)),
        exportName,
        name,
        tags: storyTags,
        description: comment ? dedent(comment.data) : '',
      });
      comment = undefined;
    } else if (!(node.type === 'Text' && !node.data.trim())) comment = undefined;
  }
  return { file, title, tags, stories: out };
}

function readReact(path: string): StoryFile {
  const file = repoPath(path);
  const csf = loadCsf(readFileSync(path, 'utf8'), { makeTitle: (title) => title, fileName: file }).parse();
  return {
    file,
    title: csf.meta?.title ?? '',
    tags: csf.meta?.tags ?? [],
    stories: Object.keys(csf._storyExports).map((exportName) => {
      const story = csf._stories[exportName];
      return {
        id: story.id,
        exportName,
        name: story.name ?? '',
        tags: story.tags ?? [],
        description: dedent(extractDescription(csf._storyStatements[exportName]) ?? ''),
      };
    }),
  };
}

/** A module's export names, `type` exports marked, read with the TypeScript compiler API. */
function exportsOf(path: string): Map<string, 'type' | 'value'> {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest);
  const out = new Map<string, 'type' | 'value'>();
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) throw new Error(`${path}: export * isn't checked`);
      for (const e of statement.exportClause.elements) out.set(e.name.text, statement.isTypeOnly || e.isTypeOnly ? 'type' : 'value');
    } else if (ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (ts.isVariableStatement(statement)) {
        for (const d of statement.declarationList.declarations) if (ts.isIdentifier(d.name)) out.set(d.name.text, 'value');
      } else {
        const name = (statement as ts.DeclarationStatement).name;
        const kind = ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement) ? 'type' : 'value';
        if (name && ts.isIdentifier(name)) out.set(name.text, kind);
      }
    }
  }
  return out;
}

/** The Svelte story file a React one is the twin of: stories/react/X.stories.tsx ↔ stories/X.stories.svelte. */
const svelteTwinPath = (react: string) => react.replace(/^stories\/react\//, 'stories/').replace(/\.tsx$/, '.svelte');

const svelteFiles = files(stories, '.stories.svelte', reactStories).map(readSvelte);
const reactFiles = files(reactStories, '.stories.tsx').map(readReact);
const pending = readPending();

const svelteById = new Map(svelteFiles.flatMap((f) => f.stories.map((s) => [s.id, { file: f, story: s }] as const)));
const reactById = new Map(reactFiles.flatMap((f) => f.stories.map((s) => [s.id, { file: f, story: s }] as const)));
/** Svelte stories that need a React twin. */
const twinned = [...svelteById].filter(([id, { file, story }]) => !noTwin(id, [...file.tags, ...story.tags]));

describe('React twin stories', () => {
  it('every React story file has a Svelte twin with the same title and tags', () => {
    const wrong = reactFiles.flatMap((react) => {
      const svelte = svelteFiles.find((f) => f.file === svelteTwinPath(react.file));
      if (!svelte) return [`${react.file}: no ${svelteTwinPath(react.file)}`];
      const problems: string[] = [];
      if (react.title !== svelte.title) problems.push(`${react.file}: title '${react.title}', not '${svelte.title}'`);
      if (react.tags.join() !== svelte.tags.join()) problems.push(`${react.file}: tags [${react.tags}], not [${svelte.tags}]`);
      return problems;
    });
    expect(wrong, wrong.join('\n')).toEqual([]);
  });

  it('every Svelte story has a React twin, or is in tests/twins-pending/', () => {
    const missing = twinned
      .filter(([id]) => !reactById.has(id) && !pending.stories.has(id))
      .map(([id, { file }]) => `${id} (${file.file})`);
    expect(missing, `No React twin, and not pending:\n${missing.join('\n')}`).toEqual([]);
  });

  it('each React story matches its Svelte twin: export, name, tags and description', () => {
    const wrong = [...reactById].flatMap(([id, { file, story }]) => {
      const twin = svelteById.get(id);
      if (!twin) return [`${file.file}: ${story.exportName} (${id}) has no Svelte story`];
      const svelte = twin.story;
      if (noTwin(id, [...twin.file.tags, ...svelte.tags])) return [`${file.file}: ${id} is framework-neutral or upstream's; it has no twin`];
      if (twin.file.file !== svelteTwinPath(file.file)) return [`${file.file}: ${id} is in ${twin.file.file}`];
      const problems: string[] = [];
      if (story.exportName !== svelte.exportName) problems.push(`${id}: export ${story.exportName}, not ${svelte.exportName}`);
      if (story.name !== svelte.name) problems.push(`${id}: name '${story.name}', not '${svelte.name}'`);
      if ([...story.tags].sort().join() !== [...svelte.tags].sort().join())
        problems.push(`${id}: tags [${story.tags}], not [${svelte.tags}]`);
      if (story.description !== svelte.description)
        problems.push(`${id}: description differs\n--- svelte\n${svelte.description}\n--- react\n${story.description}`);
      return problems;
    });
    expect(wrong, wrong.join('\n')).toEqual([]);
  });

  it('tests/twins-pending/ lists only Svelte stories that still need a twin', () => {
    const stale = [...pending.stories].flatMap(([id, list]) => {
      const twin = svelteById.get(id);
      if (!twin) return [`${list}: ${id} is not a Svelte story`];
      if (noTwin(id, [...twin.file.tags, ...twin.story.tags])) return [`${list}: ${id} needs no twin`];
      if (reactById.has(id)) return [`${list}: ${id} has its twin now; delete the line`];
      return [];
    });
    expect(stale, stale.join('\n')).toEqual([]);
  });
});

describe('ilw-ui/react exports', () => {
  const svelte = exportsOf(join(root, 'src/svelte/index.ts'));
  const react = exportsOf(join(root, 'src/react/index.ts'));

  it('has a twin of every ilw-ui/svelte export, or lists it in tests/twins-pending/', () => {
    const missing = [...svelte]
      .filter(([name, kind]) => react.get(RENAMED[name] ?? name) !== kind && !pending.exports.has(name))
      .map(([name, kind]) => `${kind === 'type' ? 'type ' : ''}${RENAMED[name] ?? name}`);
    expect(missing, `Missing from src/react/index.ts, and not pending:\n${missing.join('\n')}`).toEqual([]);
  });

  it('exports nothing ilw-ui/svelte does not', () => {
    const svelteNames = new Map([...svelte].map(([name, kind]) => [RENAMED[name] ?? name, kind]));
    const extra = [...react].filter(([name, kind]) => svelteNames.get(name) !== kind).map(([name]) => name);
    expect(extra).toEqual([]);
  });

  it('tests/twins-pending/ lists only ilw-ui/svelte exports React still lacks', () => {
    const stale = [...pending.exports].flatMap(([name, list]) => {
      if (!svelte.has(name)) return [`${list}: export ${name} is not an ilw-ui/svelte export`];
      if (react.has(RENAMED[name] ?? name)) return [`${list}: export ${name} has its twin now; delete the line`];
      return [];
    });
    expect(stale, stale.join('\n')).toEqual([]);
  });
});
