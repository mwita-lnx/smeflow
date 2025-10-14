import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../models/tender.dart';

class TenderCard extends StatelessWidget {
  final Tender tender;
  final VoidCallback? onTap;

  const TenderCard({
    super.key,
    required this.tender,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppTheme.border),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row with status badge
              Row(
                children: [
                  Expanded(
                    child: Text(
                      tender.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  _buildStatusBadge(),
                ],
              ),

              const SizedBox(height: 8),

              // Description
              Text(
                tender.description,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.textSecondary,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 12),

              // Info row
              Wrap(
                spacing: 16,
                runSpacing: 8,
                children: [
                  _buildInfoChip(
                    context,
                    Icons.category_outlined,
                    tender.category,
                  ),
                  _buildInfoChip(
                    context,
                    Icons.location_on_outlined,
                    tender.location.displayLocation,
                  ),
                  _buildInfoChip(
                    context,
                    Icons.access_time,
                    tender.daysRemaining,
                  ),
                ],
              ),

              const SizedBox(height: 12),

              const Divider(height: 1),

              const SizedBox(height: 12),

              // Footer row
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Budget',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          tender.displayBudget,
                          style:
                              Theme.of(context).textTheme.titleSmall?.copyWith(
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.primaryGreen,
                                  ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      const Icon(
                        Icons.gavel,
                        size: 16,
                        color: AppTheme.textSecondary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${tender.bidsCount} ${tender.bidsCount == 1 ? 'Bid' : 'Bids'}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              fontWeight: FontWeight.w500,
                            ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge() {
    Color backgroundColor;
    Color textColor;
    String text;

    if (tender.isAwarded) {
      backgroundColor = AppTheme.primaryGreen.withOpacity(0.1);
      textColor = AppTheme.primaryGreen;
      text = 'Awarded';
    } else if (tender.isClosed) {
      backgroundColor = AppTheme.primaryRed.withOpacity(0.1);
      textColor = AppTheme.primaryRed;
      text = 'Closed';
    } else {
      backgroundColor = AppTheme.accentOrange.withOpacity(0.1);
      textColor = AppTheme.accentOrange;
      text = 'Open';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }

  Widget _buildInfoChip(BuildContext context, IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 14,
          color: AppTheme.textSecondary,
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppTheme.textSecondary,
              ),
        ),
      ],
    );
  }
}
