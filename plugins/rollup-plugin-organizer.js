const {existsSync} = require('fs')
const path = require('path')
const {copy, remove} = require('fs-extra')

module.exports = function organizer ({ target }) {
    return {
        name: 'monkey-d-build-organizer',
        async writeBundle(){
            const typeDir = path.join(process.cwd(), `dist/${target}/types`);
            const copyTypeDir = `${typeDir}/${target}`;
            const destDir = path.join(process.cwd(), `dist/${target}`);

            if(existsSync(copyTypeDir)){
                copy(copyTypeDir, destDir, { overwrite: true }, (err) => {
                    if(!err) {
                        remove(typeDir)
                        console.log('Copy completed successfully.');
                    }
                })
            }
        }
    }
}