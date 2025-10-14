class Product {
  final String id;
  final String businessId;
  final String name;
  final String description;
  final double price;
  final String? currency;
  final List<String> images;
  final bool isAvailable;
  final String? category;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.businessId,
    required this.name,
    required this.description,
    required this.price,
    this.currency,
    required this.images,
    required this.isAvailable,
    this.category,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    // Handle business field - it can be a String (ID) or an Object (populated)
    String businessId = '';
    if (json['business'] != null) {
      if (json['business'] is String) {
        businessId = json['business'];
      } else if (json['business'] is Map) {
        businessId = json['business']['_id'] ?? '';
      }
    }

    return Product(
      id: json['_id'] ?? '',
      businessId: businessId,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'KES',
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      isAvailable: json['isAvailable'] ?? true,
      category: json['category'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'business': businessId,
      'name': name,
      'description': description,
      'price': price,
      'currency': currency,
      'images': images,
      'isAvailable': isAvailable,
      'category': category,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  String get displayPrice {
    return '${currency ?? 'KES'} ${price.toStringAsFixed(2)}';
  }

  String get mainImage {
    return images.isNotEmpty ? images.first : '';
  }
}
