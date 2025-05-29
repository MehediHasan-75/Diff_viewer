module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
