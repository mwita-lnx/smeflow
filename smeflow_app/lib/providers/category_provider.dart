import 'package:flutter/foundation.dart';
import '../models/category.dart' as models;
import '../services/category_service.dart';

enum CategoryState {
  initial,
  loading,
  loaded,
  error,
}

class CategoryProvider with ChangeNotifier {
  final CategoryService _categoryService = CategoryService();

  CategoryState _state = CategoryState.initial;
  List<models.Category> _categories = [];
  String? _error;

  CategoryState get state => _state;
  List<models.Category> get categories => _categories;
  String? get error => _error;
  bool get isLoading => _state == CategoryState.loading;

  Future<void> loadCategories() async {
    try {
      _state = CategoryState.loading;
      notifyListeners();

      final result = await _categoryService.getAllCategories();

      if (result['success']) {
        _categories = result['categories'];
        _state = CategoryState.loaded;
        _error = null;
      } else {
        _error = result['error'];
        _state = CategoryState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = CategoryState.error;
    }
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
