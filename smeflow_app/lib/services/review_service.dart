import '../models/review.dart';
import 'api_service.dart';

class ReviewService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> createReview({
    required String businessId,
    required int rating,
    String? comment,
  }) async {
    try {
      final response = await _apiService.post('/ratings', data: {
        'business': businessId,
        'rating': rating,
        'reviewText': comment,
      });

      final data = response.data;
      if (data['success']) {
        final review = Review.fromJson(data['data']);
        return {'success': true, 'review': review};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Create review error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateReview({
    required String reviewId,
    required int rating,
    String? comment,
  }) async {
    try {
      final response = await _apiService.put('/ratings/$reviewId', data: {
        'rating': rating,
        'reviewText': comment,
      });

      final data = response.data;
      if (data['success']) {
        final review = Review.fromJson(data['data']);
        return {'success': true, 'review': review};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Update review error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteReview(String reviewId) async {
    try {
      final response = await _apiService.delete('/ratings/$reviewId');

      final data = response.data;
      if (data['success']) {
        return {'success': true};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Delete review error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getBusinessReviews({
    required String businessId,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _apiService.get(
        '/ratings/business/$businessId',
        queryParameters: {
          'page': page,
          'limit': limit,
        },
      );

      final data = response.data;
      if (data['success']) {
        final reviews = (data['data']['ratings'] as List)
            .map((json) => Review.fromJson(json))
            .toList();
        return {
          'success': true,
          'reviews': reviews,
          'pagination': data['data']['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get business reviews error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getUserReviews({
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final response = await _apiService.get(
        '/ratings/my-ratings',
        queryParameters: {
          'page': page,
          'limit': limit,
        },
      );

      final data = response.data;
      if (data['success']) {
        final reviews = (data['data']['ratings'] as List)
            .map((json) => Review.fromJson(json))
            .toList();
        return {
          'success': true,
          'reviews': reviews,
          'pagination': data['data']['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get user reviews error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> checkUserReview(String businessId) async {
    try {
      final response = await _apiService.get(
        '/ratings/business/$businessId/my-rating',
      );

      final data = response.data;
      if (data['success'] && data['data'] != null) {
        final review = Review.fromJson(data['data']);
        return {'success': true, 'review': review, 'hasReviewed': true};
      } else {
        return {'success': true, 'hasReviewed': false};
      }
    } catch (e) {
      print('Check user review error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }
}
