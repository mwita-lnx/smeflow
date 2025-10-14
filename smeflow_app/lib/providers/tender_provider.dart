import 'package:flutter/foundation.dart';
import '../models/tender.dart';
import '../models/bid.dart';
import '../services/tender_service.dart';

class TenderProvider with ChangeNotifier {
  final TenderService _tenderService = TenderService();

  List<Tender> _tenders = [];
  Tender? _selectedTender;
  List<Bid> _bids = [];
  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _pagination;

  List<Tender> get tenders => _tenders;
  Tender? get selectedTender => _selectedTender;
  List<Bid> get bids => _bids;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Map<String, dynamic>? get pagination => _pagination;

  // Load tenders
  Future<void> loadTenders({
    String? status,
    String? category,
    int page = 1,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.getTenders(
        status: status,
        category: category,
        page: page,
      );

      if (result['success']) {
        if (page == 1) {
          _tenders = result['tenders'];
        } else {
          _tenders.addAll(result['tenders']);
        }
        _pagination = result['pagination'];
      } else {
        _error = result['error'];
      }
    } catch (e) {
      _error = 'Failed to load tenders';
    }

    _isLoading = false;
    notifyListeners();
  }

  // Get tender by ID
  Future<void> getTenderById(String tenderId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.getTenderById(tenderId);

      if (result['success']) {
        _selectedTender = result['tender'];
      } else {
        _error = result['error'];
      }
    } catch (e) {
      _error = 'Failed to load tender';
    }

    _isLoading = false;
    notifyListeners();
  }

  // Create tender
  Future<bool> createTender({
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
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.createTender(
        title: title,
        description: description,
        category: category,
        budgetMin: budgetMin,
        budgetMax: budgetMax,
        deadline: deadline,
        county: county,
        subCounty: subCounty,
        requirements: requirements,
      );

      if (result['success']) {
        _tenders.insert(0, result['tender']);
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
      _error = 'Failed to create tender';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update tender
  Future<bool> updateTender({
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
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.updateTender(
        tenderId: tenderId,
        title: title,
        description: description,
        category: category,
        budgetMin: budgetMin,
        budgetMax: budgetMax,
        deadline: deadline,
        county: county,
        subCounty: subCounty,
        requirements: requirements,
      );

      if (result['success']) {
        final index = _tenders.indexWhere((t) => t.id == tenderId);
        if (index != -1) {
          _tenders[index] = result['tender'];
        }
        if (_selectedTender?.id == tenderId) {
          _selectedTender = result['tender'];
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
      _error = 'Failed to update tender';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete tender
  Future<bool> deleteTender(String tenderId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.deleteTender(tenderId);

      if (result['success']) {
        _tenders.removeWhere((t) => t.id == tenderId);
        if (_selectedTender?.id == tenderId) {
          _selectedTender = null;
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
      _error = 'Failed to delete tender';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load tender bids
  Future<void> loadTenderBids(String tenderId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.getTenderBids(tenderId);

      if (result['success']) {
        _bids = result['bids'];
      } else {
        _error = result['error'];
      }
    } catch (e) {
      _error = 'Failed to load bids';
    }

    _isLoading = false;
    notifyListeners();
  }

  // Create bid
  Future<bool> createBid({
    required String tenderId,
    required double amount,
    required String proposal,
    required int deliveryDays,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.createBid(
        tenderId: tenderId,
        amount: amount,
        proposal: proposal,
        deliveryDays: deliveryDays,
      );

      if (result['success']) {
        _bids.insert(0, result['bid']);
        // Update tender bid count
        if (_selectedTender?.id == tenderId) {
          // Reload tender to get updated bid count
          await getTenderById(tenderId);
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
      _error = 'Failed to create bid';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Accept bid
  Future<bool> acceptBid(String bidId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.acceptBid(bidId);

      if (result['success']) {
        final index = _bids.indexWhere((b) => b.id == bidId);
        if (index != -1) {
          _bids[index] = result['bid'];
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
      _error = 'Failed to accept bid';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Reject bid
  Future<bool> rejectBid(String bidId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _tenderService.rejectBid(bidId);

      if (result['success']) {
        final index = _bids.indexWhere((b) => b.id == bidId);
        if (index != -1) {
          _bids[index] = result['bid'];
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
      _error = 'Failed to reject bid';
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
    _tenders = [];
    _selectedTender = null;
    _bids = [];
    _isLoading = false;
    _error = null;
    _pagination = null;
    notifyListeners();
  }
}
