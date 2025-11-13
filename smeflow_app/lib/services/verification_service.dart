import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'storage_service.dart';

class VerificationService {
  static const String _baseUrl = ApiConfig.apiBaseUrl;

  // Verify product by QR code (public endpoint - no auth required)
  static Future<Map<String, dynamic>> verifyProductByQR({
    required String qrCode,
    double? latitude,
    double? longitude,
    String? deviceInfo,
  }) async {
    try {
      final token = StorageService.getToken();
      final headers = <String, String>{
        'Content-Type': 'application/json',
      };

      // Add token if available (optional auth)
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final body = <String, dynamic>{
        'qrCode': qrCode,
      };

      if (latitude != null && longitude != null) {
        body['location'] = {
          'type': 'Point',
          'coordinates': [longitude, latitude],
        };
      }

      if (deviceInfo != null) {
        body['deviceInfo'] = deviceInfo;
      }

      final response = await http.post(
        Uri.parse('$_baseUrl/verifications/verify'),
        headers: headers,
        body: jsonEncode(body),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Verification failed');
      }
    } catch (e) {
      throw Exception('QR code verification failed: $e');
    }
  }

  // Get verification details by ID
  static Future<Map<String, dynamic>> getVerificationDetails(
      String verificationId) async {
    try {
      final token = StorageService.getToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('$_baseUrl/verifications/$verificationId'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to load verification details');
      }
    } catch (e) {
      throw Exception('Failed to load verification: $e');
    }
  }

  // Get product verifications (for business owners)
  static Future<Map<String, dynamic>> getProductVerifications({
    String? productId,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final token = StorageService.getToken();
      if (token == null) {
        throw Exception('Not authenticated');
      }

      var url = '$_baseUrl/verifications?page=$page&limit=$limit';
      if (productId != null) {
        url += '&product=$productId';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to load verifications');
      }
    } catch (e) {
      throw Exception('Failed to load verifications: $e');
    }
  }

  // Validate QR code format
  static bool isValidQRCode(String qrCode) {
    // SmeFlow QR codes: SF-[timestamp36]-[random12]
    return RegExp(r'^SF-[a-z0-9]+-[a-z0-9]+$', caseSensitive: false)
        .hasMatch(qrCode);
  }
}
