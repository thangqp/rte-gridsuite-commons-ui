import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.svg$': 'jest-svg-transformer',
    },
    globals: {
        IS_REACT_ACT_ENVIRONMENT: true,
    },
};

export default config;
