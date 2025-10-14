class ApiConfig {
  // Base URLs
  static const String baseUrl = 'https://vexatiously-monotropic-madelaine.ngrok-free.app'; // ngrok tunnel
  // static const String baseUrl = 'http://10.0.2.2:5000'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000'; // iOS simulator / Desktop
  // static const String baseUrl = 'https://your-domain.com'; // Production

  static const String apiVersion = 'v1';
  static const String apiBaseUrl = '$baseUrl/api/$apiVersion';

  // Endpoints
  static const String auth = '/auth';
  static const String users = '/users';
  static const String businesses = '/businesses';
  static const String products = '/products';
  static const String categories = '/categories';
  static const String locations = '/locations';
  static const String ratings = '/ratings';
  static const String admin = '/admin';

  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  static const String rememberMeKey = 'remember_me';
}
