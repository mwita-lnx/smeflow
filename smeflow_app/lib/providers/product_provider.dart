import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/product_service.dart';

enum ProductState {
  initial,
  loading,
  loaded,
  error,
}

class ProductProvider with ChangeNotifier {
  final ProductService _productService = ProductService();

  ProductState _state = ProductState.initial;
  List<Product> _products = [];
  Product? _selectedProduct;
  String? _error;
  Map<String, dynamic>? _pagination;

  // Filters
  String? _searchQuery;
  String? _selectedCategory;
  String? _businessId;

  ProductState get state => _state;
  List<Product> get products => _products;
  Product? get selectedProduct => _selectedProduct;
  String? get error => _error;
  Map<String, dynamic>? get pagination => _pagination;

  String? get searchQuery => _searchQuery;
  String? get selectedCategory => _selectedCategory;
  String? get businessId => _businessId;

  bool get isLoading => _state == ProductState.loading;
  bool get hasError => _state == ProductState.error;

  Future<void> loadProducts({
    String? businessId,
    String? query,
    String? category,
    int page = 1,
    bool append = false,
  }) async {
    try {
      if (!append) {
        _state = ProductState.loading;
        notifyListeners();
      }

      _searchQuery = query;
      _selectedCategory = category;
      _businessId = businessId;

      final result = await _productService.getProducts(
        businessId: businessId,
        query: query,
        category: category,
        page: page,
      );

      if (result['success']) {
        if (append) {
          _products.addAll(result['products']);
        } else {
          _products = result['products'];
        }
        _pagination = result['pagination'];
        _state = ProductState.loaded;
        _error = null;
      } else {
        _error = result['error'];
        _state = ProductState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = ProductState.error;
    }
    notifyListeners();
  }

  Future<void> getProductById(String id) async {
    try {
      _state = ProductState.loading;
      notifyListeners();

      final result = await _productService.getProductById(id);

      if (result['success']) {
        _selectedProduct = result['product'];
        _state = ProductState.loaded;
        _error = null;
      } else {
        _error = result['error'];
        _state = ProductState.error;
      }
    } catch (e) {
      _error = e.toString();
      _state = ProductState.error;
    }
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = null;
    _selectedCategory = null;
    _businessId = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearSelectedProduct() {
    _selectedProduct = null;
    notifyListeners();
  }
}
