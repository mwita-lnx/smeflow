class User {
  final String id;
  final String email;
  final String phone;
  final String firstName;
  final String lastName;
  final String role;
  final bool emailVerified;
  final bool phoneVerified;
  final String? profilePicture;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.phone,
    required this.firstName,
    required this.lastName,
    required this.role,
    required this.emailVerified,
    required this.phoneVerified,
    this.profilePicture,
    required this.createdAt,
  });

  String get fullName => '$firstName $lastName';

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      role: json['role'] ?? 'CONSUMER',
      emailVerified: json['isEmailVerified'] ?? json['emailVerified'] ?? false,
      phoneVerified: json['isPhoneVerified'] ?? json['phoneVerified'] ?? false,
      profilePicture: json['profilePicture'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'emailVerified': emailVerified,
      'phoneVerified': phoneVerified,
      'profilePicture': profilePicture,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
