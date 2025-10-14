class Business {
  final String id;
  final String businessName;
  final String slug;
  final String description;
  final String category;
  final String county;
  final String? subCounty;
  final Location location;
  final String contactEmail;
  final String contactPhone;
  final String? website;
  final List<String> images;
  final String? logo;
  final String ownerId;
  final String status;
  final bool verified;
  final double averageRating;
  final int totalRatings;
  final int viewCount;
  final List<String>? businessHours;
  final DateTime createdAt;
  final DateTime updatedAt;

  Business({
    required this.id,
    required this.businessName,
    required this.slug,
    required this.description,
    required this.category,
    required this.county,
    this.subCounty,
    required this.location,
    required this.contactEmail,
    required this.contactPhone,
    this.website,
    required this.images,
    this.logo,
    required this.ownerId,
    required this.status,
    required this.verified,
    required this.averageRating,
    required this.totalRatings,
    required this.viewCount,
    this.businessHours,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    // Handle owner field - it can be a String (ID) or an Object (populated)
    String ownerId = '';
    if (json['owner'] != null) {
      if (json['owner'] is String) {
        ownerId = json['owner'];
      } else if (json['owner'] is Map) {
        ownerId = json['owner']['_id'] ?? '';
      }
    }

    return Business(
      id: json['_id'] ?? json['id'] ?? '',
      businessName: json['businessName'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      county: json['county'] ?? '',
      subCounty: json['subCounty'],
      location: Location.fromJson(json['location'] ?? {}),
      contactEmail: json['email'] ?? json['contactEmail'] ?? '',
      contactPhone: json['phone'] ?? json['contactPhone'] ?? '',
      website: json['website'],
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      logo: json['logo'],
      ownerId: ownerId,
      status: json['status'] ?? 'PENDING',
      verified: json['isVerified'] ?? json['verified'] ?? false,
      averageRating: (json['averageRating'] ?? 0).toDouble(),
      totalRatings: json['totalReviews'] ?? json['totalRatings'] ?? 0,
      viewCount: json['viewCount'] ?? 0,
      businessHours: json['businessHours'] != null
          ? List<String>.from(json['businessHours'])
          : null,
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
      'id': id,
      'businessName': businessName,
      'slug': slug,
      'description': description,
      'category': category,
      'county': county,
      'subCounty': subCounty,
      'location': location.toJson(),
      'contactEmail': contactEmail,
      'contactPhone': contactPhone,
      'website': website,
      'images': images,
      'logo': logo,
      'owner': ownerId,
      'status': status,
      'verified': verified,
      'averageRating': averageRating,
      'totalRatings': totalRatings,
      'viewCount': viewCount,
      'businessHours': businessHours,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class Location {
  final String type;
  final List<double> coordinates;
  final String? address;

  Location({
    required this.type,
    required this.coordinates,
    this.address,
  });

  double get latitude => coordinates[1];
  double get longitude => coordinates[0];

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      type: json['type'] ?? 'Point',
      coordinates: List<double>.from(json['coordinates']),
      address: json['address'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'coordinates': coordinates,
      'address': address,
    };
  }
}
