import 'package:flutter/foundation.dart';
import '../models/review.dart';
import '../services/review_service.dart';

class ReviewProvider with ChangeNotifier {
  final ReviewService _reviewService = ReviewService();

  List<Review> _reviews = [];
  Review? _userReview;
  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _pagination;

  List<Review> get reviews => _reviews;
  Review? get userReview => _userReview;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Map<String, dynamic>? get pagination => _pagination;

  Future<void> loadBusinessReviews(String businessId, {int page = 1}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _reviewService.getBusinessReviews(
        businessId: businessId,
        page: page,
      );

      if (result['success']) {
        if (page == 1) {
          _reviews = result['reviews'];
        } else {
          _reviews.addAll(result['reviews']);
        }
        _pagination = result['pagination'];
      } else {
        _error = result['error'];
      }
    } catch (e) {
      _error = 'Failed to load reviews';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> checkUserReview(String businessId) async {
    try {
      final result = await _reviewService.checkUserReview(businessId);
      if (result['success'] && result['hasReviewed']) {
        _userReview = result['review'];
        notifyListeners();
      }
    } catch (e) {
      // Silent fail - user just hasn't reviewed yet
    }
  }

  Future<bool> createReview({
    required String businessId,
    required int rating,
    String? comment,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _reviewService.createReview(
        businessId: businessId,
        rating: rating,
        comment: comment,
      );

      if (result['success']) {
        _userReview = result['review'];
        _reviews.insert(0, result['review']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['error'];
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Failed to create review';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateReview({
    required String reviewId,
    required int rating,
    String? comment,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _reviewService.updateReview(
        reviewId: reviewId,
        rating: rating,
        comment: comment,
      );

      if (result['success']) {
        _userReview = result['review'];
        final index = _reviews.indexWhere((r) => r.id == reviewId);
        if (index != -1) {
          _reviews[index] = result['review'];
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['error'];
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Failed to update review';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteReview(String reviewId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _reviewService.deleteReview(reviewId);

      if (result['success']) {
        _reviews.removeWhere((r) => r.id == reviewId);
        if (_userReview?.id == reviewId) {
          _userReview = null;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['error'];
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Failed to delete review';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void reset() {
    _reviews = [];
    _userReview = null;
    _isLoading = false;
    _error = null;
    _pagination = null;
    notifyListeners();
  }
}
