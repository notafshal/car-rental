import "@testing-library/jest-dom";
if (!global.TextEncoder) {
  global.TextEncoder = require("util").TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = require("util").TextDecoder;
}
