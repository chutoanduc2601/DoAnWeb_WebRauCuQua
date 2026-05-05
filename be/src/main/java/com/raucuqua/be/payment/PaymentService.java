package com.raucuqua.be.payment;

import com.raucuqua.be.dto.PaymentResponseDTO;
import com.raucuqua.be.entity.Order;
import com.raucuqua.be.repository.OrderRepository;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    // MoMo configuration (Test credentials from MoMo Docs)
    @Value("${momo.partnerCode:MOMOBKUN20180529}")
    private String momoPartnerCode;

    @Value("${momo.accessKey:klm05TvNCpe74Z12}")
    private String momoAccessKey;

    @Value("${momo.secretKey:at67qH6mk8g81P002iX1Q92vN08sI8L0}")
    private String momoSecretKey;

    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String momoEndpoint;

    @Value("${momo.returnUrl:http://localhost:5173/payment-result}")
    private String momoReturnUrl;

    @Value("${app.baseUrl:https://jersey-wreath-amperage.ngrok-free.dev}")
    private String appBaseUrl;

    // PayOS configuration
    @Value("${payos.clientId:YOUR_PAYOS_CLIENT_ID}")
    private String payosClientId;

    @Value("${payos.apiKey:YOUR_PAYOS_API_KEY}")
    private String payosApiKey;

    @Value("${payos.checksumKey:YOUR_PAYOS_CHECKSUM_KEY}")
    private String payosChecksumKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public PaymentResponseDTO createPaymentLink(Long orderId, String paymentMethod) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("MOMO".equalsIgnoreCase(paymentMethod)) {
            return createMoMoPayment(order);
        } else if ("PAYOS".equalsIgnoreCase(paymentMethod)) {
            return createPayOsPayment(order);
        }

        throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
    }

    private PaymentResponseDTO createMoMoPayment(Order order) throws Exception {
        String requestId = UUID.randomUUID().toString();
        String orderIdStr = order.getId().toString() + "-" + System.currentTimeMillis();
        long amount = Math.round(order.getTotal());
        String orderInfo = "Thanh toan don hang Farmily #" + order.getId();
        String notifyUrl = appBaseUrl + "/api/payment/momo/ipn";
        String requestType = "captureWallet";
        String extraData = "";

        // Construct raw hash string
        String rawSignature = "accessKey=" + momoAccessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + notifyUrl +
                "&orderId=" + orderIdStr +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + momoPartnerCode +
                "&redirectUrl=" + momoReturnUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, momoSecretKey).hmacHex(rawSignature);

        // Build JSON body manually to avoid bringing in complex JSON builder just for this
        String jsonBody = "{" +
                "\"partnerCode\":\"" + momoPartnerCode + "\"," +
                "\"partnerName\":\"Farmily\"," +
                "\"storeId\":\"Farmily\"," +
                "\"requestId\":\"" + requestId + "\"," +
                "\"amount\":" + amount + "," +
                "\"orderId\":\"" + orderIdStr + "\"," +
                "\"orderInfo\":\"" + orderInfo + "\"," +
                "\"redirectUrl\":\"" + momoReturnUrl + "\"," +
                "\"ipnUrl\":\"" + notifyUrl + "\"," +
                "\"lang\":\"vi\"," +
                "\"extraData\":\"" + extraData + "\"," +
                "\"requestType\":\"" + requestType + "\"," +
                "\"signature\":\"" + signature + "\"" +
                "}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(momoEndpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        // Parse the response to extract payUrl
        // Basic parsing for the sake of simplicity, using regex
        String responseBody = response.body();
        String payUrl = extractJsonStringValue(responseBody, "payUrl");
        
        if (payUrl == null || payUrl.isEmpty()) {
            throw new RuntimeException("Failed to create MoMo payment link: " + responseBody);
        }

        order.setPaymentMethod("MOMO");
        order.setPaymentTransactionId(orderIdStr);
        orderRepository.save(order);

        return new PaymentResponseDTO(payUrl, "MOMO", order.getId().toString());
    }

    private PaymentResponseDTO createPayOsPayment(Order order) throws Exception {
        // PayOS API: POST https://api-merchant.payos.vn/v2/payment-requests
        String orderCodeStr = String.valueOf(order.getId() + 1000000L); // PayOS requires orderCode as integer < 2^53
        long amount = Math.round(order.getTotal());
        String description = "Thanh toan don hang #" + order.getId();
        
        String cancelUrl = momoReturnUrl; // We can use the same return url
        String returnUrl = momoReturnUrl;
        
        // Signature = HMAC_SHA256(checksumKey, amount=...&cancelUrl=...&description=...&orderCode=...&returnUrl=...)
        // PayOS strictly orders by alphabet
        String rawSignature = "amount=" + amount +
                "&cancelUrl=" + cancelUrl +
                "&description=" + description +
                "&orderCode=" + orderCodeStr +
                "&returnUrl=" + returnUrl;
                
        String signature = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, payosChecksumKey).hmacHex(rawSignature);
        
        String jsonBody = "{" +
                "\"orderCode\":" + orderCodeStr + "," +
                "\"amount\":" + amount + "," +
                "\"description\":\"" + description + "\"," +
                "\"returnUrl\":\"" + returnUrl + "\"," +
                "\"cancelUrl\":\"" + cancelUrl + "\"," +
                "\"signature\":\"" + signature + "\"" +
                "}";
                
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api-merchant.payos.vn/v2/payment-requests"))
                .header("Content-Type", "application/json")
                .header("x-client-id", payosClientId)
                .header("x-api-key", payosApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();
                
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        
        // Extract checkoutUrl
        String payUrl = extractJsonStringValue(responseBody, "checkoutUrl");
        if (payUrl == null || payUrl.isEmpty()) {
            throw new RuntimeException("Failed to create PayOS link: " + responseBody);
        }
        
        order.setPaymentMethod("PAYOS");
        order.setPaymentTransactionId(orderCodeStr);
        orderRepository.save(order);

        return new PaymentResponseDTO(payUrl, "PAYOS", order.getId().toString());
    }

    private String extractJsonStringValue(String json, String key) {
        String searchStr = "\"" + key + "\":\"";
        int start = json.indexOf(searchStr);
        if (start == -1) return null;
        start += searchStr.length();
        int end = json.indexOf("\"", start);
        if (end == -1) return null;
        return json.substring(start, end);
    }
}
