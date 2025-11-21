describe("App bootstrap", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = originalEnv;
  });

  it("attaches morgan logger outside the test environment", () => {
    process.env.NODE_ENV = "development";
    const morganMock = jest.fn(() => (req, res, next) => next());
    jest.doMock("morgan", () => morganMock);

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      const app = require("../src/app");
      expect(app).toBeDefined();
    });

    expect(morganMock).toHaveBeenCalledWith("dev");
  });
});

