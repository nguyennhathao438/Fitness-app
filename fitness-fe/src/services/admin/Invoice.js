import api from "@/api";

export const getInvoice = (params) => {
    return api.get("/invoice",{params});
}
export const deleteInvoice = (invoiceId) => {
    return api.put(`/invoice_delete/${invoiceId}`);
}
export const getInvoiceThisMonth = () => {
    return api.get("/invoice-thismonth");
}
export const getPayment = () => {
    return api.get("/paymentstat");
}
export const getInvoicePerMonth = (params) => {
    return api.get("/invoice-permonth",{params});
}
export const getInvoiceMoney = (params) => {
    return api.get("/invoice-moneystat",{params});
}
