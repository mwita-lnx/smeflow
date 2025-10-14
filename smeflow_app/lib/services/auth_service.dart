import 'dart:convert';
import '../models/user.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> register({
    required String email,
    required String phone,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
  }) async {
    try {
      final response = await _apiService.post('/auth/register', data: {
        'email': email,
        'phone': phone,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'role': role,
      });

      print('Register response: ${response.data}');
      final data = response.data;
      if (data['success']) {
        print('User data from API: ${data['data']['user']}');
        final user = User.fromJson(data['data']['user']);
        final token = data['data']['accessToken'] ?? data['data']['token'];
        final refreshToken = data['data']['refreshToken'];

        await StorageService.saveToken(token);
        await StorageService.saveRefreshToken(refreshToken);
        await StorageService.saveUserData(user.toJson());

        return {'success': true, 'user': user};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e, stackTrace) {
      print('Register error: $e');
      print('Stack trace: $stackTrace');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    try {
      final response = await _apiService.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      print('Login response: ${response.data}');
      final data = response.data;
      if (data['success']) {
        print('User data from API: ${data['data']['user']}');
        final user = User.fromJson(data['data']['user']);
        final token = data['data']['accessToken'] ?? data['data']['token'];
        final refreshToken = data['data']['refreshToken'];

        await StorageService.saveToken(token);
        await StorageService.saveRefreshToken(refreshToken);
        await StorageService.saveUserData(user.toJson());
        await StorageService.setRememberMe(rememberMe);

        return {'success': true, 'user': user};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e, stackTrace) {
      print('Login error: $e');
      print('Stack trace: $stackTrace');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<void> logout() async {
    await StorageService.removeTokens();
    await StorageService.removeUserData();
  }

  Future<User?> getCurrentUser() async {
    try {
      final userData = StorageService.getUserData();
      if (userData != null) {
        return User.fromJson(userData);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  bool isLoggedIn() {
    return StorageService.getToken() != null;
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = StorageService.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await _apiService.post('/auth/refresh-token', data: {
        'refreshToken': refreshToken,
      });

      final data = response.data;
      if (data['success']) {
        final token = data['data']['accessToken'] ?? data['data']['token'];
        await StorageService.saveToken(token);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
