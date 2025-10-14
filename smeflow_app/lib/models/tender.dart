class Tender {
  final String id;
  final String title;
  final String description;
  final String category;
  final TenderBudget budget;
  final DateTime deadline;
  final TenderLocation location;
  final List<String> requirements;
  final List<String> attachments;
  final String postedBy;
  final String postedByRole;
  final String status;
  final int bidsCount;
  final String? awardedTo;
  final DateTime createdAt;
  final DateTime updatedAt;

  Tender({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.budget,
    required this.deadline,
    required this.location,
    required this.requirements,
    required this.attachments,
    required this.postedBy,
    required this.postedByRole,
    required this.status,
    required this.bidsCount,
    this.awardedTo,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Tender.fromJson(Map<String, dynamic> json) {
    return Tender(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      budget: TenderBudget.fromJson(json['budget'] ?? {}),
      deadline: json['deadline'] != null
          ? DateTime.parse(json['deadline'])
          : DateTime.now(),
      location: TenderLocation.fromJson(json['location'] ?? {}),
      requirements: json['requirements'] != null
          ? List<String>.from(json['requirements'])
          : [],
      attachments: json['attachments'] != null
          ? List<String>.from(json['attachments'])
          : [],
      postedBy: json['postedBy'] is String
          ? json['postedBy']
          : (json['postedBy']?['_id'] ?? ''),
      postedByRole: json['postedByRole'] ?? '',
      status: json['status'] ?? 'OPEN',
      bidsCount: json['bidsCount'] ?? 0,
      awardedTo: json['awardedTo'],
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
      'title': title,
      'description': description,
      'category': category,
      'budget': budget.toJson(),
      'deadline': deadline.toIso8601String(),
      'location': location.toJson(),
      'requirements': requirements,
      'attachments': attachments,
      'postedBy': postedBy,
      'postedByRole': postedByRole,
      'status': status,
      'bidsCount': bidsCount,
      'awardedTo': awardedTo,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get isOpen => status == 'OPEN';
  bool get isClosed => status == 'CLOSED';
  bool get isAwarded => status == 'AWARDED';
  bool get hasBids => bidsCount > 0;

  String get displayBudget {
    return '${budget.currency} ${budget.min.toStringAsFixed(0)} - ${budget.max.toStringAsFixed(0)}';
  }

  String get daysRemaining {
    final now = DateTime.now();
    if (deadline.isBefore(now)) return 'Expired';

    final difference = deadline.difference(now);
    if (difference.inDays == 0) return 'Today';
    if (difference.inDays == 1) return '1 day left';
    return '${difference.inDays} days left';
  }
}

class TenderBudget {
  final double min;
  final double max;
  final String currency;

  TenderBudget({
    required this.min,
    required this.max,
    required this.currency,
  });

  factory TenderBudget.fromJson(Map<String, dynamic> json) {
    return TenderBudget(
      min: (json['min'] ?? 0).toDouble(),
      max: (json['max'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'KES',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'min': min,
      'max': max,
      'currency': currency,
    };
  }
}

class TenderLocation {
  final String county;
  final String? subCounty;

  TenderLocation({
    required this.county,
    this.subCounty,
  });

  factory TenderLocation.fromJson(Map<String, dynamic> json) {
    return TenderLocation(
      county: json['county'] ?? '',
      subCounty: json['subCounty'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'county': county,
      'subCounty': subCounty,
    };
  }

  String get displayLocation {
    return subCounty != null ? '$subCounty, $county' : county;
  }
}
