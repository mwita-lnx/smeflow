class Bid {
  final String id;
  final String tenderId;
  final String bidderId;
  final String? bidderName;
  final String? bidderRole;
  final String? bidderProfilePicture;
  final double amount;
  final String currency;
  final String proposal;
  final int deliveryDays;
  final List<String> attachments;
  final String status; // PENDING, ACCEPTED, REJECTED, WITHDRAWN
  final DateTime createdAt;
  final DateTime updatedAt;

  Bid({
    required this.id,
    required this.tenderId,
    required this.bidderId,
    this.bidderName,
    this.bidderRole,
    this.bidderProfilePicture,
    required this.amount,
    required this.currency,
    required this.proposal,
    required this.deliveryDays,
    required this.attachments,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Bid.fromJson(Map<String, dynamic> json) {
    return Bid(
      id: json['_id'] ?? json['id'] ?? '',
      tenderId: json['tender'] is Map
          ? json['tender']['_id'] ?? json['tender']['id'] ?? ''
          : json['tender'] ?? '',
      bidderId: json['bidder'] is Map
          ? json['bidder']['_id'] ?? json['bidder']['id'] ?? ''
          : json['bidder'] ?? '',
      bidderName: json['bidder'] is Map
          ? '${json['bidder']['firstName'] ?? ''} ${json['bidder']['lastName'] ?? ''}'.trim()
          : null,
      bidderRole: json['bidder'] is Map ? json['bidder']['role'] : null,
      bidderProfilePicture: json['bidder'] is Map ? json['bidder']['profilePicture'] : null,
      amount: (json['amount'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'KES',
      proposal: json['proposal'] ?? '',
      deliveryDays: json['deliveryDays'] ?? 0,
      attachments: json['attachments'] != null
          ? List<String>.from(json['attachments'])
          : [],
      status: json['status'] ?? 'PENDING',
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
      'tender': tenderId,
      'bidder': bidderId,
      'amount': amount,
      'currency': currency,
      'proposal': proposal,
      'deliveryDays': deliveryDays,
      'attachments': attachments,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get isPending => status == 'PENDING';
  bool get isAccepted => status == 'ACCEPTED';
  bool get isRejected => status == 'REJECTED';
  bool get isWithdrawn => status == 'WITHDRAWN';

  String formatAmount() {
    return '$currency ${amount.toStringAsFixed(0)}';
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
