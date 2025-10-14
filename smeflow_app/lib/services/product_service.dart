import '../models/product.dart';
import 'api_service.dart';

class ProductService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> getProducts({
    String? businessId,
    String? category,
    String? query,
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

      String endpoint = '/products';
      if (businessId != null) {
        endpoint = '/products/business/$businessId';
      }

      final response = await _apiService.get(endpoint, queryParameters: queryParams);
      final data = response.data;

      if (data['success']) {
        final results = data['data']['results'] ?? data['data'];
        final List<Product> products = results != null
            ? (results is List ? results : [results])
                .map((json) => Product.fromJson(json))
                .toList()
            : [];

        return {
          'success': true,
          'products': products,
          'pagination': data['data']['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getProductById(String id) async {
    try {
      final response = await _apiService.get('/products/$id');
      final data = response.data;

      if (data['success']) {
        final product = Product.fromJson(data['data']);
        return {'success': true, 'product': product};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> createProduct(Map<String, dynamic> data) async {
    try {
      final response = await _apiService.post('/products', data: data);
      final responseData = response.data;

      if (responseData['success']) {
        final product = Product.fromJson(responseData['data']);
        return {'success': true, 'product': product};
      } else {
        return {'success': false, 'error': responseData['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      final response = await _apiService.put('/products/$id', data: data);
      final responseData = response.data;

      if (responseData['success']) {
        final product = Product.fromJson(responseData['data']);
        return {'success': true, 'product': product};
      } else {
        return {'success': false, 'error': responseData['message']};
      }
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteProduct(String id) async {
    try {
      final response = await _apiService.delete('/products/$id');
      final data = response.data;

      return {'success': data['success'], 'message': data['message']};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }
}
