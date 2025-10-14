import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/tender_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/bid_card.dart';

class TenderDetailScreen extends StatefulWidget {
  final String tenderId;

  const TenderDetailScreen({super.key, required this.tenderId});

  @override
  State<TenderDetailScreen> createState() => _TenderDetailScreenState();
}

class _TenderDetailScreenState extends State<TenderDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenderProvider>().getTenderById(widget.tenderId);
      context.read<TenderProvider>().loadTenderBids(widget.tenderId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      body: Consumer<TenderProvider>(
        builder: (context, tenderProvider, child) {
          if (tenderProvider.isLoading &&
              tenderProvider.selectedTender == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final tender = tenderProvider.selectedTender;
          if (tender == null) {
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
                    'Tender not found',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Go Back'),
                  ),
                ],
              ),
            );
          }

          final isOwner = user?.id == tender.postedBy;

          return CustomScrollView(
            slivers: [
              // App Bar
              SliverAppBar(
                expandedHeight: 120,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    tender.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  titlePadding: const EdgeInsets.only(
                    left: 56,
                    right: 16,
                    bottom: 16,
                  ),
                ),
                actions: [
                  if (isOwner)
                    PopupMenuButton(
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'edit',
                          child: Row(
                            children: [
                              Icon(Icons.edit, size: 18),
                              SizedBox(width: 8),
                              Text('Edit'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'close',
                          child: Row(
                            children: [
                              Icon(Icons.lock, size: 18),
                              SizedBox(width: 8),
                              Text('Close'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'delete',
                          child: Row(
                            children: [
                              Icon(Icons.delete, size: 18, color: AppTheme.primaryRed),
                              SizedBox(width: 8),
                              Text('Delete',
                                  style: TextStyle(color: AppTheme.primaryRed)),
                            ],
                          ),
                        ),
                      ],
                      onSelected: (value) async {
                        if (value == 'delete') {
                          _showDeleteDialog(context, tenderProvider);
                        } else if (value == 'close') {
                          // TODO: Close tender
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Close tender coming soon!')),
                          );
                        } else if (value == 'edit') {
                          // TODO: Edit tender
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Edit tender coming soon!')),
                          );
                        }
                      },
                    ),
                ],
              ),

              // Content
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Status and budget card
                    Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.border),
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
                                      'Budget',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(
                                            color: AppTheme.textSecondary,
                                          ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      tender.displayBudget,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleLarge
                                          ?.copyWith(
                                            fontWeight: FontWeight.w700,
                                            color: AppTheme.primaryGreen,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: tender.isOpen
                                      ? AppTheme.primaryGreen.withOpacity(0.1)
                                      : AppTheme.primaryRed.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  tender.status,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: tender.isOpen
                                        ? AppTheme.primaryGreen
                                        : AppTheme.primaryRed,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              const Icon(Icons.access_time,
                                  size: 16, color: AppTheme.textSecondary),
                              const SizedBox(width: 8),
                              Text(
                                tender.daysRemaining,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: AppTheme.textSecondary,
                                    ),
                              ),
                              const SizedBox(width: 24),
                              const Icon(Icons.location_on,
                                  size: 16, color: AppTheme.textSecondary),
                              const SizedBox(width: 8),
                              Text(
                                tender.location.displayLocation,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: AppTheme.textSecondary,
                                    ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Description
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Description',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            tender.description,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  height: 1.6,
                                ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Requirements
                    if (tender.requirements.isNotEmpty)
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Requirements',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                            const SizedBox(height: 12),
                            ...tender.requirements.map((req) => Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text('• ',
                                          style: TextStyle(fontSize: 16)),
                                      Expanded(
                                        child: Text(
                                          req,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium,
                                        ),
                                      ),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ),

                    const SizedBox(height: 16),

                    // Bids section
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Bids (${tenderProvider.bids.length})',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          if (tenderProvider.bids.isEmpty)
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  children: [
                                    const Icon(
                                      Icons.gavel,
                                      size: 48,
                                      color: AppTheme.textSecondary,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'No bids yet',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: AppTheme.textSecondary,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          else
                            Column(
                              children: tenderProvider.bids.map((bid) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 12),
                                  child: BidCard(
                                    bid: bid,
                                    isOwner: isOwner,
                                    onAccept: () async {
                                      final success = await tenderProvider
                                          .acceptBid(bid.id);
                                      if (success && mounted) {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          const SnackBar(
                                            content:
                                                Text('Bid accepted successfully!'),
                                            backgroundColor: AppTheme.primaryGreen,
                                          ),
                                        );
                                      }
                                    },
                                    onReject: () async {
                                      final success = await tenderProvider
                                          .rejectBid(bid.id);
                                      if (success && mounted) {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          const SnackBar(
                                            content:
                                                Text('Bid rejected successfully!'),
                                            backgroundColor: AppTheme.primaryRed,
                                          ),
                                        );
                                      }
                                    },
                                  ),
                                );
                              }).toList(),
                            ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: Consumer2<TenderProvider, AuthProvider>(
        builder: (context, tenderProvider, authProvider, child) {
          final tender = tenderProvider.selectedTender;
          final user = authProvider.user;

          if (tender == null || !tender.isOpen) return const SizedBox.shrink();

          final isOwner = user?.id == tender.postedBy;
          final canBid =
              user != null && !isOwner && (user.role == 'SME' || user.role == 'BROKER');

          if (!canBid) return const SizedBox.shrink();

          return FloatingActionButton.extended(
            onPressed: () {
              Navigator.of(context).pushNamed(
                '/place-bid',
                arguments: tender.id,
              );
            },
            backgroundColor: AppTheme.primaryGreen,
            icon: const Icon(Icons.gavel, color: Colors.white),
            label:
                const Text('Place Bid', style: TextStyle(color: Colors.white)),
          );
        },
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, TenderProvider tenderProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Tender'),
        content:
            const Text('Are you sure you want to delete this tender? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.of(context).pop();
              final success =
                  await tenderProvider.deleteTender(widget.tenderId);
              if (success && mounted) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Tender deleted successfully'),
                    backgroundColor: AppTheme.primaryGreen,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryRed,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
