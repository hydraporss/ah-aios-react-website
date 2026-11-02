'use strict';
// Maps an ahaios://app/<path> URL to a file inside `root`, or null if it would escape `root`.
const path = require('path');

function resolveAppPath(urlStr, root) {
  let u, p;
  try { u = new URL(urlStr); p = decodeURIComponent(u.pathname); } catch (e) { return null; }
  if (p.indexOf('\0') !== -1) return null;
  if (p.endsWith('/')) p += 'index.html';
  const full = path.resolve(root, '.' + path.posix.normalize('/' + p));
  const rel = path.relative(root, full);
  if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) return null;
  return full;
}

module.exports = { resolveAppPath };
