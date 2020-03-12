import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import ContactForm from "./ContactForm";

test("renders ContactForm without crashing", () => {
  render(<ContactForm />);
});

test("ContactForm submits values", async () => {
  const { getByLabelText, getByTestId, findByText } = render(<ContactForm />);

  // query for the form inputs
  const firstNameInput = getByLabelText(/first name/i);
  const lastNameInput = getByLabelText(/last name/i);
  const emailInput = getByLabelText(/email/i);
  const messageInput = getByLabelText(/message/i);

  // fireEvent function from RTL to fill in the inputs
  fireEvent.change(firstNameInput, {
    target: { name: "firstName", value: "Joe" }
  });
  fireEvent.change(lastNameInput, {
    target: { name: "lastName", value: "Smith" }
  });
  fireEvent.change(emailInput, {
    target: { name: "email", value: "joe@example.com" }
  });
  fireEvent.change(messageInput, {
    target: { name: "message", value: "hello" }
  });

  const submitButton = getByTestId("submit");
  fireEvent.click(submitButton);

  // assertion
  await findByText(/"firstName": "Joe"/);
  await findByText(/"lastName": "Smith"/);
  await findByText(/"email": "joe@example.com"/);
  await findByText(/"message": "hello"/);
});

test("ContactForm displays required error messages", async () => {
  const { getByTestId, findAllByTestId } = render(<ContactForm />);

  fireEvent.click(getByTestId("submit"));

  await findAllByTestId("error").then(els => {
    if (els.length !== 3) {
      throw new Error("there should be 3 error messages");
    }
  });
});

test("ContactForm displays maxLength error message", async () => {
  const { getByLabelText, getByTestId, findByText } = render(<ContactForm />);

  fireEvent.change(getByLabelText(/first name/i), {
    target: { name: "firstName", value: "billy" }
  });

  fireEvent.click(getByTestId("submit"));

  await findByText(/maxLength/);
});

test("ContactForm displays 'invalid email address' error message", async () => {
  const { getByLabelText, getByTestId, findByText } = render(<ContactForm />);

  fireEvent.change(getByLabelText(/email/i), {
    target: { name: "email", value: "foo@bar" }
  });

  fireEvent.click(getByTestId("submit"));

  await findByText(/invalid email address/);
});

test("ContactForm displays a response from a POST request", async () => {
  const { getByLabelText, getByTestId, findByText } = render(<ContactForm />);

  // query for the form inputs
  const firstNameInput = getByLabelText(/first name/i);
  const lastNameInput = getByLabelText(/last name/i);
  const emailInput = getByLabelText(/email/i);
  const messageInput = getByLabelText(/message/i);

  // fireEvent function from RTL to fill in the inputs
  fireEvent.change(firstNameInput, {
    target: { name: "firstName", value: "Joe" }
  });
  fireEvent.change(lastNameInput, {
    target: { name: "lastName", value: "Smith" }
  });
  fireEvent.change(emailInput, {
    target: { name: "email", value: "joe@example.com" }
  });
  fireEvent.change(messageInput, {
    target: { name: "message", value: "hello" }
  });

  const submitButton = getByTestId("submit");
  fireEvent.click(submitButton);

  // assertion
  await findByText(/"id"/);
  await findByText(/"createdAt"/);
});
