context("Test the demo app", () => {
  beforeEach(() => {
    cy.visit("/demo.html");
  });

  describe("Demo page", () => {
    it("renders a plugin component", () => {
      cy.get("#plugin").should((d) => expect(d).to.contain("LARA Context inspector"));
    });
  });
});
