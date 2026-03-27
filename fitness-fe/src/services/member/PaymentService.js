import api from "../../api"; 

export const createPaymentUrl = (paymentMethod, packageId, bankCode = '', returnUrl = '') => {
  let endpoint = '';

  if (paymentMethod === 'momo') {
    endpoint = '/momo_payment';
  } else {
    endpoint = '/vnpay_payment';
  }

  const payload = { 
    method: paymentMethod,
    package_id: packageId,
    bank_code: bankCode 
  };

  if (returnUrl) {
    payload.return_url = returnUrl;
  }

  return api.post(endpoint, payload);
};