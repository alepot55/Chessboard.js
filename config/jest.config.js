export default {
    testEnvironment: 'jsdom',
    rootDir: '../',
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.js',
        '<rootDir>/tests/integration/**/*.test.js'
    ],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.js',
        '!<rootDir>/src/**/*.test.js'
    ],
    transform: {
        "^.+\\.js$": ["babel-jest", { "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]] }]
    }
};