export default {
  clearMocks: true,
  collectCoverageFrom: ["<rootDir>/**/!(*.d).js"],
  coverageDirectory: "<rootDir>/../coverage",
  coverageProvider: "v8",
  coverageReporters: ["json-summary"],
  modulePaths: ["<rootDir>/"],
  rootDir: "test_src",
  testEnvironment: "jsdom",
};
