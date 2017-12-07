let  DbContext = require("../client/js/helpers/PersistenceLayer");

describe("Persistence Layer All Defined ===", function() {
  it("DbContext Defined", function() {
    expect(DbContext).toBeDefined();
  });
  it("Save Defined", function() {
    expect(DbContext.save).toBeDefined();
  });
  it("Update Defined", function() {
    expect(DbContext.update).toBeDefined();
  });
  it("Delete Defined", function() {
    expect(DbContext.delete).toBeDefined();
  });
  it("get Defined", function() {
    expect(DbContext.get).toBeDefined();
  });
});

describe("Persistence Layer Each Function ===", function() {
  let newObj =  {   id:3,
                    password:"working copy 6",
                    title:"It changed!!"
                };
  let  originalTimeout;
  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("get function", (done) => {
      DbContext.get(['Auth','Users','user1'])
      .then((value)=>{expect(value).toEqual(newObj)});
      done();
  });
  it("validate path get", function(done) {
  	  DbContext.get(['Auth','Users','user1'])
      .catch((e)=>expect(e).toBe("Mention correct path string in array, path string must not be empty and do not use '.','#','$','['or']' in path string."))
      //.catch(done.fail);
      done();
  });
});




