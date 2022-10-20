function Calculator() {
  this.add = (a, b) => a + b;
  this.minus = (a, b) => a - b;
  this.multiply = (a, b) => a * b;
  this.divide = (a, b) => a / b;
}

// describe is decription of a test's section
describe("Handle Add & Minus Calculating", function () {
  var cal = new Calculator();

  //it is 1 unit test
  it("1 + 1 = 2", function () {
    expect(2).toBe(cal.add(1, 1));
  });
  it("2 + 2 = 4", function () {
    //expect == assert => Check Accurancy 
    // expect(EXPECTED_VALUE).toBe(RETURN_VALUE)
    expect(4).toBe(cal.add(2, 2));
  });

  it("5 - 2 = 3", function () {
    expect(3).toBe(cal.minus(5, 2));
  });

});

describe("Handle Multiply & Divide Calculating", function () {
  var cal = new Calculator();
  it("5 * 2 = 10", function () {
    expect(10).toBe(cal.multiply(5, 2));
  });

  it("6 / 2 = 3", function () {
    expect(3).toBe(cal.divide(6, 2));
  });
});



// Some Matchers in Jasmine
// Matchers are a functions which compare result to EXPECTED VALUE vs RETURN VALUE

describe("Matchers Handling", () => {
  // .not.toBe(RETURN_VALUE)
  it("3 * 4 != 13", function () {
    expect(13).not.toBe(3 * 4);
  });
  // Object 
  it("f1 == f2", function () {
    var f1 = { a: 1, b: 2 };
    var f2 = { a: 1, b: 2 };
    //f1 == f2 có kểt quả false
    //Nhưng match toEqual vẫn so sánh đúng
    expect(f1).toEqual(f2);
  });
  it("a.foo is not undefined", function () {
    var a = {
      foo: "foo"
    };

    expect(a.foo).toBeDefined();
    expect(a.bar).not.toBeDefined(); // == .toBeUndefined()
  });

  it("a.foo is undefined", function () {
    var a = {
      foo: "foo"
    };

    expect(a.foo).not.toBeUndefined(); // == .toBeDefined()
    expect(a.bar).toBeUndefined();
  });

  it("a == null && foo != null", function () {
    var a = null;
    var foo = "foo";

    expect(null).toBeNull();
    expect(a).toBeNull();
    expect(foo).not.toBeNull();
  });
})

// beforeEach, afterEach, beforeAll, afterAll
describe("Before and After Handling", function () {

  beforeAll(function () {
    //Runs 1 time before All test case run
    console.log("Before All")
  });

  afterAll(function () {
    //Runs 1 time after All test case run
    console.log("After All")
  });

  beforeEach(function () {
    //Runs MANY TIMES before a test case
    console.log("beforeEach")
  });

  afterEach(function () {
    //Runs MANY TIMES after a test case
    console.log("afterEach")
  });

  it("1 + 2 = 3", function () {
    expect(3).toBe(1 + 2);
  });
  it("1 + 2 = 3", function () {
    expect(3).toBe(1 + 2);
  });

});

// Spy checks 1 function was called or not and use spy to be Mock Object
// Module A depends on Module B , B is not completely handled => create fake B : mock
describe("Spy Handling", function () {
  var student, learned = null;

  beforeEach(function () {
    student = {
      learn: function (subject) {
        learned = subject;
      },
      
    };

    //Spy to track learn of student
    spyOn(student, 'learn');
    student.learn('Software Testing')
  });

  //tracks that the spy was called
  it("true if this spy was called", function () {
    expect(student.learn).toHaveBeenCalled();
  });

  //tracks all the arguments of its calls
  it("true if arguments were called", function () {
    expect(student.learn).toHaveBeenCalledWith('Software Testing');
  });

  it("learned == Software Testing", function () {
    expect(learned).toBe("Software Testing");
  });
});





// describe("Spy Handling", function () {
//   var student, learned = null;

//   beforeEach(function () {
//     student = {
//       learn: function (subject) {
//         learned = subject;
//       },
//       subjectLearned: () => {

//       }
//     };

//     //Spy to track learn of student
//     //.callThrough()
//     //.callFake(()=>{})
//     spyOn(student, 'subjectLearned')
//     spyOn(student, 'learn');

//     student.learn(student.subjectLearned())

//   });

//   //tracks that the spy was called
//   it("true if this spy was called", function () {
//     expect(student.learn).toHaveBeenCalled();
//   });

//   //tracks all the arguments of its calls
//   it("true if arguments were called", function () {
//     expect(student.learn).toHaveBeenCalledWith('Software Testing');
//   });

//   it("learned == Software Testing", function () {
//     //Spy prevents learn, so learned is null
//     expect(learned).toBe(null);
//   });
//   it("subjectLearned == null", function () {
//     expect(student.subjectLearned()).toBe(null);
//   });
// });

// describe("Spy Handlings", function () {
//   var student, learned = null;

//   beforeEach(function () {
//     student = {
//       learn: function (subject) {
//         learned = subject;
//       },
//       a: () => {

//       }
//     };

//     //Spy to track learn of student
//     spyOn(student, 'learn').and.callThrough();
//     spyOn(student, 'a')
//     student.learn(student.a())
//   });

//   //tracks all the arguments of its calls
//   it("true if arguments were called", function () {
//     expect(student.learn).toHaveBeenCalledWith('Software Testing');
//   });

//   it("learned == Software Testing", function () {
//     expect(learned).toBe("Software Testing");
//   });

//   it("learned == Software Testing", function () {
//     expect(student.a()).toBe("Software Testing");
//   });
// });