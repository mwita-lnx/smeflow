import '../models/category.dart' as models;
import 'api_service.dart';

class CategoryService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> getAllCategories() async {
    try {
      final response = await _apiService.get('/categories');
      final data = response.data;

      if (data['success']) {
        final List<models.Category> categories = (data['data'] as List)
            .map((json) => models.Category.fromJson(json))
            .toList();

        return {'success': true, 'categories': categories};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getCategoryBySlug(String slug) async {
    try {
      final response = await _apiService.get('/categories/$slug');
      final data = response.data;

      if (data['success']) {
        final category = models.Category.fromJson(data['data']);
        return {'success': true, 'category': category};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }
}
