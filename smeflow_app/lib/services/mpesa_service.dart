import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'storage_service.dart';

class MpesaService {
  static const String _baseUrl = ApiConfig.apiBaseUrl;

  // Initiate STK Push payment
  static Future<Map<String, dynamic>> initiatePayment({
    required String phoneNumber,
    required double amount,
    required String accountReference,
    String? transactionDesc,
    String? businessId,
  }) async {
    try {
      final token = StorageService.getToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.post(
        Uri.parse('$_baseUrl/mpesa/stk-push'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'phoneNumber': phoneNumber,
          'amount': amount,
          'accountReference': accountReference,
          'transactionDesc': transactionDesc ?? 'Payment for product',
          if (businessId != null) 'businessId': businessId,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to initiate payment');
      }
    } catch (e) {
      throw Exception('Payment initiation failed: $e');
    }
  }

  // Query transaction status
  static Future<Map<String, dynamic>> queryTransactionStatus(
      String checkoutRequestID) async {
    try {
      final token = StorageService.getToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$_baseUrl/mpesa/query/$checkoutRequestID'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to query transaction');
      }
    } catch (e) {
      throw Exception('Transaction query failed: $e');
    }
  }

  // Get user transactions
  static Future<Map<String, dynamic>> getUserTransactions({
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final token = StorageService.getToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$_baseUrl/mpesa/transactions?page=$page&limit=$limit'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to load transactions');
      }
    } catch (e) {
      throw Exception('Failed to load transactions: $e');
    }
  }

  // Format phone number to M-Pesa format (+254...)
  static String formatPhoneNumber(String phoneNumber) {
    // Remove all non-digit characters
    String cleaned = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254${cleaned.substring(1)}';
    }

    // If doesn't start with country code, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254$cleaned';
    }

    return '+$cleaned';
  }

  // Validate Kenyan phone number
  static bool isValidKenyanPhone(String phoneNumber) {
    final formatted = formatPhoneNumber(phoneNumber);
    // Kenyan numbers: +254 followed by 9 digits (7XX, 1XX, etc.)
    return RegExp(r'^\+254[17]\d{8}$').hasMatch(formatted);
  }
}
