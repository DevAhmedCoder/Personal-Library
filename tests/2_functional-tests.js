/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", (done) => {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end((err, res) => {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(
  //         res.body[0],
  //         "commentcount",
  //         "Books in array should contain commentcount"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "title",
  //         "Books in array should contain title"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "_id",
  //         "Books in array should contain _id"
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", () => {
    suite(
      "POST /api/books with title => create book object/expect book object",
      () => {
        test("Test POST /api/books with title", (done) => {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/json")
            .send({
              title: "testBook",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              deleteID = res.body._id;
              assert.equal(res.body.title, "testBook");
              done();
            });
        });

        test("Test POST /api/books with no title given", (done) => {
          chai
            .request(server)
            .post("/api/books")
            .set("content-type", "application/json")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", () => {
      test("Test GET /api/books", (done) => {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.notEqual(res.body.length, 0);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", () => {
      test("Test GET /api/books/[id] with id not in db", (done) => {
        chai
          .request(server)
          .get("/api/books/6251b5c1a78760a3b175117c")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", (done) => {
        chai
          .request(server)
          .get("/api/books/" + deleteID)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, deleteID);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      () => {
        test("Test POST /api/books/[id] with comment", (done) => {
          chai
            .request(server)
            .post("/api/books/" + deleteID)
            .send({
              comment: "firstComent",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.comments[0], "firstComent");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", (done) => {
          chai
            .request(server)
            .post("/api/books/" + deleteID)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", (done) => {
          chai
            .request(server)
            .post("/api/books/6251b5c1a78760a3b175117c")
            .send({
              comment: "firstComent",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", () => {
      test("Test DELETE /api/books/[id] with valid id in db", (done) => {
        chai
          .request(server)
          .delete("/api/books/" + deleteID)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", (done) => {
        chai
          .request(server)
          .delete("/api/books/6251b5c1a78760a3b175117c")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });
    });
  });
});
