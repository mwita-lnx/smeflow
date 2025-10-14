import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_theme.dart';
import '../../providers/business_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/review_provider.dart';
import '../../widgets/review_card.dart';
import '../review/write_review_screen.dart';

class BusinessDetailScreen extends StatefulWidget {
  final String businessId;

  const BusinessDetailScreen({super.key, required this.businessId});

  @override
  State<BusinessDetailScreen> createState() => _BusinessDetailScreenState();
}

class _BusinessDetailScreenState extends State<BusinessDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<BusinessProvider>().getBusinessById(widget.businessId);
      context.read<ReviewProvider>().loadBusinessReviews(widget.businessId);
    });
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _makePhoneCall(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _sendEmail(String email) async {
    final uri = Uri.parse('mailto:$email');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<BusinessProvider>(
        builder: (context, businessProvider, child) {
          if (businessProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (businessProvider.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppTheme.primaryRed,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading business',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<BusinessProvider>().getBusinessById(widget.businessId);
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final business = businessProvider.selectedBusiness;
          if (business == null) {
            return const Center(child: Text('Business not found'));
          }

          return CustomScrollView(
            slivers: [
              // App bar with image
              SliverAppBar(
                expandedHeight: 300,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: business.images.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: business.images.first,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: AppTheme.background,
                          ),
                        )
                      : Container(
                          color: AppTheme.background,
                          child: const Icon(
                            Icons.store,
                            size: 80,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      business.businessName,
                                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                            fontWeight: FontWeight.w700,
                                          ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      business.category,
                                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                            color: AppTheme.textSecondary,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              if (business.verified)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryGreen.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.verified,
                                        size: 16,
                                        color: AppTheme.primaryGreen,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Verified',
                                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: AppTheme.primaryGreen,
                                              fontWeight: FontWeight.w600,
                                            ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),

                          const SizedBox(height: 12),

                          // Rating
                          Row(
                            children: [
                              ...List.generate(5, (index) {
                                return Icon(
                                  index < business.averageRating.round()
                                      ? Icons.star
                                      : Icons.star_border,
                                  color: AppTheme.primaryGreen,
                                  size: 20,
                                );
                              }),
                              const SizedBox(width: 8),
                              Text(
                                '${business.averageRating.toStringAsFixed(1)} (${business.totalRatings} reviews)',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ),

                          const SizedBox(height: 12),

                          // Location
                          Row(
                            children: [
                              const Icon(
                                Icons.location_on,
                                size: 20,
                                color: AppTheme.primaryRed,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  '${business.subCounty ?? ''}, ${business.county}',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 16),

                          // Action buttons
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () => _makePhoneCall(business.contactPhone),
                                  icon: const Icon(Icons.phone),
                                  label: const Text('Call'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.primaryGreen,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () => _sendEmail(business.contactEmail),
                                  icon: const Icon(Icons.email_outlined),
                                  label: const Text('Email'),
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Description
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      color: Colors.white,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'About',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            business.description,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  height: 1.6,
                                ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Contact info
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      color: Colors.white,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Contact Information',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          const SizedBox(height: 16),
                          _buildContactItem(
                            context,
                            Icons.phone_outlined,
                            'Phone',
                            business.contactPhone,
                          ),
                          const SizedBox(height: 12),
                          _buildContactItem(
                            context,
                            Icons.email_outlined,
                            'Email',
                            business.contactEmail,
                          ),
                          if (business.website != null) ...[
                            const SizedBox(height: 12),
                            _buildContactItem(
                              context,
                              Icons.language,
                              'Website',
                              business.website!,
                              onTap: () => _launchUrl(business.website!),
                            ),
                          ],
                        ],
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Reviews section
                    Consumer<ReviewProvider>(
                      builder: (context, reviewProvider, child) {
                        return Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(20),
                          color: Colors.white,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Reviews (${business.totalRatings})',
                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                  if (reviewProvider.reviews.isNotEmpty)
                                    TextButton(
                                      onPressed: () {
                                        // Show all reviews in a bottom sheet
                                        showModalBottomSheet(
                                          context: context,
                                          isScrollControlled: true,
                                          builder: (context) => DraggableScrollableSheet(
                                            initialChildSize: 0.9,
                                            builder: (context, scrollController) => Container(
                                              padding: const EdgeInsets.all(20),
                                              child: Column(
                                                children: [
                                                  Text(
                                                    'All Reviews',
                                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                                          fontWeight: FontWeight.w600,
                                                        ),
                                                  ),
                                                  const SizedBox(height: 16),
                                                  Expanded(
                                                    child: ListView.separated(
                                                      controller: scrollController,
                                                      itemCount: reviewProvider.reviews.length,
                                                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                                                      itemBuilder: (context, index) {
                                                        final review = reviewProvider.reviews[index];
                                                        return ReviewCard(review: review);
                                                      },
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        );
                                      },
                                      child: const Text('See all'),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              if (reviewProvider.isLoading)
                                const Center(child: CircularProgressIndicator())
                              else if (reviewProvider.reviews.isEmpty)
                                Center(
                                  child: Column(
                                    children: [
                                      const Icon(
                                        Icons.rate_review_outlined,
                                        size: 48,
                                        color: AppTheme.textSecondary,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'No reviews yet',
                                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                              color: AppTheme.textSecondary,
                                            ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Be the first to review this business!',
                                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: AppTheme.textSecondary,
                                            ),
                                      ),
                                    ],
                                  ),
                                )
                              else
                                Column(
                                  children: reviewProvider.reviews
                                      .take(3)
                                      .map((review) => Padding(
                                            padding: const EdgeInsets.only(bottom: 12),
                                            child: ReviewCard(review: review),
                                          ))
                                      .toList(),
                                ),
                            ],
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ],
          );
        },
      ),

      // Write review button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final authProvider = context.read<AuthProvider>();
          if (authProvider.user == null) {
            // Guest user - prompt to login
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Login Required'),
                content: const Text('Please login to write a review'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      Navigator.of(context).pushNamed('/login');
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
            );
          } else {
            // Navigate to write review screen
            final businessProvider = context.read<BusinessProvider>();
            final result = await Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => WriteReviewScreen(
                  businessId: widget.businessId,
                  business: businessProvider.selectedBusiness,
                ),
              ),
            );

            // Refresh reviews if a review was submitted
            if (result == true && mounted) {
              context.read<ReviewProvider>().loadBusinessReviews(widget.businessId);
            }
          }
        },
        backgroundColor: AppTheme.primaryGreen,
        icon: const Icon(Icons.rate_review, color: Colors.white),
        label: const Text(
          'Write Review',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildContactItem(
    BuildContext context,
    IconData icon,
    String label,
    String value, {
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: AppTheme.primaryGreen),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                ),
                Text(
                  value,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                ),
              ],
            ),
          ),
          if (onTap != null)
            const Icon(Icons.open_in_new, size: 20, color: AppTheme.textSecondary),
        ],
      ),
    );
  }
}
