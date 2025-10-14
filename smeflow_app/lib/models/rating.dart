class Rating {
  final String id;
  final String businessId;
  final String userId;
  final String? userName;
  final int rating;
  final String? review;
  final List<String> images;
  final int helpfulCount;
  final bool flagged;
  final String? businessResponse;
  final DateTime? businessResponseDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  Rating({
    required this.id,
    required this.businessId,
    required this.userId,
    this.userName,
    required this.rating,
    this.review,
    required this.images,
    required this.helpfulCount,
    required this.flagged,
    this.businessResponse,
    this.businessResponseDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['_id'] ?? json['id'],
      businessId: json['business'],
      userId: json['user'] is String ? json['user'] : json['user']['_id'],
      userName: json['user'] is Map ? '${json['user']['firstName']} ${json['user']['lastName']}' : null,
      rating: json['rating'],
      review: json['review'],
      images: List<String>.from(json['images'] ?? []),
      helpfulCount: json['helpfulCount'] ?? 0,
      flagged: json['flagged'] ?? false,
      businessResponse: json['businessResponse'],
      businessResponseDate: json['businessResponseDate'] != null
          ? DateTime.parse(json['businessResponseDate'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'business': businessId,
      'user': userId,
      'rating': rating,
      'review': review,
      'images': images,
      'helpfulCount': helpfulCount,
      'flagged': flagged,
      'businessResponse': businessResponse,
      'businessResponseDate': businessResponseDate?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
