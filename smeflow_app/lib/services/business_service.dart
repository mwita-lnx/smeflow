import '../models/business.dart';
import 'api_service.dart';

class BusinessService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> searchBusinesses({
    String? query,
    String? category,
    String? county,
    double? minRating,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (query != null && query.isNotEmpty) queryParams['q'] = query;
      if (category != null) queryParams['category'] = category;
      if (county != null) queryParams['county'] = county;
      if (minRating != null) queryParams['minRating'] = minRating;

      final response = await _apiService.get('/businesses', queryParameters: queryParams);
      final data = response.data;

      if (data['success']) {
        // Handle nested data structure: data.data.data (array) or data.data.results
        var businessData = data['data'];
        var results = businessData['results'] ?? businessData['data'];

        final List<Business> businesses = results != null
            ? (results as List).map((json) => Business.fromJson(json)).toList()
            : [];

        return {
          'success': true,
          'businesses': businesses,
          'pagination': businessData['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getBusinessById(String id) async {
    try {
      final response = await _apiService.get('/businesses/$id');
      final data = response.data;

      if (data['success']) {
        final business = Business.fromJson(data['data']);
        return {'success': true, 'business': business};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getNearbyBusinesses({
    required double latitude,
    required double longitude,
    double maxDistance = 10000,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = {
        'latitude': latitude,
        'longitude': longitude,
        'maxDistance': maxDistance,
        'page': page,
        'limit': limit,
      };

      final response = await _apiService.get('/businesses/nearby', queryParameters: queryParams);
      final data = response.data;

      if (data['success']) {
        final results = data['data']['results'];
        final List<Business> businesses = results != null
            ? (results as List).map((json) => Business.fromJson(json)).toList()
            : [];

        return {
          'success': true,
          'businesses': businesses,
          'pagination': data['data']['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> createBusiness(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.post('/businesses', data: data);
      final responseData = response.data;

      if (responseData['success']) {
        final business = Business.fromJson(responseData['data']);
        return {'success': true, 'business': business};
      } else {
        return {'success': false, 'error': responseData['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateBusiness(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.put('/businesses/$id', data: data);
      final responseData = response.data;

      if (responseData['success']) {
        final business = Business.fromJson(responseData['data']);
        return {'success': true, 'business': business};
      } else {
        return {'success': false, 'error': responseData['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<bool> incrementViewCount(String id) async {
    try {
      await _apiService.post('/businesses/$id/view');
      return true;
    } catch (e) {
      return false;
    }
  }
}
