import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../models/bid.dart';

class BidCard extends StatelessWidget {
  final Bid bid;
  final bool isOwner;
  final VoidCallback? onAccept;
  final VoidCallback? onReject;
  final VoidCallback? onTap;

  const BidCard({
    super.key,
    required this.bid,
    this.isOwner = false,
    this.onAccept,
    this.onReject,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: bid.isAccepted
              ? AppTheme.primaryGreen
              : bid.isRejected
                  ? AppTheme.primaryRed
                  : AppTheme.border,
          width: bid.isAccepted || bid.isRejected ? 2 : 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with bidder info and status
              Row(
                children: [
                  // Bidder avatar
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: AppTheme.background,
                    backgroundImage: bid.bidderProfilePicture != null
                        ? NetworkImage(bid.bidderProfilePicture!)
                        : null,
                    child: bid.bidderProfilePicture == null
                        ? Text(
                            bid.bidderName
                                    ?.substring(0, 1)
                                    .toUpperCase() ??
                                'B',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          )
                        : null,
                  ),

                  const SizedBox(width: 12),

                  // Bidder name and role
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          bid.bidderName ?? 'Anonymous',
                          style:
                              Theme.of(context).textTheme.titleSmall?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Text(
                              _getRoleLabel(bid.bidderRole ?? ''),
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '•',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              bid.getTimeAgo(),
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Status badge
                  _buildStatusBadge(),
                ],
              ),

              const SizedBox(height: 12),

              // Proposal
              Text(
                bid.proposal,
                style: Theme.of(context).textTheme.bodyMedium,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 12),

              const Divider(height: 1),

              const SizedBox(height: 12),

              // Bid details
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Bid Amount',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          bid.formatAmount(),
                          style:
                              Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.primaryGreen,
                                  ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Delivery',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.textSecondary,
                            ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${bid.deliveryDays} ${bid.deliveryDays == 1 ? 'day' : 'days'}',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ],
                  ),
                ],
              ),

              // Action buttons for owner
              if (isOwner && bid.isPending) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: onReject,
                        icon: const Icon(Icons.close, size: 18),
                        label: const Text('Reject'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primaryRed,
                          side: const BorderSide(color: AppTheme.primaryRed),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: onAccept,
                        icon: const Icon(Icons.check, size: 18),
                        label: const Text('Accept'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryGreen,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge() {
    if (bid.isAccepted) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppTheme.primaryGreen.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              size: 14,
              color: AppTheme.primaryGreen,
            ),
            const SizedBox(width: 4),
            const Text(
              'Accepted',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppTheme.primaryGreen,
              ),
            ),
          ],
        ),
      );
    } else if (bid.isRejected) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppTheme.primaryRed.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'Rejected',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: AppTheme.primaryRed,
          ),
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppTheme.accentOrange.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'Pending',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: AppTheme.accentOrange,
          ),
        ),
      );
    }
  }

  String _getRoleLabel(String role) {
    switch (role) {
      case 'SME':
        return 'Business Owner';
      case 'BROKER':
        return 'Broker';
      case 'CONSUMER':
        return 'Consumer';
      default:
        return role;
    }
  }
}
