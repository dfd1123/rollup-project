module.exports = function addDirective(options = {}) {
    return {
        name: 'add-directive',
        renderChunk(code) {
        const directive = options.directive || '';
        return `${directive}\n${code}`;
        }
    };
}