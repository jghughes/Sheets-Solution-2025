export default {
    transform: {
        '^.+\\.js$': "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json"],
    roots: ["<rootDir>/tests"],
    verbose: true
};