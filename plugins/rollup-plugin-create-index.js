const path = require('path')
const { writeFile, mkdir } = require('fs/promises')

function dedent(str) {
    let match = str.match(/^[ \t]*(?=\S)/gm);
    if (!match) return str;

    let indent = Math.min(...match.map(x => x.length));
    let re = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    return indent > 0 ? str.replace(re, '') : str;
}
  

module.exports = function createIndexFilePlugin({ target, fileName }) {
  return {
    name: 'create-index-file',
    async generateBundle() {
      const dirPath = path.join(process.cwd(), `dist/${target}`)
      const content = `
        'use strict'

        if (process.env.npm_package_type === 'module') {
            module.exports = require('./${fileName.esm}')
        } else {
            module.exports = require('./${fileName.cjs}')
        }
    `;

    await mkdir(dirPath, { recursive: true })

      // 'index.js' 파일 생성
      writeFile(`${dirPath}/index.js`, dedent(content));
    }
  };
};
