const fs = require('fs');
const path = require('path');

// Expected order of tabs
const order = ['demo', 'code', 'api', 'accessibility'];

function camelCase(str) {
  const parts = str.split('-');
  return parts.map(part => part.replace(part.charAt(0), part.charAt(0).toUpperCase())).join(' ');
}

function sortChildren(children) {
  return children.sort((a, b) => {
    // Skip comparing children that are not equal
    if (typeof a !== 'string' || typeof b !== 'string') {
      return 0;
    }
    const aIndex = order.findIndex(o => a.indexOf(o) > -1);
    const bIndex = order.findIndex(o => b.indexOf(o) > -1);
    return aIndex - bIndex;
  });
}

function getChildren(dir) {
  const base = path.join(process.cwd(), dir);
  return (
    fs
      .readdirSync(base)
      // README files are already accounted for and assumed
      .filter(basename => basename !== 'README.md')
      // Remove any paths that aren't markdown or subdirectories
      .filter(basename => ['', '.md'].includes(path.extname(basename)))
      // Remove anything prefixed with _
      .filter(basename => !basename.startsWith('_'))
      .map(basename => {
        if (fs.statSync(path.join(base, basename)).isDirectory()) {
          return {
            title: camelCase(basename),
            path: `/${dir}/${basename}`,
            children: [`/${dir}/${basename}/`, ...sortChildren(getChildren(`${dir}/${basename}`))],
          };
        } else {
          return `/${dir}/${basename}`;
        }
      })
  );
}

module.exports = [
  {
    title: 'Get Started',
    path: '/get-started/',
    children: getChildren('get-started'),
  },
  {
    title: 'Foundation',
    path: '/foundation/',
    children: getChildren('foundation'),
  },
  {
    title: 'Components',
    path: '/components/',
    children: getChildren('components'),
  },
  {
    title: 'Releases',
    path: '/releases/',
    children: ['/releases/v3'],
  },
];
