class Review {
  final String id;
  final String userId;
  final String? userName;
  final String? userProfilePicture;
  final String businessId;
  final int rating;
  final String? comment;
  final DateTime createdAt;
  final DateTime updatedAt;

  Review({
    required this.id,
    required this.userId,
    this.userName,
    this.userProfilePicture,
    required this.businessId,
    required this.rating,
    this.comment,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['user'] is Map
          ? json['user']['_id'] ?? json['user']['id'] ?? ''
          : json['user'] ?? json['userId'] ?? '',
      userName: json['user'] is Map
          ? '${json['user']['firstName'] ?? ''} ${json['user']['lastName'] ?? ''}'.trim()
          : json['userId'] is Map
              ? '${json['userId']['firstName'] ?? ''} ${json['userId']['lastName'] ?? ''}'.trim()
              : null,
      userProfilePicture: json['user'] is Map
          ? json['user']['profilePicture']
          : json['userId'] is Map
              ? json['userId']['profilePicture']
              : null,
      businessId: json['business'] is Map
          ? json['business']['_id'] ?? json['business']['id'] ?? ''
          : json['business'] ?? json['businessId'] ?? '',
      rating: json['rating'] ?? 0,
      comment: json['reviewText'] ?? json['comment'],
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
      'userId': userId,
      'businessId': businessId,
      'rating': rating,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  String getTimeAgo() {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays > 365) {
      final years = (difference.inDays / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'} ago';
    } else if (difference.inDays > 30) {
      final months = (difference.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'} ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} ${difference.inDays == 1 ? 'day' : 'days'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} ${difference.inHours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} ${difference.inMinutes == 1 ? 'minute' : 'minutes'} ago';
    } else {
      return 'Just now';
    }
  }
}
