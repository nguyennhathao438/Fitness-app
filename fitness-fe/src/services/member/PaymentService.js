import api from "../../api"; 

export const createPaymentUrl = (paymentMethod, packageId, bankCode = '') => {
  let endpoint = '';

  if (paymentMethod === 'momo') {
    endpoint = '/momo_payment';
  } else {
    endpoint = '/vnpay_payment';
  }

  return api.post(endpoint, { 
    method: paymentMethod,
    package_id: packageId,
    bank_code: bankCode 
  });
};