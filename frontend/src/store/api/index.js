import React, { useState, useEffect } from 'react'
import axios from 'axios' 

const BASE_URL = 'http://localhost:5000';
const GET_COMPANYIES_API = 'getAllCompanyies';
const GET_COMPANY_API = 'getCompany';
const ADD_COMPANY_API = 'addCompanyData';
const LOGIN_API = 'login';
const GET_ALLITEMS_API = 'getAllItems';
const GET_ITEM_ID = 'getitemid';
const ADD_iTEMS_API = 'addItem';
const QTN_API = 'getNextSerialNumber';

// export const userLogin = async(values) =>{  
//     try {
//         const response = await axios.post('http://localhost:5000/api/login', {
//           email: values.email,
//           password: values.password,
//           userType: values.userType,
//         });
//         dispatch(loginSuccess(response.data.token));
//         console.log('Login Success:', values, response.data.token);
//         navigate('/profile'); 
//         message.success('Login successful');
//         if (onClose) {
//           onClose();
//         }
//       } catch (error) {
//         dispatch(loginFailure());
//         message.error('Login failed');
//       }
// }

export const fetchAllCompanies = async () => {
    try {
      const getCompaniesApi = `${BASE_URL}/${GET_COMPANYIES_API}`;
      const response = await axios.get(getCompaniesApi);
      console.log("All companies",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return error.message;
    }
  };
  export const fetchCompany = async (buyerName) => {
    try {
      const getCompanyApi = `${BASE_URL}/${GET_COMPANY_API}/${buyerName}`;
      const response = await axios.get(getCompanyApi);
      console.log("All companies",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return error.message;
    }
  };

  export const addCompanies = async (values) => {
    try {
      const addCompaniesApi = `${BASE_URL}/${ADD_COMPANY_API}`;
      await axios.post(addCompaniesApi, values)
      fetchAllCompanies()
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

 // Fetch all items
 export const fetchAllItems = async () => {
    try {
      const getAllItemsApi = `${BASE_URL}/${GET_ALLITEMS_API}`;
      const response = await axios.get(getAllItemsApi);
      console.log("All items",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return error.message;
    }
  };

export  const getItemId = async () => {
    const data = {"prefix": "YPE/SKU" }
    try {
      const getItemsIdApi = `${BASE_URL}/${GET_ITEM_ID}`;
      const response = await axios.post(getItemsIdApi, data);
      console.log("All items",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return error.message;
    }
  };


 export const addItems = async (values) => {
    try {
      const gaddItemsApi = `${BASE_URL}/${ADD_iTEMS_API}`;
      console.log(values);
      const itemDetails = {...values, drawingNumber:'null', serialNumber:'null',counterPartyCode:'null'}
      const response = await axios.post(gaddItemsApi, itemDetails)
      const result = response.data
      if (result.message === "Item added successfully") {
        console.log('Item added successfully:', result)
        fetchAllItems();
      } else {
        console.error('Error adding item:', result.message)
      }
      
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

  export const getQuotationNumber = async () => {
    const data = {"prefix": "YPE/SE",
    "startYear": "23",
    "endYear": "24"
  }
  const getQtnApi = `${BASE_URL}/${QTN_API}`;
    const response = await axios.post(getQtnApi, data);
    
   // console.log("sqNumber",sqNumber)
    return response.data;

  }


