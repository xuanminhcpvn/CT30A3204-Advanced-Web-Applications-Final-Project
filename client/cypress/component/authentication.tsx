import Login from "../../src/components/Login"; 
import Register from "../../src/components/Register"; 

describe("Authentication Unit Tests (Cypress)", () => {
    it("Check that all components in login page exists ", () => {
        cy.mount(<Login />);
        cy.contains("Login").should("exist");// Find button with text "Login"
        cy.get('input[placeholder="Username"]').should("exist");
        cy.get('input[placeholder="Password"]').should("exist");
    });

    it("Check that all components in register page exists ", () => {
        cy.mount(<Register />);
        cy.contains("Register").should("exist");
        cy.get('input[placeholder="Username"]').should("exist");
        cy.get('input[placeholder="Email"]').should("exist");
        cy.get('input[placeholder="Password"]').should("exist");
    });
})