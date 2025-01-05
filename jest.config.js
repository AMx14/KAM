module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js'
    ],
    setupFiles: ['<rootDir>/jest.setup.js']
}; 