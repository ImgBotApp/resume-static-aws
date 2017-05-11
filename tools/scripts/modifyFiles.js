const fs = require('fs');
const path = require('path');

const projectFiles = [];

const intendedProjectFile = file => {
  return !/(mp3|wav|scss|pug|pegjs|swp|arithmetic.js|aws.js|api_keys.js|deploy.js|modifyFiles.js)$/.test(
    file,
  );
};

const write = files => {
  for (let file of files) {
    const text = fs.readFileSync(file, 'utf8').split('\n');
    const str = "beforeEach('', () => {});";
    text.filter((val, i) => {
      if (val === str) console.log('match found @: ', file, i);
      if (file === 'src/blog/__tests__/handlers.spec.js') {
        text.splice(i, 1);
      }

      return val === str;
    });

    //fs.writeFileSync(file, text.join('\n'), 'utf8');
  }
};

const recurse = (src, depth) => {
  const root = fs.readdirSync(src);
  const dirs = root.filter(file =>
    fs.statSync(path.join(src, file)).isDirectory(),
  );
  const files = root.filter(file => fs.statSync(path.join(src, file)).isFile());

  if (files && depth != 0) {
    for (let file of files) {
      if (intendedProjectFile(file)) projectFiles.push(src + '/' + file);
    }
  }

  if (dirs) {
    for (let dir of dirs) {
      const desiredDir = depth === 0 && /^(src|tools)$/.test(dir);
      const shouldRecurse = desiredDir || depth != 0;
      const name = src === '.' ? dir : src + '/' + dir;
      if (shouldRecurse) recurse(name, depth + 1);
    }
  }
};

if (require.main === module) {
  recurse('.', 0);
  write(projectFiles);
}
