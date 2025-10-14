import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/tender_provider.dart';
import '../../widgets/tender_card.dart';

class TendersScreen extends StatefulWidget {
  const TendersScreen({super.key});

  @override
  State<TendersScreen> createState() => _TendersScreenState();
}

class _TendersScreenState extends State<TendersScreen> {
  String? _selectedStatus;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenderProvider>().loadTenders();
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      final tenderProvider = context.read<TenderProvider>();
      final pagination = tenderProvider.pagination;

      if (pagination != null &&
          pagination['page'] < pagination['totalPages'] &&
          !tenderProvider.isLoading) {
        tenderProvider.loadTenders(
          status: _selectedStatus,
          page: pagination['page'] + 1,
        );
      }
    }
  }

  void _onStatusFilterChanged(String? status) {
    setState(() {
      _selectedStatus = _selectedStatus == status ? null : status;
    });
    context.read<TenderProvider>().loadTenders(status: _selectedStatus);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tenders'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Filter chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: AppTheme.border),
              ),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All', null),
                  const SizedBox(width: 8),
                  _buildFilterChip('Open', 'OPEN'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Closed', 'CLOSED'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Awarded', 'AWARDED'),
                ],
              ),
            ),
          ),

          // Tenders list
          Expanded(
            child: Consumer<TenderProvider>(
              builder: (context, tenderProvider, child) {
                if (tenderProvider.isLoading &&
                    tenderProvider.tenders.isEmpty) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (tenderProvider.error != null &&
                    tenderProvider.tenders.isEmpty) {
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
                          'Error loading tenders',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          tenderProvider.error!,
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            tenderProvider.loadTenders(
                                status: _selectedStatus);
                          },
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }

                if (tenderProvider.tenders.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.work_outline,
                          size: 64,
                          color: AppTheme.textSecondary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No tenders available',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Be the first to post a tender!',
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    await tenderProvider.loadTenders(status: _selectedStatus);
                  },
                  child: ListView.separated(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: tenderProvider.tenders.length +
                        (tenderProvider.isLoading ? 1 : 0),
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      if (index == tenderProvider.tenders.length) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: CircularProgressIndicator(),
                          ),
                        );
                      }

                      final tender = tenderProvider.tenders[index];
                      return TenderCard(
                        tender: tender,
                        onTap: () {
                          Navigator.of(context).pushNamed(
                            '/tender-detail',
                            arguments: tender.id,
                          );
                        },
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String? status) {
    final isSelected = _selectedStatus == status;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => _onStatusFilterChanged(status),
      backgroundColor: Colors.white,
      selectedColor: AppTheme.primaryGreen.withOpacity(0.1),
      checkmarkColor: AppTheme.primaryGreen,
      labelStyle: TextStyle(
        color: isSelected ? AppTheme.primaryGreen : AppTheme.textPrimary,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
      ),
      side: BorderSide(
        color: isSelected ? AppTheme.primaryGreen : AppTheme.border,
      ),
    );
  }
}
