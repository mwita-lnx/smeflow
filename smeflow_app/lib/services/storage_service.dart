import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StorageService {
  static SharedPreferences? _preferences;

  static Future<void> init() async {
    _preferences = await SharedPreferences.getInstance();
  }

  // Token management
  static Future<bool> saveToken(String token) async {
    return await _preferences?.setString('auth_token', token) ?? false;
  }

  static String? getToken() {
    return _preferences?.getString('auth_token');
  }

  static Future<bool> saveRefreshToken(String token) async {
    return await _preferences?.setString('refresh_token', token) ?? false;
  }

  static String? getRefreshToken() {
    return _preferences?.getString('refresh_token');
  }

  static Future<bool> removeTokens() async {
    await _preferences?.remove('auth_token');
    await _preferences?.remove('refresh_token');
    return true;
  }

  // User data
  static Future<bool> saveUserData(Map<String, dynamic> userData) async {
    final jsonString = json.encode(userData);
    return await _preferences?.setString('user_data', jsonString) ?? false;
  }

  static Map<String, dynamic>? getUserData() {
    final jsonString = _preferences?.getString('user_data');
    if (jsonString != null) {
      return json.decode(jsonString) as Map<String, dynamic>;
    }
    return null;
  }

  static Future<bool> removeUserData() async {
    return await _preferences?.remove('user_data') ?? false;
  }

  // Remember me
  static Future<bool> setRememberMe(bool value) async {
    return await _preferences?.setBool('remember_me', value) ?? false;
  }

  static bool getRememberMe() {
    return _preferences?.getBool('remember_me') ?? false;
  }

  // Recent searches
  static Future<bool> addRecentSearch(String query) async {
    final searches = getRecentSearches();
    searches.remove(query); // Remove if exists
    searches.insert(0, query); // Add to beginning
    if (searches.length > 10) {
      searches.removeLast(); // Keep only 10
    }
    return await _preferences?.setStringList('recent_searches', searches) ?? false;
  }

  static List<String> getRecentSearches() {
    return _preferences?.getStringList('recent_searches') ?? [];
  }

  static Future<bool> clearRecentSearches() async {
    return await _preferences?.remove('recent_searches') ?? false;
  }

  // Favorites
  static Future<bool> addFavorite(String businessId) async {
    final favorites = getFavorites();
    if (!favorites.contains(businessId)) {
      favorites.add(businessId);
      return await _preferences?.setStringList('favorites', favorites) ?? false;
    }
    return true;
  }

  static Future<bool> removeFavorite(String businessId) async {
    final favorites = getFavorites();
    favorites.remove(businessId);
    return await _preferences?.setStringList('favorites', favorites) ?? false;
  }

  static List<String> getFavorites() {
    return _preferences?.getStringList('favorites') ?? [];
  }

  static bool isFavorite(String businessId) {
    return getFavorites().contains(businessId);
  }

  // Clear all data
  static Future<bool> clearAll() async {
    return await _preferences?.clear() ?? false;
  }
}
