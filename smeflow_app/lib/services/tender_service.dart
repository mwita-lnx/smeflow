import '../models/tender.dart';
import '../models/bid.dart';
import 'api_service.dart';

class TenderService {
  final ApiService _apiService = ApiService();

  // Tender operations
  Future<Map<String, dynamic>> getTenders({
    String? status,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };
      if (status != null) queryParams['status'] = status;
      if (category != null) queryParams['category'] = category;

      final response = await _apiService.get(
        '/tenders',
        queryParameters: queryParams,
      );

      final data = response.data;
      if (data['success']) {
        final List<dynamic> tendersList =
            data['data']['results'] ?? data['data']['data'] ?? data['data']['tenders'] ?? [];
        final tenders =
            tendersList.map((json) => Tender.fromJson(json)).toList();
        return {
          'success': true,
          'tenders': tenders,
          'pagination': data['data']['pagination'],
        };
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get tenders error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getTenderById(String tenderId) async {
    try {
      final response = await _apiService.get('/tenders/$tenderId');

      final data = response.data;
      if (data['success']) {
        final tender = Tender.fromJson(data['data']);
        return {'success': true, 'tender': tender};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get tender error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> createTender({
    required String title,
    required String description,
    required String category,
    required double budgetMin,
    required double budgetMax,
    required DateTime deadline,
    required String county,
    String? subCounty,
    required List<String> requirements,
  }) async {
    try {
      final response = await _apiService.post('/tenders', data: {
        'title': title,
        'description': description,
        'category': category,
        'budget': {
          'min': budgetMin,
          'max': budgetMax,
          'currency': 'KES',
        },
        'deadline': deadline.toIso8601String(),
        'location': {
          'county': county,
          'subCounty': subCounty,
        },
        'requirements': requirements,
      });

      final data = response.data;
      if (data['success']) {
        final tender = Tender.fromJson(data['data']);
        return {'success': true, 'tender': tender};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Create tender error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateTender({
    required String tenderId,
    String? title,
    String? description,
    String? category,
    double? budgetMin,
    double? budgetMax,
    DateTime? deadline,
    String? county,
    String? subCounty,
    List<String>? requirements,
  }) async {
    try {
      final updateData = <String, dynamic>{};
      if (title != null) updateData['title'] = title;
      if (description != null) updateData['description'] = description;
      if (category != null) updateData['category'] = category;
      if (budgetMin != null && budgetMax != null) {
        updateData['budget'] = {
          'min': budgetMin,
          'max': budgetMax,
          'currency': 'KES',
        };
      }
      if (deadline != null) {
        updateData['deadline'] = deadline.toIso8601String();
      }
      if (county != null) {
        updateData['location'] = {
          'county': county,
          'subCounty': subCounty,
        };
      }
      if (requirements != null) updateData['requirements'] = requirements;

      final response =
          await _apiService.put('/tenders/$tenderId', data: updateData);

      final data = response.data;
      if (data['success']) {
        final tender = Tender.fromJson(data['data']);
        return {'success': true, 'tender': tender};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Update tender error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteTender(String tenderId) async {
    try {
      final response = await _apiService.delete('/tenders/$tenderId');

      final data = response.data;
      if (data['success']) {
        return {'success': true};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Delete tender error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> closeTender(String tenderId) async {
    try {
      final response = await _apiService.post('/tenders/$tenderId/close');

      final data = response.data;
      if (data['success']) {
        final tender = Tender.fromJson(data['data']);
        return {'success': true, 'tender': tender};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Close tender error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  // Bid operations
  Future<Map<String, dynamic>> getTenderBids(String tenderId) async {
    try {
      final response = await _apiService.get('/bids/tender/$tenderId');

      final data = response.data;
      if (data['success']) {
        final List<dynamic> bidsList =
            data['data']['results'] ?? data['data']['data'] ?? data['data']['bids'] ?? [];
        final bids = bidsList.map((json) => Bid.fromJson(json)).toList();
        return {'success': true, 'bids': bids};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get tender bids error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> createBid({
    required String tenderId,
    required double amount,
    required String proposal,
    required int deliveryDays,
    required String businessId,
  }) async {
    try {
      final response = await _apiService.post('/bids/tender/$tenderId', data: {
        'businessId': businessId,
        'amount': amount,
        'currency': 'KES',
        'proposal': proposal,
        'deliveryTime': deliveryDays,
      });

      final data = response.data;
      if (data['success']) {
        final bid = Bid.fromJson(data['data']);
        return {'success': true, 'bid': bid};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Create bid error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateBid({
    required String bidId,
    double? amount,
    String? proposal,
    int? deliveryDays,
  }) async {
    try {
      final updateData = <String, dynamic>{};
      if (amount != null) {
        updateData['amount'] = amount;
        updateData['currency'] = 'KES';
      }
      if (proposal != null) updateData['proposal'] = proposal;
      if (deliveryDays != null) updateData['deliveryDays'] = deliveryDays;

      final response = await _apiService.put('/bids/$bidId', data: updateData);

      final data = response.data;
      if (data['success']) {
        final bid = Bid.fromJson(data['data']);
        return {'success': true, 'bid': bid};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Update bid error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> deleteBid(String bidId) async {
    try {
      final response = await _apiService.delete('/bids/$bidId');

      final data = response.data;
      if (data['success']) {
        return {'success': true};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Delete bid error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> acceptBid(String bidId) async {
    try {
      final response = await _apiService.post('/bids/$bidId/accept');

      final data = response.data;
      if (data['success']) {
        final bid = Bid.fromJson(data['data']);
        return {'success': true, 'bid': bid};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Accept bid error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> rejectBid(String bidId) async {
    try {
      final response = await _apiService.post('/bids/$bidId/reject');

      final data = response.data;
      if (data['success']) {
        final bid = Bid.fromJson(data['data']);
        return {'success': true, 'bid': bid};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Reject bid error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> getMyBids() async {
    try {
      final response = await _apiService.get('/bids/my-bids');

      final data = response.data;
      if (data['success']) {
        final List<dynamic> bidsList =
            data['data']['data'] ?? data['data']['bids'] ?? [];
        final bids = bidsList.map((json) => Bid.fromJson(json)).toList();
        return {'success': true, 'bids': bids};
      } else {
        return {'success': false, 'error': data['message']};
      }
    } catch (e) {
      print('Get my bids error: $e');
      return {'success': false, 'error': e.toString()};
    }
  }
}
