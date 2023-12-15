import request from '../fetchApi';
import React from 'react';
export const getHomeSlider = (id) => request.get(`home-sliders?device_type=${id}`);
export const getCoupanList = (id) => request.get(`kiosk/list-coupons?kioskType=${id}`);
export const getProjectList = (id) => request.get(`kiosk/list-project-categories?device_id=${id}`);
export const getContribute = () => request.get('kiosk/list-donation-categories');

export const getcartList = (e) => request.get(`kiosk/cart-list?${e}`);
export const AddToDonate = (e) => request.post('kiosk/add-to-cart'+e);
export const addDeviceId = (e) => request.get(`kiosk/fetch-android-id?android_id=${e}`);
export const deleteCartItem = ({data,url}) => request.Delete(`kiosk/delete-cart/${url}`,data);


//project list

export const getProjectItemList = (e) => request.get(`kiosk/list-projects${e}`);
export const getCountryList = (e) => request.get(`kiosk/list-countries${e}`);

