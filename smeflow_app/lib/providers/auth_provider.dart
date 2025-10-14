import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';

enum AuthState {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthState _state = AuthState.initial;
  User? _user;
  String? _error;

  AuthState get state => _state;
  User? get user => _user;
  String? get error => _error;
  bool get isAuthenticated => _state == AuthState.authenticated;
  bool get isLoading => _state == AuthState.loading;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      if (_authService.isLoggedIn()) {
        _state = AuthState.loading;
        notifyListeners();

        final currentUser = await _authService.getCurrentUser();
        if (currentUser != null) {
          _user = currentUser;
          _state = AuthState.authenticated;
        } else {
          _state = AuthState.unauthenticated;
        }
      } else {
        _state = AuthState.unauthenticated;
      }
    } catch (e) {
      _state = AuthState.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> register({
    required String email,
    required String phone,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
  }) async {
    try {
      _state = AuthState.loading;
      _error = null;
      notifyListeners();

      final result = await _authService.register(
        email: email,
        phone: phone,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      );

      if (result['success']) {
        _user = result['user'];
        _state = AuthState.authenticated;
        notifyListeners();
        return true;
      } else {
        _error = result['error'];
        _state = AuthState.error;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'An unexpected error occurred';
      _state = AuthState.error;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    try {
      _state = AuthState.loading;
      _error = null;
      notifyListeners();

      final result = await _authService.login(
        email: email,
        password: password,
        rememberMe: rememberMe,
      );

      if (result['success']) {
        _user = result['user'];
        _state = AuthState.authenticated;
        notifyListeners();
        return true;
      } else {
        _error = result['error'];
        _state = AuthState.error;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'An unexpected error occurred';
      _state = AuthState.error;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      _state = AuthState.loading;
      notifyListeners();

      await _authService.logout();
      _user = null;
      _state = AuthState.unauthenticated;
      notifyListeners();
    } catch (e) {
      _error = 'Logout failed';
      _state = AuthState.error;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    if (_state == AuthState.error) {
      _state = _user != null ? AuthState.authenticated : AuthState.unauthenticated;
    }
    notifyListeners();
  }
}
