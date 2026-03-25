<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrainingPackage; 

class PaymentController extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data))
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    public function momo_payment(Request $request)
    {
        $packageId = $request->input('package_id');
        $package = TrainingPackage::find($packageId);

        if (!$package) {
            return response()->json(['message' => 'Gói tập không tồn tại'], 404);
        }

        $amount = (int)$package->price; 
        
        // CẤU HÌNH MOMO
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

        $orderInfo = "Thanh toan goi " . $package->name;
        $orderId = time() . ""; 
        $requestId = time() . "";
        
        $redirectUrl = "http://localhost:5173/register/" . $packageId; 
        $ipnUrl = "http://localhost:8000/api/momo-ipn"; 
        $extraData = "";

        $requestType = "payWithATM"; 

        $rawHash = "accessKey=" . $accessKey . 
                   "&amount=" . $amount . 
                   "&extraData=" . $extraData . 
                   "&ipnUrl=" . $ipnUrl . 
                   "&orderId=" . $orderId . 
                   "&orderInfo=" . $orderInfo . 
                   "&partnerCode=" . $partnerCode . 
                   "&redirectUrl=" . $redirectUrl . 
                   "&requestId=" . $requestId . 
                   "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Fitness App",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );

        
        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true); 
        
        if (isset($jsonResult['errorCode']) && $jsonResult['errorCode'] != 0) {
            return response()->json([
                'message' => $jsonResult['localMessage'] ?? 'Lỗi MoMo',
                'detail' => $jsonResult
            ], 400);
        }

        return response()->json($jsonResult);
    }

    public function vnpay_payment(Request $request)
    {
        $packageId = $request->input('package_id');
        $package = TrainingPackage::find($packageId);
        if (!$package) {
            return response()->json(['message' => 'Gói tập không tồn tại'], 404);
        }

        //  CẤU HÌNH VNPAY
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:5173/register/" . $packageId;
        
        $vnp_TmnCode = "Z93211NZ"; 
        $vnp_HashSecret = "V73N81OUL7L418T3F1BXT007GLFAE6J0"; 

        $vnp_TxnRef = time() . ""; 
        $vnp_OrderInfo = "Thanh toan goi " . $package->name;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = (int)$package->price * 100;
        $vnp_Locale = "vn";
        $vnp_IpAddr = $request->ip();

        $bankCode = $request->input('bank_code'); 
        
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if (isset($bankCode) && $bankCode != "") {
            $inputData['vnp_BankCode'] = $bankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return response()->json([
            'code' => '00',
            'message' => 'success',
            'payUrl' => $vnp_Url
        ]);
    }


}