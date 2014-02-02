beforeEach(function() {
  fileMock = jasmine.createSpyObj("file", ["name"]);
});

describe("Archivos Model", function() {
  it("is initialized with an order code and a file", function() {
    var order_code = "123";
    var media = new Media(order_code, fileMock);

    expect(media.order_code).toBe(order_code);
    expect(media.file).toBe(fileMock);
  });
});

describe("Archivos view", function() {
});
