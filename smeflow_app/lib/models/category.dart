class Category {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final String? icon;
  final int businessCount;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.icon,
    required this.businessCount,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['_id'] ?? json['id'],
      name: json['name'],
      slug: json['slug'],
      description: json['description'],
      icon: json['icon'],
      businessCount: json['businessCount'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'description': description,
      'icon': icon,
      'businessCount': businessCount,
    };
  }
}
