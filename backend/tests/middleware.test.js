const errorHandler = require("../src/middleware/errorHandler");

describe("Error handler middleware", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("should log errors outside of test environment", () => {
    process.env.NODE_ENV = "development";
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(new Error("Boom"), {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Boom" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should reuse provided statusCode and message", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const err = new Error("Custom message");
    err.statusCode = 418;

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ message: "Custom message" });
  });
});

