

const testusers = [
  {
    username: "testaaja",
    name: "Test test",
    password: "testtest"
  }
];

const testblogs = [
  {
    title: "testblog",
    author: "testauthor",
    url: "testurl"
  },
  {
    title: "testblog2",
    author: "testauthor2",
    url: "testurl2"
  }
];

let blogsindb = [];

describe('Blog app', function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    for (let i = 0; i < testusers.length; ++i) {
      cy.request("POST", "http://localhost:3003/api/users", testusers[i]);
    }
    cy.visit("http://localhost:3000");
  });

  it('Login form is shown', function() {
    cy.contains("Login");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type(testusers[0].username);
      cy.get("#password").type(testusers[0].password);
      cy.get("#loginbutton").click();
      cy.contains(testusers[0].name + " logged in");
    });

    it("Fails with wrong credentials", function() {
      cy.get("#username").type(testusers[0].username);
      cy.get("#password").type("wrongpw");
      cy.get("#loginbutton").click();
      cy.get("#message").should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
    describe('When logged in', function() {
      beforeEach(function() {
        cy.request("POST", "http://localhost:3003/api/login", testusers[0]).then(res => {;
          localStorage.setItem("user", JSON.stringify(res.body));
          cy.visit("http://localhost:3000");
        });
      });

      it('A blog can be created', function() {
        cy.get("#toggleshow").click();
        cy.get("#ctitle").type(testblogs[0].title);
        cy.get("#cauthor").type(testblogs[0].author);
        cy.get("#curl").type(testblogs[0].url);
        cy.get("#csubmit").click();
        cy.contains(`${testblogs[0].title} ${testblogs[0].author}`);
      });

      describe("blogs exists", function () {
        beforeEach(function() {
          const auth = { Authorization: "bearer " + JSON.parse(localStorage.getItem("user")).token };
          blogsindb = [];
          testblogs.forEach(b => cy.request({
            method: "POST",
            url: "http://localhost:3003/api/blogs",
            body: b, headers : auth}).then(res => {
              blogsindb.push(res.body);
            }));
          cy.visit("http://localhost:3000");
        });

        it("A blog can be liked", function() {
          cy.get("#" + blogsindb[0].id + "show").click().then(() => {
            cy.get("#" + blogsindb[0].id + "like").click().then(() => {
              cy.get("#" + blogsindb[0].id + "like").parent().contains(String(blogsindb[0].likes + 1));
            });
          });
        });

        it("A blog can be deleted", function() {
          cy.get("#"+blogsindb[0].id + "show").click().then(() => {
            cy.get("#" + blogsindb[0].id + "remove").click().then(() => {
              cy.contains(`${blogsindb[0].title} ${blogsindb[0].author}`).should("not.exist");
            });
          });
        });

        it("Blogs are sorted by likes", function() {
          cy.get("#" + blogsindb[0].id + "show").click().then(() => {
            cy.get("#" + blogsindb[0].id + "like").click().then(() => {
              cy.get(".blogs").eq(0).should("contain", `${blogsindb[0].title} ${blogsindb[0].author}`).then(() => {
                cy.get("#" + blogsindb[1].id + "show").click().then(() => {
                  cy.get("#" + blogsindb[1].id + "like").click().then(() => {
                    cy.get("#" + blogsindb[1].id + "like").click().then(() => {
                      cy.get(".blogs").eq(0).should("contain", `${blogsindb[1].title} ${blogsindb[1].author}`);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

