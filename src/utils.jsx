
import React from 'react';

export const validateEmail = (_, value) => {
  if (value && value.split('@').length !== 2) {
    return Promise.reject(new Error('Email should contain only one "@" symbol'));
  }
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return Promise.reject(new Error('Please enter a valid email address'));
  }
  return Promise.resolve();
};

export const gstinValidator = (_, value) => {
  const regExp = /^\d{2}([A-Z]){5}([0-9]){4}([A-Z]){1}[A-Z 0-9]{3}$/;

  if (!value) {
    return Promise.reject(new Error('Please enter GSTIN value'));
  } else if (value.length !== 15) {
    return Promise.reject('GSTIN value must be 15 digits');
  } else if (!regExp.test(value)) {
    return Promise.reject('Entered incorrect GSTIN');
  } else {
    return Promise.resolve();
  }
};

export const validatePhoneNumber = (_, value) => {
  const regExp = /^[0-9]*$/;

  if (!value) {
    return Promise.reject('Please input your registered phone number!');
  } else if (!regExp.test(value)) {
    return Promise.reject('Please enter a valid phone');
  } else if (value.length !== 10) {
    return Promise.reject("Phone number must be at least 10 characters");
  } else {
    return Promise.resolve();
  }
};
