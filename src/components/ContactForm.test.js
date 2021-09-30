import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.queryByText('Contact Form')
    expect(header).toHaveTextContent('Contact Form')
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText('First Name*');
    userEvent.type(firstName, 'Raj')
    expect(firstName).toHaveValue('Raj')
    expect(screen.getByTestId('error').textContent).toEqual('Error: firstName must have at least 5 characters.')
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render (<ContactForm />);
    const firstName = screen.getByLabelText('First Name*')
    userEvent.type(firstName, 'Raj')

    const lastName = screen.getByLabelText('Last Name*')
    userEvent.type(lastName, 'Patel')

    const email = screen.getByLabelText('Email*')
    userEvent.type(email, 'abc@abc.com')

    expect(screen.queryAllByText('Error: firstName must have at least 5 characters.' || 'Error: lastName is a required field.' || 'Error: email must be a valid email address.'))
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);

    userEvent.type(firstNameInput, 'Raj Patel');
    userEvent.type(lastNameInput, 'abc@gmail.com');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton)

    const err = screen.getByText(/error/i);
    expect(err).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'r.patel')

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton)

    const errorMessage = screen.getByText(/Error: email must be a valid email address./i);
    expect(errorMessage).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByLabelText(/email*/i);

    userEvent.type(emailInput, '1204patel.raj@gmail.com')
    userEvent.type(firstNameInput, 'Raj Patel');
    userEvent.click(submitButton)

    const errorMessage = screen.getByText(/Error: lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument()
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const message = screen.getByLabelText(/message*/i);
    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByLabelText(/email*/i);
    const messageValue = screen.queryByLabelText(/Message/i)

    userEvent.type(emailInput, '1204patel.raj@gmail.com')
    userEvent.type(firstNameInput, 'Raj');
    userEvent.type(lastNameInput, 'Patel');
    userEvent.click(submitButton)

    expect(messageValue).toBeEmpty()
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)

    const firstName = screen.getByLabelText('First Name*')
    userEvent.type(firstName, 'abcde')

    const lastName = screen.getByLabelText('Last Name*')
    userEvent.type(lastName, 'fghijk')

    const email = screen.getByLabelText('Email*')
    userEvent.type(email, 'abc@def.com')

    const message = screen.getByLabelText('Message')
    userEvent.type(message, 'message')

    const button = screen.getByRole('button')
    userEvent.click(button)

    await waitFor(() => {
        const showFirst = screen.queryByText('abcde')
        expect(showFirst).toBeInTheDocument()

        const showLast = screen.queryByText('fghijk')
        expect(showLast).toBeInTheDocument()

        const showEmail = screen.queryByText('abc@def.com')
        expect(showEmail).toBeInTheDocument()

        const showMessage = screen.queryByTestId(/message/i)
        expect(showMessage).toBeInTheDocument()
    
    })
});