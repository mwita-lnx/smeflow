import 'package:smeflow_app/models/analytics.dart';
import 'package:smeflow_app/services/api_service.dart';

class AnalyticsService {
  final ApiService _apiService;

  AnalyticsService(this._apiService);

  // Track an analytics event
  Future<void> trackEvent({
    required String businessId,
    required String eventType,
    String? userId,
    String? userRole,
    Map<String, dynamic>? metadata,
    String? sessionId,
  }) async {
    try {
      await _apiService.post('/analytics/track', data: {
        'businessId': businessId,
        'eventType': eventType,
        if (userId != null) 'userId': userId,
        if (userRole != null) 'userRole': userRole,
        if (metadata != null) 'metadata': metadata,
        if (sessionId != null) 'sessionId': sessionId,
      });
    } catch (e) {
      // Silently fail analytics tracking - don't disrupt user experience
      print('Analytics tracking failed: $e');
    }
  }

  // Get all businesses analytics summary
  Future<List<BusinessAnalyticsSummary>> getAllBusinessesAnalytics() async {
    try {
      final response = await _apiService.get('/analytics/my-businesses');
      final data = response.data['data'];

      if (data is List) {
        return data.map((item) => BusinessAnalyticsSummary.fromJson(item)).toList();
      }

      return [];
    } catch (e) {
      print('Error fetching all businesses analytics: $e');
      rethrow;
    }
  }

  // Get business analytics overview
  Future<Map<String, dynamic>> getBusinessOverview(
    String businessId, {
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (startDate != null) {
        queryParams['startDate'] = startDate.toIso8601String();
      }
      if (endDate != null) {
        queryParams['endDate'] = endDate.toIso8601String();
      }

      final uri = Uri(
        path: '/analytics/business/$businessId/overview',
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final response = await _apiService.get(uri.toString());
      final data = response.data['data'];

      return {
        'overview': AnalyticsOverview.fromJson(data['overview'] ?? {}),
        'viewsTrend': (data['viewsTrend'] as List?)
                ?.map((e) => ViewsTrendData.fromJson(e))
                .toList() ??
            [],
        'topSources': (data['topSources'] as List?)
                ?.map((e) => SourceData.fromJson(e))
                .toList() ??
            [],
      };
    } catch (e) {
      print('Error fetching business overview: $e');
      rethrow;
    }
  }

  // Get customer demographics
  Future<CustomerDemographics> getCustomerDemographics(
    String businessId, {
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (startDate != null) {
        queryParams['startDate'] = startDate.toIso8601String();
      }
      if (endDate != null) {
        queryParams['endDate'] = endDate.toIso8601String();
      }

      final uri = Uri(
        path: '/analytics/business/$businessId/demographics',
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final response = await _apiService.get(uri.toString());
      return CustomerDemographics.fromJson(response.data['data']);
    } catch (e) {
      print('Error fetching demographics: $e');
      rethrow;
    }
  }

  // Get engagement metrics
  Future<EngagementMetrics> getEngagementMetrics(String businessId) async {
    try {
      final response = await _apiService.get('/analytics/business/$businessId/engagement');
      return EngagementMetrics.fromJson(response.data['data']);
    } catch (e) {
      print('Error fetching engagement metrics: $e');
      rethrow;
    }
  }

  // Get time-based analytics
  Future<List<Map<String, dynamic>>> getTimeBasedAnalytics(
    String businessId, {
    String period = 'week',
  }) async {
    try {
      final response = await _apiService.get(
        '/analytics/business/$businessId/time-based?period=$period',
      );
      final data = response.data['data'] as List;
      return data.map((e) => e as Map<String, dynamic>).toList();
    } catch (e) {
      print('Error fetching time-based analytics: $e');
      rethrow;
    }
  }
}
