import 'package:flutter/foundation.dart';
import '../models/business.dart';
import '../services/business_service.dart';

enum BusinessState {
  initial,
  loading,
  loaded,
  error,
}

class BusinessProvider with ChangeNotifier {
  final BusinessService _businessService = BusinessService();

  BusinessState _state = BusinessState.initial;
  List<Business> _businesses = [];
  Business? _selectedBusiness;
  String? _error;
  Map<String, dynamic>? _pagination;

  // Filters
  String? _searchQuery;
  String? _selectedCategory;
  String? _selectedCounty;
  double? _minRating;

  BusinessState get state => _state;
  List<Business> get businesses => _businesses;
  Business? get selectedBusiness => _selectedBusiness;
  String? get error => _error;
  Map<String, dynamic>? get pagination => _pagination;

  String? get searchQuery => _searchQuery;
  String? get selectedCategory => _selectedCategory;
  String? get selectedCounty => _selectedCounty;
  double? get minRating => _minRating;

  bool get isLoading => _state == BusinessState.loading;
  bool get hasError => _state == BusinessState.error;

  Future<void> searchBusinesses({
    String? query,
    String? category,
    String? county,
    double? minRating,
    int page = 1,
    bool append = false,
  }) async {
    try {
      if (!append) {
        _state = BusinessState.loading;
        notifyListeners();
      }

      _searchQuery = query;
      _selectedCategory = category;
      _selectedCounty = county;
      _minRating = minRating;

      final result = await _businessService.searchBusinesses(
        query: query,
        category: category,
        county: county,
        minRating: minRating,
        page: page,
      );

      if (result['success']) {
        if (append) {
          _businesses.addAll(result['businesses']);
        } else {
          _businesses = result['businesses'];
        }
        _pagination = result['pagination'];
        _state = BusinessState.loaded;
        _error = null;
      } else {
        _error = result['error'];
        _state = BusinessState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = BusinessState.error;
    }
    notifyListeners();
  }

  Future<void> getBusinessById(String id) async {
    try {
      _state = BusinessState.loading;
      notifyListeners();

      final result = await _businessService.getBusinessById(id);

      if (result['success']) {
        _selectedBusiness = result['business'];
        _state = BusinessState.loaded;
        _error = null;

        // Increment view count
        _businessService.incrementViewCount(id);
      } else {
        _error = result['error'];
        _state = BusinessState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = BusinessState.error;
    }
    notifyListeners();
  }

  Future<void> getNearbyBusinesses({
    required double latitude,
    required double longitude,
    double maxDistance = 10000,
    int page = 1,
  }) async {
    try {
      _state = BusinessState.loading;
      notifyListeners();

      final result = await _businessService.getNearbyBusinesses(
        latitude: latitude,
        longitude: longitude,
        maxDistance: maxDistance,
        page: page,
      );

      if (result['success']) {
        _businesses = result['businesses'];
        _pagination = result['pagination'];
        _state = BusinessState.loaded;
        _error = null;
      } else {
        _error = result['error'];
        _state = BusinessState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = BusinessState.error;
    }
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = null;
    _selectedCategory = null;
    _selectedCounty = null;
    _minRating = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearSelectedBusiness() {
    _selectedBusiness = null;
    notifyListeners();
  }
}
