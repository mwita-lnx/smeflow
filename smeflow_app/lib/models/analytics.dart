class AnalyticsOverview {
  final int totalViews;
  final int totalClicks;
  final int contactClicks;
  final int productViews;
  final int shares;
  final int uniqueVisitors;
  final String clickThroughRate;

  AnalyticsOverview({
    required this.totalViews,
    required this.totalClicks,
    required this.contactClicks,
    required this.productViews,
    required this.shares,
    required this.uniqueVisitors,
    required this.clickThroughRate,
  });

  factory AnalyticsOverview.fromJson(Map<String, dynamic> json) {
    return AnalyticsOverview(
      totalViews: json['totalViews'] ?? 0,
      totalClicks: json['totalClicks'] ?? 0,
      contactClicks: json['contactClicks'] ?? 0,
      productViews: json['productViews'] ?? 0,
      shares: json['shares'] ?? 0,
      uniqueVisitors: json['uniqueVisitors'] ?? 0,
      clickThroughRate: json['clickThroughRate']?.toString() ?? '0.00',
    );
  }
}

class ViewsTrendData {
  final String date;
  final int count;

  ViewsTrendData({
    required this.date,
    required this.count,
  });

  factory ViewsTrendData.fromJson(Map<String, dynamic> json) {
    return ViewsTrendData(
      date: json['_id'] ?? '',
      count: json['count'] ?? 0,
    );
  }
}

class SourceData {
  final String source;
  final int count;

  SourceData({
    required this.source,
    required this.count,
  });

  factory SourceData.fromJson(Map<String, dynamic> json) {
    return SourceData(
      source: json['source'] ?? 'unknown',
      count: json['count'] ?? 0,
    );
  }
}

class RoleDistribution {
  final String role;
  final int count;

  RoleDistribution({
    required this.role,
    required this.count,
  });

  factory RoleDistribution.fromJson(Map<String, dynamic> json) {
    return RoleDistribution(
      role: json['role'] ?? 'unknown',
      count: json['count'] ?? 0,
    );
  }
}

class LocationDistribution {
  final String county;
  final int count;

  LocationDistribution({
    required this.county,
    required this.count,
  });

  factory LocationDistribution.fromJson(Map<String, dynamic> json) {
    return LocationDistribution(
      county: json['county'] ?? 'unknown',
      count: json['count'] ?? 0,
    );
  }
}

class CustomerDemographics {
  final List<RoleDistribution> roleDistribution;
  final List<LocationDistribution> locationDistribution;

  CustomerDemographics({
    required this.roleDistribution,
    required this.locationDistribution,
  });

  factory CustomerDemographics.fromJson(Map<String, dynamic> json) {
    return CustomerDemographics(
      roleDistribution: (json['roleDistribution'] as List?)
              ?.map((e) => RoleDistribution.fromJson(e))
              .toList() ??
          [],
      locationDistribution: (json['locationDistribution'] as List?)
              ?.map((e) => LocationDistribution.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class EngagementMetrics {
  final int currentPeriodEvents;
  final int previousPeriodEvents;
  final String growthPercentage;

  EngagementMetrics({
    required this.currentPeriodEvents,
    required this.previousPeriodEvents,
    required this.growthPercentage,
  });

  factory EngagementMetrics.fromJson(Map<String, dynamic> json) {
    return EngagementMetrics(
      currentPeriodEvents: json['currentPeriodEvents'] ?? 0,
      previousPeriodEvents: json['previousPeriodEvents'] ?? 0,
      growthPercentage: json['growthPercentage']?.toString() ?? '0.00',
    );
  }
}

class BusinessAnalyticsSummary {
  final String businessId;
  final String businessName;
  final String? logo;
  final AnalyticsOverview analytics;

  BusinessAnalyticsSummary({
    required this.businessId,
    required this.businessName,
    this.logo,
    required this.analytics,
  });

  factory BusinessAnalyticsSummary.fromJson(Map<String, dynamic> json) {
    final business = json['business'] ?? {};
    return BusinessAnalyticsSummary(
      businessId: business['id'] ?? '',
      businessName: business['name'] ?? '',
      logo: business['logo'],
      analytics: AnalyticsOverview.fromJson(json['analytics'] ?? {}),
    );
  }
}
